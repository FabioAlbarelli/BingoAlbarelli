import { BingoCard, BingoNumber } from "@/types";

export function generateBingoCard(): BingoCard {
    const columns = {
        B: generateColumnNumbers(1, 15, 5),
        I: generateColumnNumbers(16, 30, 5),
        N: generateColumnNumbers(31, 45, 4), // 4 numbers + FREE space
        G: generateColumnNumbers(46, 60, 5),
        O: generateColumnNumbers(61, 75, 5),
    };

    const grid: BingoNumber[][] = Array(5)
        .fill(null)
        .map(() => Array(5).fill(0));

    // Fill columns
    for (let row = 0; row < 5; row++) {
        grid[row][0] = columns.B[row];
        grid[row][1] = columns.I[row];
        if (row === 2) {
            grid[row][2] = "FREE";
        } else {
            // Adjust index for N column because of FREE space
            const nIndex = row > 2 ? row - 1 : row;
            grid[row][2] = columns.N[nIndex];
        }
        grid[row][3] = columns.G[row];
        grid[row][4] = columns.O[row];
    }

    return {
        id: Math.random().toString(36).substring(2, 9),
        numbers: grid,
    };
}

function generateColumnNumbers(min: number, max: number, count: number): number[] {
    const numbers = new Set<number>();
    while (numbers.size < count) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.add(num);
    }
    return Array.from(numbers);
}

export function checkWin(card: BingoCard, drawnNumbers: number[]): boolean {
    const drawnSet = new Set(drawnNumbers);
    const isMarked = (cell: BingoNumber) => cell === "FREE" || drawnSet.has(cell as number);

    // Check rows
    for (let row = 0; row < 5; row++) {
        if (card.numbers[row].every(isMarked)) return true;
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
        if (card.numbers.every((row) => isMarked(row[col]))) return true;
    }

    // Check diagonals
    if ([0, 1, 2, 3, 4].every((i) => isMarked(card.numbers[i][i]))) return true;
    if ([0, 1, 2, 3, 4].every((i) => isMarked(card.numbers[i][4 - i]))) return true;

    return false;
}
