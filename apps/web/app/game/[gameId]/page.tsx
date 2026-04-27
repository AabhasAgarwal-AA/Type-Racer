import Game from "@/components/game";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { redirect } from "next/navigation";

export default async function GameJoin({searchParams, params}:{
    searchParams: Promise<{ name?: string | string[] }>;
    params: Promise<{ gameId: string }>
}){
    const { gameId } = await params;
    const resolvedSearchParams = await searchParams;
    const name = Array.isArray(resolvedSearchParams.name) ? resolvedSearchParams.name[0] : resolvedSearchParams.name;

    async function appendName(formData: FormData){
        "use server";
        const name = formData.get("name") as string; 
        if(!name){
            return
        }
        redirect(`/game/${gameId}?name=${name}`);
    }

    if(!name){
        return <main className="relative h-screen overflow-hidden bg-[#0b0b12] text-[#e8e6f0] antialiased flex items-center justify-center">

            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(120,80,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,80,255,0.04) 1px, transparent 1px)`,
                    backgroundSize: "48px 48px",
                }} />

            <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(108,59,255,0.2) 0%, transparent 65%)" }} />

            <div className="relative z-10 w-full max-w-md mx-6 bg-[#12111a] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-8 flex flex-col gap-5">

                <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#a89cff] border border-[rgba(168,156,255,0.3)] rounded-full px-4 py-1.5 bg-[rgba(108,59,255,0.1)] w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a89cff] animate-pulse" />
                    Step 1 of 1
                </div>

                <h1 className="text-[42px] font-bold leading-none tracking-tight">
                    <span className="block text-[#f0edff]">ENTER YOUR</span>
                    <span className="block"
                        style={{
                            background: "linear-gradient(90deg, #b44fff, #e040fb)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>
                        CALLSIGN
                    </span>
                </h1>

                <p className="text-[13px] text-[#6e6b84] leading-relaxed">
                    Pick a nickname — this is how you&apos;ll appear on the leaderboard and in the battle lobby.
                </p>

                <form action={appendName} className="flex flex-col gap-3 mt-2">
                    <Input
                        type="text"
                        name="name"
                        placeholder="your nickname"
                        maxLength={20}
                        className="bg-[#1e1c2e] border-[rgba(255,255,255,0.08)] text-[#e8e6f0] font-mono tracking-wide placeholder:text-[#3e3c54] rounded-[10px] py-6 px-4"
                    />
                    <Button
                        type="submit"
                        className="w-full bg-[#1e1c2e] hover:bg-[#262440] text-[#e8e6f0] border border-[rgba(255,255,255,0.08)] rounded-[10px] font-semibold py-6"
                    >
                        Join Game
                    </Button>
                </form>

                <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-[#3e3c54]">
                    press <kbd className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded px-1.5 py-0.5 text-[10px] text-[#5e5b75]">Enter</kbd> to join
                </div>

            </div>
        </main>
        
    }

    return <Game gameId={gameId} name={name} />
}