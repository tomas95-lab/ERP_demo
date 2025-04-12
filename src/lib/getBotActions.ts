import { BotActions } from "./botActions";

export async function getBotAction(
  currentScreen: keyof typeof BotActions,
  userMessage: string,
  contextData?: any
): Promise<string> {
  const screenActions = BotActions[currentScreen];
  if (!screenActions) return "I can't help you on this screen yet.";

  const normalizedMsg = userMessage.toLowerCase();

  // Comando especial: listar comandos disponibles
  if (["help", "commands", "list commands", "what can i do"].some(cmd => normalizedMsg.includes(cmd))) {
    const list = Object.entries(screenActions)
      .map(([key, action]) => `- ${action.intent?.[0] || key}`)
      .join("\n");
    return `Here are the available commands for this screen:\n${list}`;
  }

  for (const actionKey in screenActions) {
    const action = screenActions[actionKey];
    if (!action.intent || !Array.isArray(action.intent)) continue;

    const matched = action.intent.some((phrase) =>
      normalizedMsg.includes(phrase.toLowerCase())
    );

    if (matched) {
      return await action.handler(contextData);
    }
  }

  return "Sorry, I didn't understand what you meant.";
}
