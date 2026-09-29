"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/lib/realtime/types";

interface CollaborativeChatProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
}

export function CollaborativeChat({
  messages,
  currentUserId,
  onSendMessage,
}: CollaborativeChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 text-zinc-100 font-mono text-xs px-3.5 py-2.5 shadow-2xl transition-all"
          title="Open Lab Partner Chat"
        >
          <MessageSquare className="h-4 w-4 text-cyan-400" />
          <span>Lab Chat</span>
          {messages.length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-zinc-950">
              {messages.length}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-40 w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur-xl flex flex-col h-[420px] max-h-[75vh] overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 p-3 bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-cyan-400" />
              <span className="font-display font-semibold text-xs text-zinc-100">
                Collaborative Lab Chat
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
            {messages.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 font-mono italic">
                No chat messages yet. Coordinate your experiment with peers here!
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId === currentUserId;
                if (m.isSystem) {
                  return (
                    <div
                      key={m.id}
                      className="text-center font-mono text-[10px] text-zinc-400 py-1 px-2 rounded bg-zinc-900/60 border border-zinc-800/40 my-1"
                    >
                      {m.text}
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] text-zinc-400 font-mono mb-0.5">
                      {isMe ? "You" : m.senderName}
                    </span>
                    <div
                      className={`rounded-xl px-3 py-1.5 max-w-[85%] ${
                        isMe
                          ? "bg-cyan-600 text-white font-medium"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-200"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-2.5 border-t border-zinc-800/80 bg-zinc-900/40 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send message to partners..."
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
            />
            <Button type="submit" variant="amber" size="sm" className="h-8 w-8 p-0 shrink-0">
              <Send className="h-3 w-3" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
