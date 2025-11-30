import { BingoCard as BingoCardType, BingoNumber } from "@/types";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface BingoCardProps {
    card: BingoCardType;
    onMark?: (number: BingoNumber) => void;
    markedNumbers?: Set<number>;
    interactive?: boolean;
}

export function BingoCard({ card, onMark, markedNumbers = new Set(), interactive = false }: BingoCardProps) {
    const [localMarks, setLocalMarks] = useState<Set<number>>(new Set());

    useEffect(() => {
        // Sync local marks with prop if provided (for validation/spectating)
        // For now, we just use local state for the player's view
    }, [markedNumbers]);

    const handleCellClick = (cell: BingoNumber) => {
        if (!interactive || cell === "FREE") return;

        const newMarks = new Set(localMarks);
        if (newMarks.has(cell as number)) {
            newMarks.delete(cell as number);
        } else {
            newMarks.add(cell as number);
        }
        setLocalMarks(newMarks);
        onMark?.(cell);
    };

    const isMarked = (cell: BingoNumber) => {
        if (cell === "FREE") return true;
        return localMarks.has(cell as number) || markedNumbers.has(cell as number);
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 bg-white rounded-2xl shadow-xl border-4 border-blue-500">
            <div className="grid grid-cols-5 gap-2 mb-2">
                {["B", "I", "N", "G", "O"].map((letter) => (
                    <div key={letter} className="text-center font-black text-3xl text-blue-600">
                        {letter}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-5 gap-2 aspect-square">
                {card.numbers.flat().map((cell, idx) => {
                    const marked = isMarked(cell);
                    return (
                        <button
                            key={`${idx}-${cell}`}
                            onClick={() => handleCellClick(cell)}
                            disabled={!interactive && cell !== "FREE"}
                            className={cn(
                                "relative flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-200",
                                "border-2",
                                cell === "FREE"
                                    ? "bg-purple-100 border-purple-400 text-purple-700"
                                    : marked
                                        ? "bg-blue-500 border-blue-600 text-white scale-95"
                                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100",
                                "aspect-square"
                            )}
                            aria-label={cell === "FREE" ? "Free Space" : `Number ${cell}, ${marked ? "marked" : "unmarked"}`}
                            aria-pressed={marked}
                        >
                            {cell === "FREE" ? (
                                <span className="text-xs sm:text-sm">★</span>
                            ) : (
                                cell
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
