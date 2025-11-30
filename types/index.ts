export type BingoNumber = number | "FREE";

export interface BingoCard {
    id: string;
    numbers: BingoNumber[][]; // 5x5 grid
}

export interface Player {
    id: string;
    name: string;
    card: BingoCard;
    isHost: boolean;
}

export interface Room {
    id: string;
    hostId: string;
    players: Record<string, Player>;
    drawnNumbers: number[];
    status: "waiting" | "playing" | "finished";
    createdAt: number;
}
