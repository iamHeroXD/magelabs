"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  Lightbulb,
  Stethoscope,
  BookOpen,
  ChevronDown,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CircuitSimulationResult,
  CircuitComponent,
  WireConnection,
} from "@/lib/experiments/types";
import { AdvisorRequest, AdvisorResponse } from "@/lib/ai/local-advisor";

interface LabAssistantWidgetProps {
  experimentId: string;
  experimentTitle: string;
  simulationResult: CircuitSimulationResult;
  components: CircuitComponent[];
  wires: WireConnection[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: "hint" | "explain" | "diagnose" | "deep-dive";
  suggestedAction?: string;
  timestamp: number;
}

export function LabAssistantWidget({
  experimentId,
  experimentTitle,
  simulationResult,
  components,
  wires,
}: LabAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuestion, setInputQuestion] = useState("");
  const [activeMode, setActiveMode] = useState<"explain" | "hint" | "diagnose" | "deep-dive">("explain");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial_msg",
      role: "assistant",
      content:
        "Greetings! I am your MageLabs Scientific Assistant. I am directly observing your laboratory bench in real time. Ask me anything about your circuit, request a diagnosis if something isn't working, or ask for a hint!",
      mode: "explain",
      timestamp: Date.now(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleAsk = async (customPrompt?: string, modeOverride?: typeof activeMode) => {
    const questionText = customPrompt || inputQuestion;
    if (!questionText.trim() || isLoading) return;

    const mode = modeOverride || activeMode;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: questionText,
      mode,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setIsLoading(true);

    try {
      const payload: AdvisorRequest = {
        experimentId,
        experimentTitle,
        question: questionText,
        mode,
        simulationResult,
        components,
        wires,
      };

      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: AdvisorResponse = await res.json();

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        content: data.answer,
        mode: data.mode,
        suggestedAction: data.suggestedAction,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI assistant request failed:", err);
      // Fallback response
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: "assistant",
          content:
            "I analyzed your circuit state: The power supply is set to " +
            simulationResult.totalVoltage.toFixed(1) +
            "V with loop current of " +
            simulationResult.totalCurrent.toFixed(3) +
            "A. " +
            (simulationResult.isOpenSwitch
              ? "Your knife switch is OPEN. Close it to energize the circuit."
              : !simulationResult.isClosedCircuit
              ? "Ensure your wires form a continuous unbroken loop."
              : "Current and voltage obey Ohm's Law (V = IR)."),
          mode: "diagnose",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic contextual chip suggestions
  const getContextChips = () => {
    const chips: { label: string; mode: typeof activeMode; query: string }[] = [];

    if (!simulationResult.isClosedCircuit) {
      chips.push({
        label: "Why is current 0?",
        mode: "diagnose",
        query: "Why is the current zero and circuit not working?",
      });
      chips.push({
        label: "How to connect wires?",
        mode: "hint",
        query: "Give me a hint on how to connect the components in series.",
      });
    } else {
      chips.push({
        label: "Explain V-I slope",
        mode: "explain",
        query: "What does the slope of the Voltage vs Current graph represent?",
      });
      chips.push({
        label: "What if R increases?",
        mode: "explain",
        query: "What happens to the current if I increase the resistance?",
      });
      chips.push({
        label: "Deep dive formula",
        mode: "deep-dive",
        query: "Can you provide the microscopic physical derivation of Ohm's Law?",
      });
    }

    return chips;
  };

  return (
    <>
      {/* Floating Assistant Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display font-semibold text-xs px-4 py-3 shadow-2xl transition-all hover:scale-105 active:scale-95 group"
          title="Open AI Lab Assistant"
        >
          <Sparkles className="h-4 w-4 fill-current group-hover:rotate-12 transition-transform" />
          <span>Ask AI Lab Assistant</span>
          <span className="h-2 w-2 rounded-full bg-emerald-700 animate-ping" />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur-xl flex flex-col h-[520px] max-h-[80vh] overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 p-3.5 bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs text-zinc-100 flex items-center gap-1.5">
                  AI Lab Tutor
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Online
                  </span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  State-Aware Context Injected
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-4 gap-1 p-2 bg-zinc-900/40 border-b border-zinc-800/60 text-[10px] font-mono">
            <button
              onClick={() => setActiveMode("explain")}
              className={`py-1 rounded flex items-center justify-center gap-1 transition-colors ${
                activeMode === "explain"
                  ? "bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BookOpen className="h-3 w-3" /> Explain
            </button>
            <button
              onClick={() => setActiveMode("hint")}
              className={`py-1 rounded flex items-center justify-center gap-1 transition-colors ${
                activeMode === "hint"
                  ? "bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Lightbulb className="h-3 w-3" /> Hint
            </button>
            <button
              onClick={() => setActiveMode("diagnose")}
              className={`py-1 rounded flex items-center justify-center gap-1 transition-colors ${
                activeMode === "diagnose"
                  ? "bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Stethoscope className="h-3 w-3" /> Diagnose
            </button>
            <button
              onClick={() => setActiveMode("deep-dive")}
              className={`py-1 rounded flex items-center justify-center gap-1 transition-colors ${
                activeMode === "deep-dive"
                  ? "bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sparkles className="h-3 w-3" /> Theory
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs leading-relaxed">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-xl p-3 max-w-[88%] shadow-sm ${
                    m.role === "user"
                      ? "bg-amber-500 text-zinc-950 font-medium"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {m.suggestedAction && (
                    <div className="mt-2 pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-amber-400/90 flex items-start gap-1">
                      <span className="font-bold">Next Action:</span> {m.suggestedAction}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-zinc-500 font-mono mt-1 px-1">
                  {new Date(m.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 max-w-[80%] text-zinc-400 text-xs">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
                Analyzing laboratory apparatus & physics state...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contextual Suggestion Chips */}
          <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto border-t border-zinc-900 bg-zinc-950/80">
            {getContextChips().map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(chip.query, chip.mode)}
                className="whitespace-nowrap rounded-full bg-zinc-900 px-2.5 py-1 text-[10px] font-mono text-zinc-300 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-300 transition-colors shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask about voltage, resistance, or diagnosis..."
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80"
              />
              <Button
                type="submit"
                variant="amber"
                size="sm"
                disabled={!inputQuestion.trim() || isLoading}
                className="h-8 w-8 p-0 shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
