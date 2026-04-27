"use client";
import { GameProps, GameStatus, Player } from "@/types/types";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { PlayerScore } from "@/types/types";
import { toast } from "sonner";
import LeaderboardCard from "./leaderboard-card";
import { Textarea } from "./ui/textarea";

export default function Game({gameId, name}: GameProps){
    const [ioInstance, setIoInstance] = useState<Socket>();
    const [players, setPlayers] = useState<Player[]>([]);
    const [gameStatus, setGameStatus] = useState<GameStatus>("not-started");
    const [paragraph, setParagraph] = useState<string>("");
    const [host, setHost] = useState<string>("");
    const [inputParagraph, setInputParagraph] = useState<string>("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);
        setIoInstance(socket);

        socket.emit("join-game", gameId, name);

        return () => {
            removeListeners();
            socket.disconnect();
        }
    }, []);

    useEffect(() =>{
        setupListeners();
        return () => removeListeners();
    }, [ioInstance]);

    useEffect(() => {
        if(!ioInstance || gameStatus !== "in-progress"){
            return; 
        }
        ioInstance.emit("player-typed", inputParagraph);
    }, [inputParagraph]);

    useEffect(() => {
        if (copied) {
            let timeout = setTimeout(() => {
                setCopied(false);
            }, 3000);

            return () => {
                clearTimeout(timeout);
            }
        }
    }, [copied]);

    function setupListeners(){
        if(!ioInstance){
            return;
        }

        ioInstance.on("connect", () => {
            console.log("Connected to server");
        });

        ioInstance.on("players", (players: Player[]) => {
            console.log("recieved players");
            setPlayers(players);
        });

        ioInstance.on("player-joined", (player: Player) => {
            setPlayers((prev) => [...prev, player]);
        });

        ioInstance.on("player-left", (id: string) => {
            setPlayers((prev) => prev.filter((player) => player.id !== id))
        });

        ioInstance.on("player-score", ({id, score}: PlayerScore) => {
            setPlayers((prev) => 
                prev.map((player) => {
                    if(player.id === id){
                        return {
                            ...player, 
                            score
                        };
                    }
                    return player;
                }),
            );
        });

        ioInstance.on("game-started", (paragraph: string) => {
            setParagraph(paragraph);
            setGameStatus("in-progress");
        });

        ioInstance.on("game-finished", () => {
            setInputParagraph("");
            setGameStatus("finished");
        });

        ioInstance.on("new-host", (id: string) => {
            setHost(id);
        });

        ioInstance.on("error", (message: string) => {
            toast.error(message);
        });
    }

    function removeListeners(){
        if(!ioInstance){
            return; 
        }

        ioInstance.off("connect");
        ioInstance.off("players");
        ioInstance.off("player-joined");
        ioInstance.off("player-left");
        ioInstance.off("player-score");
        ioInstance.off("game-started");
        ioInstance.off("game-finished");
        ioInstance.off("new-host");
        ioInstance.off("error");
    }

    function startGame(){
        if(!ioInstance){
            return; 
        }
        ioInstance.emit("start-game");
    }

    window.onbeforeunload = () => {
        if(ioInstance){
            ioInstance.emit("leave");
        }
    }
    return (
        <main className="relative min-h-screen overflow-x-hidden bg-[#0b0b12] text-[#e8e6f0] antialiased">

            <div className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(120,80,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,80,255,0.04) 1px, transparent 1px)`,
                    backgroundSize: "48px 48px",
                }} />
            <div className="fixed -top-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(108,59,255,0.2) 0%, transparent 65%)" }} />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">

                <div className="w-full order-last lg:order-first flex flex-col gap-4">

                    <button
                        onClick={() => { setCopied(true); navigator.clipboard.writeText(gameId) }}
                        className="w-full flex items-center justify-center gap-2 bg-[#12111a] hover:bg-[#1a1828] border border-[rgba(255,255,255,0.06)] rounded-[12px] py-3 font-mono text-[12px] tracking-widest uppercase text-[#a89cff] transition-colors"
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${copied ? "bg-emerald-400" : "bg-[#a89cff]"}`} />
                        {copied ? "Code copied!" : "Copy game code"}
                    </button>

                    <div className="flex items-center gap-2 mt-2 mb-1">
                        <span className="font-mono text-[11px] tracking-widest uppercase text-[#5e5b75]">Leaderboard</span>
                        <div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]" />
                    </div>

                    <div className="flex flex-col gap-2">
                        {players.sort((a, b) => b.score - a.score).map((player, index) => (
                            <LeaderboardCard key={player.id} player={player} rank={index + 1} />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2">

                    {gameStatus === "not-started" && (
                        <div className="bg-[#12111a] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-10 flex flex-col items-center justify-center min-h-[420px] gap-8 text-center">
                            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#a89cff] border border-[rgba(168,156,255,0.3)] rounded-full px-4 py-1.5 bg-[rgba(108,59,255,0.1)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#a89cff] animate-pulse" />
                                Waiting for players
                            </div>

                            <h1 className="text-[36px] font-bold leading-none">
                                <span className="block text-[#f0edff]">WAITING FOR</span>
                                <span className="block"
                                    style={{
                                        background: "linear-gradient(90deg, #b44fff, #e040fb)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}>
                                    PLAYERS
                                </span>
                            </h1>

                            <p className="text-[13px] text-[#6e6b84]">
                                Share your game code with friends to get them in the lobby.
                            </p>

                            {host === ioInstance?.id && (
                                <button
                                    onClick={startGame}
                                    className="px-12 py-3 rounded-[12px] font-semibold text-[15px] text-[#e8e6f0] bg-[#1e1c2e] hover:bg-[#262440] border border-[rgba(255,255,255,0.08)] transition-colors"
                                >
                                    Start Game
                                </button>
                            )}
                        </div>
                    )}

                    {gameStatus === "in-progress" && (
                        <div className="bg-[#12111a] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-6 flex flex-col min-h-[420px]">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-mono text-[11px] tracking-widest uppercase text-emerald-400">
                                    Race in progress
                                </span>
                            </div>

                            <h2 className="text-[15px] font-semibold text-[#f0edff] mb-4">
                                Type the paragraph below
                            </h2>

                            <div className="relative flex-1 min-h-[280px]">
                                <p className="text-xl lg:text-3xl leading-relaxed text-[#3e3c54] p-4 font-mono select-none">
                                    {paragraph}
                                </p>
                                <Textarea
                                    value={inputParagraph}
                                    onChange={(e) => setInputParagraph(e.target.value)}
                                    className="absolute inset-0 z-10 bg-transparent text-xl lg:text-3xl leading-relaxed font-mono text-[#e8e6f0] p-4 resize-none border-none outline-none focus:ring-0 focus-visible:ring-0 opacity-90 caret-violet-400"
                                    placeholder=""
                                    disabled={gameStatus !== "in-progress" || !ioInstance}
                                />
                            </div>
                        </div>
                    )}

                    {gameStatus === "finished" && (
                        <div className="bg-[#12111a] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-10 flex flex-col items-center justify-center min-h-[420px] gap-8 text-center">
                            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-emerald-400 border border-emerald-400/20 rounded-full px-4 py-1.5 bg-emerald-400/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Game over
                            </div>

                            <h1 className="text-[36px] font-bold leading-none">
                                <span className="block text-[#f0edff]">GAME</span>
                                <span className="block"
                                    style={{
                                        background: "linear-gradient(90deg, #b44fff, #e040fb)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}>
                                    FINISHED
                                </span>
                            </h1>

                            {ioInstance?.id === host && (
                                <p className="text-[13px] text-[#6e6b84]">
                                    You&apos;re the host — restart for another round.
                                </p>
                            )}

                            {host === ioInstance?.id && (
                                <button
                                    onClick={startGame}
                                    className="px-12 py-3 rounded-[12px] font-semibold text-[15px] text-[#e8e6f0] bg-[#1e1c2e] hover:bg-[#262440] border border-[rgba(255,255,255,0.08)] transition-colors"
                                >
                                    Restart Game
                                </button>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </main>
    )
}