"use client";

import { useState } from "react";
import { RoomManager } from "@/components/RoomManager";
import { GameRoom } from "@/components/GameRoom";

export default function Home() {
    const [gameState, setGameState] = useState<{ roomId: string; playerId: string } | null>(null);

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-8">
                {!gameState ? (
                    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl md:text-6xl font-black text-blue-600 tracking-tight">
                                BINGO<span className="text-slate-800">DIGITAL</span>
                            </h1>
                            <p className="text-slate-500 text-lg">Diversão para toda a família</p>
                        </div>
                        <RoomManager
                            onJoin={(roomId, playerId) => setGameState({ roomId, playerId })}
                        />
                    </div>
                ) : (
                    <GameRoom
                        roomId={gameState.roomId}
                        playerId={gameState.playerId}
                        onLeave={() => setGameState(null)}
                    />
                )}
            </div>
        </main>
    );
}
