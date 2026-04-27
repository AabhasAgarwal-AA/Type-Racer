"use client";
import { Player } from "@/types/types";

export default function LeaderboardCard({ player, rank }: {
    player: Player;
    rank: number;
}) {
    return (
        <div className={`flex items-center gap-4 px-4 py-3 rounded-[12px] border transition-colors 
            ${rank === 1 ? "bg-[rgba(180,79,255,0.08)] border-[rgba(180,79,255,0.2)]" :
                rank === 2 ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]" :
                    rank === 3 ? "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)]" :
                        "bg-transparent border-[rgba(255,255,255,0.04)]"}`}>

            <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center font-mono text-[12px] font-bold shrink-0 
                ${rank === 1 ? "bg-[rgba(180,79,255,0.2)] text-[#b44fff]" :
                    rank === 2 ? "bg-[rgba(255,255,255,0.06)] text-[#8a87a0]" :
                        rank === 3 ? "bg-[rgba(255,255,255,0.04)] text-[#6e6b84]" :
                            "bg-transparent text-[#3e3c54]"}`}>
                {rank}
            </div>

            <span className={`font-mono text-[13px] tracking-wide truncate flex-1 ${rank === 1 ? "text-[#f0edff] font-semibold" : "text-[#8a87a0]"}`}>
                {player.name}
            </span>

            <span className={`font-mono text-[13px] font-bold shrink-0 ${rank === 1 ? "text-[#b44fff]" : "text-[#5e5b75]"}`}>
                {player.score} <span className="text-[10px] font-normal tracking-widest uppercase opacity-60">wpm</span>
            </span>

        </div>
    )
}