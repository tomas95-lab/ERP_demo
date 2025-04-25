import { Bot } from "lucide-react";
import { Textarea } from "./ui/textarea";
import Message from "./Message";
import { useState, useRef, useEffect } from "react";
import { getBotAction } from "@/lib/getBotActions";
import { botActions } from "@/lib/botActions";
import { useScreen } from "./ScreenContext";

export default function BotComponent() {
  const [messages, setMessages] = useState<
    { content: string; role: "user" | "bot" | "model" }[]
  >([]);
  const [userMessage, setUserMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { currentScreen } = useScreen();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleUserMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
  };

  const handleChat = async () => {
    if (userMessage.trim() === "") return;

    const input = userMessage;
    setMessages((prev) => [...prev, { content: input, role: "user" }]);
    setUserMessage("");

    const reply = await getBotAction(currentScreen as keyof typeof botActions, input);

    setTimeout(() => {
      setMessages((prev) => [...prev, { content: reply, role: "bot" }]);
    }, 800);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div
        onClick={toggleChat}
        className="bg-black hover:bg-black/80 transition-colors fixed right-4 bottom-4 w-12 h-12 rounded-full text-white cursor-pointer flex items-center justify-center shadow-lg z-50"
      >
        <Bot size={20} />
      </div>

      {isOpen && (
        <div className="h-96 w-80 fixed bg-white right-4 bottom-16 rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
          <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <Message key={index} content={msg.content} role={msg.role} />
            ))}
          </div>
          <div className="border-t border-gray-200 p-2 flex items-center">
            <Textarea
              className="flex-1 border-none outline-none resize-none"
              placeholder="Type a message..."
              onChange={handleUserMessage}
              value={userMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChat();
                }
              }}
            />
            <button
              onClick={handleChat}
              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
