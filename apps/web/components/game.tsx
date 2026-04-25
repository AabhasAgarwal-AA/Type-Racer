"use client";
import { GameProps, GameStatus, Player } from "@/types/types";
import { useState } from "react";
import { Socket } from "socket.io-client";

export default function Game({gameId, name}: GameProps){
    const [ioInstance, setIoInstance] = useState<Socket>();
    const [players, setPlayers] = useState<Player[]>([]);
    const [gameStatus, setGameStatus] = useState<GameStatus>("not-started");
    const [paragraph, setParagraph] = useState<string>("");
    const [host, setHost] = useState<string>("");
    const [inputParagraph, setInputParagraph] = useState<string>("");

    return (
        <div>
            
        </div>
    )
}