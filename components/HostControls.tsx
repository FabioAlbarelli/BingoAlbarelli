import { useState } from "react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { drawNumber, resetGame } from "@/lib/game";
import { Room } from "@/types";

interface HostControlsProps {
    room: Room;
}

export function HostControls({ room }: HostControlsProps) {
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastDrawn, setLastDrawn] = useState<number | null>(
        room.drawnNumbers.length > 0 ? room.drawnNumbers[room.drawnNumbers.length - 1] : null
    );

    const handleDraw = async () => {
        setIsDrawing(true);
        try {
            const num = await drawNumber(room.id);
            if (num) setLastDrawn(num);
        } catch (error) {
            console.error("Failed to draw number", error);
        } finally {
            setIsDrawing(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
                <CardHeader>
                    <CardTitle className="text-center text-blue-900">Painel do Sorteio</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6">
                    <div className="relative flex items-center justify-center w-40 h-40 rounded-full bg-white border-8 border-blue-500 shadow-2xl">
                        <span className="text-6xl font-black text-blue-600">
                            {lastDrawn || "--"}
                        </span>
                    </div>

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
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Jogadores ({Object.keys(room.players).length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {Object.values(room.players).map((player) => (
                            <li key={player.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                <span className="font-medium">{player.name}</span>
                                {player.isHost && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Host</span>}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
