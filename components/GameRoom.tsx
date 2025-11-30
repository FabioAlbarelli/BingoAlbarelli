import { useEffect, useState } from "react";
import { Room, Player } from "@/types";
import { subscribeToRoom } from "@/lib/game";
import { HostControls } from "./HostControls";
import { BingoCard } from "./BingoCard";
import { Button } from "./ui/Button";
import { checkWin } from "@/lib/bingo";
import confetti from "canvas-confetti";

interface GameRoomProps {
    roomId: string;
    playerId: string;
    onLeave: () => void;
}

export function GameRoom({ roomId, playerId, onLeave }: GameRoomProps) {
    const [room, setRoom] = useState<Room | null>(null);
    const [hasBingo, setHasBingo] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToRoom(roomId, (data) => {
            setRoom(data);
        });
        return () => unsubscribe();
    }, [roomId]);

    useEffect(() => {
        if (room && room.players[playerId]) {
            const player = room.players[playerId];
            const win = checkWin(player.card, room.drawnNumbers);
            if (win && !hasBingo) {
                setHasBingo(true);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
            }
        }
    }, [room, playerId, hasBingo]);

    if (!room) return <div className="p-8 text-center">Carregando sala...</div>;

    const player = room.players[playerId];
    if (!player) return <div className="p-8 text-center">Jogador não encontrado.</div>;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 pb-24">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Sala: {roomId}</h1>
                    <p className="text-sm text-slate-500">Jogador: {player.name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onLeave} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    Sair
                </Button>
            </div>

            {hasBingo && (
                <div className="bg-yellow-400 text-yellow-900 p-4 rounded-xl text-center font-black text-2xl animate-bounce shadow-lg">
                    🎉 BINGO! 🎉
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-4 text-slate-800">Sua Cartela</h2>
                        <BingoCard
                            card={player.card}
                            interactive={true}
                            markedNumbers={new Set(room.drawnNumbers)}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    {player.isHost ? (
                        <HostControls room={room} />
                    ) : (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold mb-4 text-slate-700">Últimos Números</h3>
                            <div className="flex flex-wrap gap-2">
                                {room.drawnNumbers.slice().reverse().map((num, i) => (
                                    <span
                                        key={i}
                                        className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm",
                                            i === 0 ? "bg-blue-600 text-white scale-110 shadow-lg" : "bg-slate-100 text-slate-600"
                                        )}
                                    >
                                        {num}
                                    </span>
                                ))}
                                {room.drawnNumbers.length === 0 && (
                                    <p className="text-slate-400 italic">O jogo ainda não começou.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
