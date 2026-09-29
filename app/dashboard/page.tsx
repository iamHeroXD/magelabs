"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Layers,
  Users,
  Search,
  Filter,
  Zap,
  Plus,
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Atom,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NaturalLanguageSearch } from "@/components/dashboard/NaturalLanguageSearch";
import { ExperimentCard } from "@/components/dashboard/ExperimentCard";
import { LabHistory } from "@/components/dashboard/LabHistory";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EXPERIMENT_CATALOG } from "@/lib/experiments/registry";
import { Subject } from "@/lib/experiments/types";

export default function DashboardPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Room creation / join modal
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomAction, setRoomAction] = useState<"create" | "join">("create");
  const [targetExpId, setTargetExpId] = useState<string>("ohms-law");
  const [joinRoomCode, setJoinRoomCode] = useState<string>("");

  // Filtered experiments
  const filteredExperiments = EXPERIMENT_CATALOG.filter((exp) => {
    const matchesSubject = selectedSubject === "all" || exp.subject === selectedSubject;
    const matchesSearch =
      exp.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleCreateRoom = (expId?: string) => {
    const newRoomCode = `LAB-${Math.floor(100 + Math.random() * 900)}`;
    router.push(`/rooms/${newRoomCode}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinRoomCode.trim()) return;
    const cleanCode = joinRoomCode.trim().toUpperCase();
    router.push(`/rooms/${cleanCode}`);
  };

  return (
    <div className="min-h-screen bg-lab-grid pb-20">
      {/* Top Banner / Welcome */}
      <section className="border-b border-zinc-800/80 bg-zinc-950/60 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-500">
                <Atom className="h-4 w-4" />
                <span>MAGELABS SCIENTIFIC WORKSPACE</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Student Laboratory Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Conduct authenticated physical experiments in interactive 3D, record high-precision empirical measurements, and collaborate in real-time with lab partners.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setRoomAction("join");
                  setIsRoomModalOpen(true);
                }}
                className="gap-2 text-xs font-mono"
              >
                <Users className="h-4 w-4 text-cyan-400" />
                Join Room
              </Button>

              <Button
                variant="amber"
                size="md"
                onClick={() => handleCreateRoom("ohms-law")}
                className="gap-2 text-xs font-semibold shadow-lg shadow-amber-500/10"
              >
                <Plus className="h-4 w-4" />
                Create Lab Room
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* 1. Natural Language Experiment Discovery */}
        <section>
          <NaturalLanguageSearch />
        </section>

        {/* 2. Recent Progress */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LabHistory />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-zinc-400 font-semibold">
                  Lab Bench Engine
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Ready
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-zinc-100 mb-1">
                Deterministic Physics Solver
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Circuit currents, potential drops, and branch powers are strictly derived from Ohm's Law and Kirchhoff's loop laws in real-time.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Status: Online</span>
              <span className="text-amber-400">WebGL 2.0 / PBR</span>
            </div>
          </div>
        </section>

        {/* 3. Experiment Catalog Section */}
        <section id="catalog" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-zinc-100">
                Verified Experiment Catalog
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Explore structured curricula across Physics, Chemistry, and Cellular Biology.
              </p>
            </div>

            {/* Subject Filters & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-1 text-xs font-mono">
                {["all", "physics", "chemistry", "biology"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`capitalize px-3 py-1 rounded transition-colors ${
                      selectedSubject === sub
                        ? "bg-amber-500 text-zinc-950 font-bold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter laboratories..."
                  className="h-9 w-44 sm:w-56 rounded-lg border border-zinc-800 bg-zinc-900 pl-8 pr-3 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/80"
                />
              </div>
            </div>
          </div>

          {/* Experiment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((exp) => (
              <ExperimentCard
                key={exp.id}
                experiment={exp}
                onCreateRoom={(id) => {
                  setTargetExpId(id);
                  handleCreateRoom(id);
                }}
              />
            ))}
          </div>

          {filteredExperiments.length === 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-12 text-center text-xs font-mono text-zinc-500">
              No laboratories match your query. Clear filters to explore all subjects.
            </div>
          )}
        </section>

        {/* 4. Collaborative Rooms Showcase */}
        <section
          id="rooms"
          className="rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-8 backdrop-blur-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Real-Time Collaborative Sessions
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-zinc-100">
                Multiplayer Science Laboratories
              </h3>
              <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                Invite lab partners into the same virtual laboratory room. All wire connections, switch states, voltage dials, and measurements synchronize smoothly in real-time.
              </p>
            </div>

            <Button
              variant="amber"
              onClick={() => handleCreateRoom("ohms-law")}
              className="gap-2 font-semibold text-xs shrink-0"
            >
              <Plus className="h-4 w-4" />
              Launch Dedicated Room
            </Button>
          </div>

          {/* Quick Room Demo Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono space-y-2">
              <span className="text-amber-400 font-bold">ROOM: LAB-401</span>
              <p className="text-zinc-400 text-[11px]">Ohm's Law Verification Study Group</p>
              <Link href="/rooms/LAB-401" className="inline-block mt-2">
                <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 text-zinc-300">
                  Enter Room <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono space-y-2">
              <span className="text-cyan-400 font-bold">ROOM: LAB-512</span>
              <p className="text-zinc-400 text-[11px]">AP Physics Circuit Resistance Lab</p>
              <Link href="/rooms/LAB-512" className="inline-block mt-2">
                <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 text-zinc-300">
                  Enter Room <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono space-y-2">
              <span className="text-emerald-400 font-bold">ROOM: LAB-609</span>
              <p className="text-zinc-400 text-[11px]">Series vs Parallel Exploration</p>
              <Link href="/rooms/LAB-609" className="inline-block mt-2">
                <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 text-zinc-300">
                  Enter Room <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Join Room Modal */}
      <Dialog open={isRoomModalOpen} onOpenChange={setIsRoomModalOpen}>
        <DialogHeader>
          <DialogTitle>Join Collaborative Laboratory</DialogTitle>
          <DialogDescription>
            Enter the 6-character room code provided by your instructor or lab partner.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleJoinRoom} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
              Room Code (e.g. LAB-401)
            </label>
            <input
              type="text"
              required
              value={joinRoomCode}
              onChange={(e) => setJoinRoomCode(e.target.value)}
              placeholder="LAB-XXX"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 uppercase focus:outline-none focus:border-amber-500/80"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRoomModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="amber" size="sm" className="font-semibold">
              Enter Lab Room
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
