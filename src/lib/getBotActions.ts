// Definimos un tipo para cada acción
type BotActionDefinition = {
  intent: string[];
  handler: (contextData?: any) => Promise<string>;
};

// Tipo para definir las acciones indexadas por string
type BotScreenActions = {
  [key: string]: BotActionDefinition;
};

import { BotActions } from "./botActions";

export async function getBotAction(
  currentScreen: keyof typeof BotActions,
  userMessage: string,
  contextData?: any
): Promise<string> {
  // Forzamos screenActions al tipo BotScreenActions para permitir la indexación por string
  const screenActions = BotActions[currentScreen] as BotScreenActions;
  if (!screenActions) return "I can't help you on this screen yet.";

  const normalizedMsg = userMessage.toLowerCase();

  // Comando especial: listar comandos disponibles
  if (
    ["help", "commands", "list commands", "what can i do"].some(cmd =>
      normalizedMsg.includes(cmd)
    )
  ) {
    const list = Object.entries(screenActions)
      .map(([key, action]) => `- ${action.intent?.[0] || key}`)
      .join("\n");
    return `Here are the available commands for this screen:\n${list}`;
  }

  for (const actionKey in screenActions) {
    const action = screenActions[actionKey];
    if (!action.intent || !Array.isArray(action.intent)) continue;

    // Tipamos el parámetro phrase como string
    const matched = action.intent.some((phrase: string) =>
      normalizedMsg.includes(phrase.toLowerCase())
    );

    if (matched) {
      return await action.handler(contextData);
    }
  }

  return "Sorry, I didn't understand what you meant.";
}
