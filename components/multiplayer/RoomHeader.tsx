"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Copy, Check, ArrowLeft, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LabParticipant } from "@/lib/realtime/types";

interface RoomHeaderProps {
  roomId: string;
  participants: LabParticipant[];
  currentUserId: string;
  onLeaveRoom?: () => void;
}

export function RoomHeader({
  roomId,
  participants,
  currentUserId,
  onLeaveRoom,
}: RoomHeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyRoomLink = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="absolute top-16 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Room code banner */}
      <div className="flex items-center gap-2 rounded-xl bg-zinc-950/90 border border-zinc-800 p-2 pl-3 shadow-2xl backdrop-blur-md pointer-events-auto">
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span className="text-zinc-400 uppercase">Room:</span>
          <span className="font-bold text-amber-400 tracking-wider">{roomId}</span>
        </div>

        <div className="h-4 w-[1px] bg-zinc-800" />

        <Button
          variant="ghost"
          size="sm"
          onClick={copyRoomLink}
          className="h-7 text-xs px-2 gap-1 text-zinc-300 hover:text-white"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          {copied ? "Link Copied!" : "Invite Link"}
        </Button>
      </div>

      {/* Online Participants Badge List */}
      <div className="flex items-center gap-1.5 rounded-xl bg-zinc-950/90 border border-zinc-800 p-1.5 px-3 shadow-2xl backdrop-blur-md pointer-events-auto">
        <Users className="h-3.5 w-3.5 text-zinc-400 mr-1" />
        <span className="text-[11px] font-mono text-zinc-400 mr-2">
          {participants.length} Active:
        </span>
        <div className="flex items-center -space-x-1">
          {participants.map((p) => {
            const isMe = p.id === currentUserId;
            return (
              <div
                key={p.id}
                title={`${p.name}${isMe ? " (You)" : ""}`}
                className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-zinc-950 text-[10px] font-bold text-zinc-950 font-mono shadow"
                style={{ backgroundColor: p.color }}
              >
                {p.name.charAt(0).toUpperCase()}
                <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-1 ring-zinc-950" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
