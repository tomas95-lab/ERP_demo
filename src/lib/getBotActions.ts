// Definimos un tipo para cada acción
type BotActionDefinition = {
  intent: string[];
  handler: (contextData?: any) => Promise<string>;
};

// Tipo para definir las acciones indexadas por string
type BotScreenActions = {
  [key: string]: BotActionDefinition;
};

import { botActions } from "./botActions";

// Mapeo de nombres de pantalla a claves de botActions
const screenMapper: { [key: string]: keyof typeof botActions } = {
  "Dashboard": "Dashboard",
  "Projects": "Projects",
  "Financials": "Financials",
  "Suppliers": "Suppliers",
  "Orders": "Orders",
};

export async function getBotAction(
  currentScreen: string,
  userMessage: string,
  contextData?: any
): Promise<string> {
  // Obtener la clave correcta del botActions usando el mapeo
  const mappedScreen = screenMapper[currentScreen];
  
  // Si no hay mapeo para esta pantalla, devolver mensaje de error
  if (!mappedScreen) {
    return `I can help you with: ${Object.keys(screenMapper).join(', ')}. Please navigate to one of these screens.`;
  }

  // Usar la clave mapeada para obtener las acciones
  const screenActions = botActions[mappedScreen] as BotScreenActions;
  if (!screenActions) return "I can't help you on this screen yet.";

  const normalizedMsg = userMessage.toLowerCase();

  // Comando especial: listar comandos disponibles
  if (
    ["help", "commands", "list commands", "what can i do"].some(cmd =>
      normalizedMsg.includes(cmd)
    )
  ) {
    const list = Object.entries(screenActions)
      .map(([key, action]) => `- ${action.intent[0]}`)
      .join("\n");
    return `Available commands for ${currentScreen}:\n${list}`;
  }

  // Buscar y ejecutar el comando correspondiente
  for (const actionKey in screenActions) {
    const action = screenActions[actionKey];
    if (!action.intent || !Array.isArray(action.intent)) continue;

    const matched = action.intent.some((phrase: string) =>
      normalizedMsg.includes(phrase.toLowerCase())
    );

    if (matched) {
      return await action.handler(contextData);
    }
  }

  return `I understand you're in the ${currentScreen} screen. Try asking for "help" to see available commands.`;
}
