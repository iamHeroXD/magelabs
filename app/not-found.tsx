import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 max-w-md space-y-4 shadow-2xl backdrop-blur-md">
        <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
          404 · LAB EXPERIMENT NOT FOUND
        </span>
        <h2 className="font-display text-2xl font-bold text-zinc-100">
          Uncharted Apparatus
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          The laboratory room or experiment you requested could not be located in our verified curriculum catalog.
        </p>
        <div className="pt-2">
          <Link href="/dashboard">
            <Button variant="amber" size="sm" className="gap-2 font-semibold">
              <Compass className="h-4 w-4" />
              Return to Laboratory Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
