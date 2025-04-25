// Type definitions for bot actions and responses
type BotActionDefinition = {
  intent: string[];
  handler: (contextData?: any) => Promise<string>;
};

type BotScreenActions = {
  [key: string]: BotActionDefinition;
};

import { botActions } from "./botActions";

// Map screen names to their corresponding action handlers
const screenMapper: { [key: string]: keyof typeof botActions } = {
  "Dashboard": "Dashboard",
  "Projects": "Projects",
  "Financials": "Financials",
  "Suppliers": "Suppliers",
  "Orders": "Orders",
};

// Main function to process user messages and return bot responses
export async function getBotAction(
  currentScreen: string,
  userMessage: string,
  contextData?: any
): Promise<string> {
  // Map the current screen to its corresponding actions
  const mappedScreen = screenMapper[currentScreen];
  
  if (!mappedScreen) {
    // Return a message if the screen is not recognized
    return `I can help you with: ${Object.keys(screenMapper).join(', ')}. Please navigate to one of these screens.`;
  }

  // Retrieve actions for the mapped screen
  const screenActions = botActions[mappedScreen] as BotScreenActions;
  if (!screenActions) return "I can't help you on this screen yet.";

  // Normalize the user message for comparison
  const normalizedMsg = userMessage.toLowerCase();

  // Check if the user is asking for help or available commands
  if (
    ["help", "commands", "list commands", "what can i do"].some(cmd =>
      normalizedMsg.includes(cmd)
    )
  ) {
    // Generate a list of available commands for the current screen
    const list = Object.entries(screenActions)
      .map(([_, action]) => `- ${action.intent[0]}`)
      .join("\n");
    return `Available commands for ${currentScreen}:\n${list}`;
  }

  // Iterate through actions to find a matching intent
  for (const actionKey in screenActions) {
    const action = screenActions[actionKey];
    if (!action.intent || !Array.isArray(action.intent)) continue;

    const matched = action.intent.some((phrase: string) =>
      normalizedMsg.includes(phrase.toLowerCase())
    );

    if (matched) {
      // Execute the handler for the matched intent
      return await action.handler(contextData);
    }
  }

  // Default response if no intent matches
  return `I understand you're in the ${currentScreen} screen. Try asking for "help" to see available commands.`;
}
