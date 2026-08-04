import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Copy,
  Check,
  Zap,
  Wand2,
  RefreshCw,
} from "lucide-react";

export function AIAssistantWorkspace() {
  const { createProject } = useStudio();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am your AI Creative Assistant in Studio.Lizzdo.com. How can I help you write headlines, brainstorm color palettes, generate image prompts, or critique your layouts today?",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!inputPrompt.trim()) return;
    const userMsg = inputPrompt;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInputPrompt("");
    setIsLoading(true);

    setTimeout(() => {
      let aiReply = "Here is a high-converting headline & color suggestion for your campaign:\n\n• Headline: 'REVOLUTIONIZE YOUR WORKFLOW WITH AI'\n• Primary Color: #00F5FF (Neon Cyan)\n• Secondary Color: #A855F7 (Neon Purple)\n• Suggested Prompt: 'Cyberpunk futuristic dashboard interface, glowing neon lights, 8k render'";
      setMessages((prev) => [...prev, { role: "assistant", text: aiReply }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* HEADER */}
      <div className="h-14 bg-neutral-950 border-b border-white/10 px-6 flex items-center justify-between font-mono text-xs text-gray-300 shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-neon-cyan animate-pulse" />
          <span className="font-bold text-white text-sm uppercase">AI Creative Assistant</span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] font-bold">
          GEMINI INTELLIGENCE
        </span>
      </div>

      {/* CHAT LOG AREA */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4 bg-neutral-900/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 max-w-3xl ${
              m.role === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                m.role === "user"
                  ? "bg-neon-purple text-white"
                  : "bg-neon-cyan text-black"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl border font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-lg ${
                m.role === "user"
                  ? "bg-neon-purple/20 border-neon-purple/40 text-white"
                  : "bg-neutral-900 border-white/10 text-gray-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-neon-cyan font-mono text-xs">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>AI Thinking...</span>
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <div className="p-4 bg-neutral-950 border-t border-white/10 font-mono text-xs shrink-0">
        <div className="flex items-center gap-2 max-w-4xl mx-auto bg-neutral-900 border border-white/15 rounded-2xl p-2">
          <input
            type="text"
            placeholder="Ask AI Assistant for slogans, color palettes, or image prompt ideas..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-transparent px-3 text-white focus:outline-none placeholder-gray-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputPrompt.trim() || isLoading}
            className="px-4 py-2 rounded-xl bg-neon-cyan text-black font-bold hover:bg-neon-cyan/80 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
