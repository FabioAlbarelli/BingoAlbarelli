import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { createRoom, joinRoom } from "@/lib/game";

interface RoomManagerProps {
    onJoin: (roomId: string, playerId: string) => void;
}

export function RoomManager({ onJoin }: RoomManagerProps) {
    const [mode, setMode] = useState<"menu" | "create" | "join">("menu");
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            const { roomId, playerId } = await createRoom(name);
            onJoin(roomId, playerId);
        } catch (e) {
            setError("Erro ao criar sala. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!name.trim() || !roomId.trim()) return;
        setLoading(true);
        try {
            const result = await joinRoom(roomId.toUpperCase(), name);
            if (result) {
                onJoin(roomId.toUpperCase(), result.playerId);
            } else {
                setError("Sala não encontrada.");
            }
        } catch (e) {
            setError("Erro ao entrar na sala.");
        } finally {
            setLoading(false);
        }
    };

    if (mode === "menu") {
        return (
            <div className="space-y-4 w-full max-w-sm mx-auto">
                <Button size="xl" className="w-full" onClick={() => setMode("create")}>
                    Criar Sala
                </Button>
                <Button size="xl" variant="outline" className="w-full" onClick={() => setMode("join")}>
                    Entrar em Sala
                </Button>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
                <CardTitle>{mode === "create" ? "Criar Nova Sala" : "Entrar na Sala"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Seu Nome</label>
                    <Input
                        placeholder="Digite seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {mode === "join" && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Código da Sala</label>
                        <Input
                            placeholder="Ex: ABC123"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="uppercase"
                        />
                    </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex flex-col gap-2 pt-4">
                    <Button
                        size="lg"
                        onClick={mode === "create" ? handleCreate : handleJoin}
                        disabled={loading || !name.trim() || (mode === "join" && !roomId.trim())}
                    >
                        {loading ? "Carregando..." : mode === "create" ? "Criar Sala" : "Entrar"}
                    </Button>
                    <Button variant="ghost" onClick={() => setMode("menu")}>
                        Voltar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
