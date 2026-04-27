"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation"
import { FormEvent } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  Zap,
  Swords
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  function joinGame(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form = event.currentTarget; 
    const formData = new FormData(form);

    const inviteCode = formData.get("inviteCode") as string; 
    if(!inviteCode){
      return toast.error("Invite code is required");
    }
    router.push(`/game/${inviteCode}`);
  }

  function createGame(){
    const inviteCode = uuidv4();
    router.push(`/game/${inviteCode}`);
  }

  return (
    <main className="relative h-screen overflow-hidden bg-[#0b0b12] text-neutral-100 antialiased ">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute -top-32 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/5 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-violet-300">
            Multiplayer Typing Race
          </span>
        </div>

        <h1 className="mt-8 text-6xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl">
          Type
          <br />
          <span className="bg-gradient-to-b from-violet-400 via-fuchsia-400 to-violet-700 bg-clip-text text-transparent">
            Battle
          </span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-400">
          Race your friends in real-time typing battles. See who's fastest under
          pressure — create a room and share your code, or jump into a friend's
          game.
        </p>

        <div className="mt-10 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 backdrop-blur-sm">
          <div className="font-mono text-sm leading-relaxed">
            <span className="text-violet-300">The quick brown fox jumps</span>
            <span className="cursor-blink inline-block h-4 w-[2px] -mb-0.5 bg-violet-400 align-middle ml-0.5" />
            <span className="text-neutral-600"> over the lazy dog and wins the race.</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6 border-y border-white/5 py-6">
          <Stat value="120+" label="WPM record" />
          <Stat value="8" label="Players / room" />
          <Stat value="60s" label="Round time" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition hover:border-violet-400/20">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 ring-1 ring-violet-400/20">
              <Zap className="h-4 w-4 text-violet-300" fill="currentColor" />
            </div>

            <h2 className="mt-5 text-lg font-semibold tracking-tight">
              Create Game
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              Start a new battle room and share your invite code with friends.
              You're the host — race begins when you say go.
            </p>

            <Button
              onClick={createGame}
              className="mt-6 h-10 w-full rounded-lg border border-white/10 bg-neutral-900 text-sm font-medium text-neutral-100 transition hover:bg-neutral-800"
            >
              Create Game
            </Button>
          </div>

          <div className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition hover:border-fuchsia-400/20">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fuchsia-500/15 ring-1 ring-fuchsia-400/20">
              <Swords className="h-4 w-4 text-fuchsia-300" />
            </div>

            <h2 className="mt-5 text-lg font-semibold tracking-tight">
              Join Game
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              Have a code? Drop it below and enter the arena. May the fastest
              fingers win.
            </p>

            <form onSubmit={joinGame} className="mt-6 space-y-2">
              <Input
                name="inviteCode"
                placeholder="ENTER CODE"
                className="h-10 rounded-lg border-white/10 bg-neutral-900/60 text-center font-mono text-sm tracking-[0.3em] placeholder:text-neutral-600 focus-visible:border-fuchsia-400/40 focus-visible:ring-0"
              />
              <Button
                type="submit"
                className="h-10 w-full rounded-lg border border-white/10 bg-neutral-900 text-sm font-medium text-neutral-100 transition hover:bg-neutral-800"
              >
                Join Game
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-neutral-500">
          <Kbd>⌘</Kbd>
          <span>+</span>
          <Kbd>Enter</Kbd>
          <span className="text-neutral-600">to create</span>
          <span className="text-neutral-700">·</span>
          <span className="text-neutral-600">paste code &</span>
          <Kbd>Enter</Kbd>
          <span className="text-neutral-600">to join</span>
        </div>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-neutral-300">
      {children}
    </kbd>
  );
}
