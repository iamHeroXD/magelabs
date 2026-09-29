"use client";

import { useState } from "react";
import { Sparkles, X, Send, Lightbulb, Compass, BookOpen, AlertCircle } from "lucide-react";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  buretteDispensedMl: number;
  currentPh: number;
  hasIndicator: boolean;
  isStopcockOpen: boolean;
  isEndpointReached: boolean;
  onHighlightApparatus: (id: string | null) => void;
}

export function ChemistryAIAssistant({
  isOpen,
  onClose,
  buretteDispensedMl,
  currentPh,
  hasIndicator,
  isStopcockOpen,
  isEndpointReached,
  onHighlightApparatus,
}: AIAssistantProps) {
  const [mode, setMode] = useState<"hint" | "explain" | "guide" | "theory">("guide");
  const [messages, setMessages] = useState<
    { role: "assistant" | "user"; text: string; apparatus?: string }[]
  >([
    {
      role: "assistant",
      text: "I am observing your titration workbench. Ensure 2-3 drops of phenolphthalein indicator have been added before opening the stopcock.",
      apparatus: "indicator",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userQuery = inputText.trim();
    setMessages((prev) => [...prev, { role: "user", text: userQuery }]);
    setInputText("");

    // Generate intelligent, context-aware chemistry response
    setTimeout(() => {
      let response = "";
      let targetApparatus: string | undefined = undefined;

      const q = userQuery.toLowerCase();

      if (!hasIndicator) {
        response =
          "I notice there is **no phenolphthalein indicator** in the analyte flask. Without an indicator, you cannot visually perceive the endpoint, even though neutralization occurs at 25.0 mL. Click on the amber dropper bottle to add 3 drops.";
        targetApparatus = "indicator";
      } else if (q.includes("endpoint") || q.includes("color") || q.includes("pink")) {
        if (currentPh < 8.2) {
          response = `You have dispensed **${buretteDispensedMl.toFixed(
            2
          )} mL** of titrant (current pH is **${currentPh.toFixed(
            2
          )}**). The solution remains acidic. As you approach 24.5 mL, switch to single dropwise dispensing (+0.05 mL) so you don't overshoot.`;
          targetApparatus = "burette";
        } else if (currentPh >= 8.2 && currentPh <= 8.6) {
          response = `🎯 **Endpoint Achieved!** Notice the faint, translucent baby pink color. The solution is at pH **${currentPh.toFixed(
            2
          )}**, matching the phenolphthalein transition threshold. Close the stopcock and record your reading!`;
          targetApparatus = "flask";
        } else {
          response = `⚠️ The flask has turned deep magenta (pH **${currentPh.toFixed(
            2
          )}**). You have over-titrated by adding excess NaOH. In your notebook, record this trial and note the overshoot.`;
          targetApparatus = "flask";
        }
      } else if (q.includes("ph") || q.includes("meter") || q.includes("reading")) {
        response = `The digital pH meter is currently reading **${currentPh.toFixed(
          2
        )}**. Before equivalence, pH changes slowly because [H+] is high. Near 25.00 mL, one drop causes a steep inflection from pH 4 to pH 10.`;
        targetApparatus = "ph-meter";
      } else if (q.includes("stopcock") || q.includes("burette") || q.includes("flow")) {
        response =
          "The PTFE stopcock rotates to modulate flow. Use continuous flow initially to reach ~23 mL, then use the Single Drop button (+0.05 mL) for precise volumetric delivery.";
        targetApparatus = "burette";
      } else {
        response = `Current setup: V_titrant = ${buretteDispensedMl.toFixed(
          2
        )} mL, pH = ${currentPh.toFixed(2)}, indicator = ${
          hasIndicator ? "present" : "missing"
        }. Let me know if you need help with stoichiometry or endpoint detection.`;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: response, apparatus: targetApparatus },
      ]);

      if (targetApparatus) {
        onHighlightApparatus(targetApparatus);
        setTimeout(() => onHighlightApparatus(null), 4000);
      }
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[550px] bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl flex flex-col overflow-hidden text-xs font-mono pointer-events-auto animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-900 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            AI LAB ASSISTANT // BENCH STATE AWARE
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-zinc-900 bg-zinc-950 text-[10px] text-zinc-400">
        <button
          onClick={() => setMode("guide")}
          className={`flex-1 py-1.5 flex items-center justify-center gap-1 border-r border-zinc-900 transition-colors ${
            mode === "guide" ? "bg-zinc-900 text-white font-bold" : "hover:text-zinc-200"
          }`}
        >
          <Compass className="h-3 w-3" />
          <span>GUIDE</span>
        </button>
        <button
          onClick={() => setMode("hint")}
          className={`flex-1 py-1.5 flex items-center justify-center gap-1 border-r border-zinc-900 transition-colors ${
            mode === "hint" ? "bg-zinc-900 text-white font-bold" : "hover:text-zinc-200"
          }`}
        >
          <Lightbulb className="h-3 w-3" />
          <span>HINT</span>
        </button>
        <button
          onClick={() => setMode("theory")}
          className={`flex-1 py-1.5 flex items-center justify-center gap-1 transition-colors ${
            mode === "theory" ? "bg-zinc-900 text-white font-bold" : "hover:text-zinc-200"
          }`}
        >
          <BookOpen className="h-3 w-3" />
          <span>THEORY</span>
        </button>
      </div>

      {/* Live State Banner */}
      <div className="px-4 py-1.5 bg-zinc-900/40 border-b border-zinc-900 flex justify-between text-[10px] text-zinc-400">
        <span>V_NaOH: {buretteDispensedMl.toFixed(2)} mL</span>
        <span>pH: {currentPh.toFixed(2)}</span>
        <span className={hasIndicator ? "text-emerald-400" : "text-amber-400"}>
          Ind: {hasIndicator ? "OK" : "NONE"}
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[300px]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded text-xs leading-relaxed ${
              m.role === "user"
                ? "bg-zinc-800 text-white ml-6 border border-zinc-700 font-sans"
                : "bg-zinc-900/80 text-zinc-300 mr-4 border border-zinc-800 font-sans"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-zinc-900 bg-zinc-950 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about titration, pH, or indicator..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-white text-black rounded hover:bg-zinc-200 transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
