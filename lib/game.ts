import { db } from "./firebase";
import { ref, set, get, update, push, child, onValue, off } from "firebase/database";
import { Room, Player, BingoCard } from "@/types";
import { generateBingoCard } from "./bingo";

export async function createRoom(hostName: string): Promise<{ roomId: string; playerId: string }> {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const playerId = Math.random().toString(36).substring(2, 9);

    const hostPlayer: Player = {
        id: playerId,
        name: hostName,
        card: generateBingoCard(),
        isHost: true,
    };

    const room: Room = {
        id: roomId,
        hostId: playerId,
        players: {
            [playerId]: hostPlayer,
        },
        drawnNumbers: [],
        status: "waiting",
        createdAt: Date.now(),
    };

    await set(ref(db, `rooms/${roomId}`), room);
    return { roomId, playerId };
}

export async function joinRoom(roomId: string, playerName: string): Promise<{ playerId: string } | null> {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
        return null;
    }

    const playerId = Math.random().toString(36).substring(2, 9);
    const player: Player = {
        id: playerId,
        name: playerName,
        card: generateBingoCard(),
        isHost: false,
    };

    await set(ref(db, `rooms/${roomId}/players/${playerId}`), player);
    return { playerId };
}

export async function drawNumber(roomId: string): Promise<number | null> {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) return null;

    const room = snapshot.val() as Room;
    const drawnSet = new Set(room.drawnNumbers || []);

    if (drawnSet.size >= 75) return null;

    let nextNum;
    do {
        nextNum = Math.floor(Math.random() * 75) + 1;
    } while (drawnSet.has(nextNum));

    const newDrawnNumbers = [...(room.drawnNumbers || []), nextNum];

    await update(roomRef, {
        drawnNumbers: newDrawnNumbers,
        status: "playing"
    });

    return nextNum;
}

export function subscribeToRoom(roomId: string, callback: (room: Room) => void) {
    const roomRef = ref(db, `rooms/${roomId}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        }
    });
    return () => off(roomRef, "value", unsubscribe); // Return cleanup function
}

export async function resetGame(roomId: string): Promise<void> {
    const roomRef = ref(db, `rooms/${roomId}`);
    await update(roomRef, {
        drawnNumbers: [],
        status: "waiting"
    });
}
