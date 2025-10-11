import React, {useEffect, useMemo, useRef, useState, useCallback} from "react";
import {supabase} from "../lib/supabase";
import {useParams} from "react-router-dom";
import RoomCreationPage from "@/pages/RoomCreationPage.tsx";

// Types
type Pt = { x: number; y: number };
type Phase =
    | "P1_PLACE"
    | "P1_READY"
    | "P1_SCRATCH"
    | "P2_PLACE"
    | "P2_READY"
    | "P2_SCRATCH"
    | "WIN_P1"
    | "WIN_P2";

type Event =
    | { type: "place"; player: 1 | 2; shot: Pt }
    | { type: "scratch"; player: 1 | 2; shot: Pt }
    | { type: "reset" };

type BoardConfig = {
    width: number;
    height: number;
    foldX: number;
    radius: number;
};

//setting up the board config for mobile
function getBoardConfig(): BoardConfig {
    const isMobile = window.innerWidth < 600; // breakpoint
    const width = isMobile ? 320 : 900;
    const height = isMobile ? 260 : 520;
    const foldX = width / 2;
    const radius = isMobile ? 5 : 8;

    return { width, height, foldX, radius };
}


export default function PaperFoldWarOnline() {
    const {roomId: roomFromUrl} = useParams();
    const [roomId, setRoomId] = useState<string | null>(roomFromUrl ?? null);
    const [board, setBoard] = useState<BoardConfig>(getBoardConfig());

    useEffect(() => {
        function handleResize() {
            setBoard(getBoardConfig());
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { width, height, foldX, radius } = board

    // Keep state in sync if user navigates between rooms
    useEffect(() => {
        if (roomFromUrl && roomFromUrl !== roomId) setRoomId(roomFromUrl);
    }, [roomFromUrl]);

    // Board config
    //const width = 900;
    //const height = 520;
    //const foldX = width / 2;
    //const radius = 8;

    const playerId = useMemo(() => crypto.randomUUID(), []);

    // Multiplayer: presence decides roles
    const [role, setRole] = useState<1 | 2 | null>(null); // you are P1 or P2; null = spectator
    const [peers, setPeers] = useState<string[]>([]);

    // Game state
    const [p1Circles, setP1Circles] = useState<Pt[]>([]);
    const [p2Circles, setP2Circles] = useState<Pt[]>([]);
    const [phase, setPhase] = useState<Phase>("P1_PLACE");
    const [hover, setHover] = useState<Pt | null>(null);
    const [lastShot, setLastShot] = useState<Pt | null>(null);
    const [mirror, setMirror] = useState<Pt | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

    // Helpers
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const dist2 = (a: Pt, b: Pt) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    const inHalf = (pt: Pt, player: 1 | 2) =>
        player === 1
            ? pt.x >= 0 && pt.x <= foldX && pt.y >= 0 && pt.y <= height
            : pt.x >= foldX && pt.x <= width && pt.y >= 0 && pt.y <= height;
    const mirrorAcrossFold = (pt: Pt): Pt => ({x: width - pt.x, y: pt.y});

    // State Reset
    const handleReset = useCallback((broadcastAlso = true) => {
        setP1Circles([]);
        setP2Circles([]);
        setPhase("P1_PLACE");
        setLastShot(null);
        setMirror(null);
        if (broadcastAlso) channelRef.current?.send({type: "broadcast", event: "game", payload: {type: "reset"}});
    }, []);

    // --- Supabase channel setup (Includes fix for role race condition) ---
    useEffect(() => {
        if (!roomId) return;

        const channel = supabase.channel(`pfw-${roomId}`, {
            config: {presence: {key: playerId}},
        });
        channelRef.current = channel;

        channel
            .on("presence", {event: "sync"}, () => {
                const state = channel.presenceState(); // { id: [{ joined_at }, ...], ... }

                // Flatten + sort by arrival time (and id as tiebreaker)
                const entries = Object.entries(state).map(([id, metas]: any) => ({
                    id,
                    joined_at: metas?.[0]?.joined_at ?? 0,
                }));
                entries.sort((a, b) =>
                    a.joined_at === b.joined_at ? a.id.localeCompare(b.id) : a.joined_at - b.joined_at
                );

                setPeers(entries.map((e) => e.id));

                // Find my index in the sorted list
                const me = entries.findIndex((e) => e.id === playerId);

                // Role assignment: Recompute on every sync
                if (me === 0) {
                    setRole(1);
                } else if (me === 1) {
                    setRole(2);
                } else {
                    setRole(null); // Spectator or waiting
                }
            })
            .on("broadcast", {event: "game"}, ({payload}: any) => {
                applyRemote(payload as Event);
            })
            .subscribe(async (status: string) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({joined_at: Date.now()});
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, playerId]);

    // --- Core Game Logic Functions ---

    // Function to handle the scratch/fold action, determining hit or miss.
    const resolveScratch = useCallback((player: 1 | 2, shot: Pt, currentP1Circles: Pt[], currentP2Circles: Pt[]) => {
        const m = mirrorAcrossFold(shot);

        //passed-in state arrays for accurate, immediate resolution
        const enemy = player === 1 ? currentP2Circles : currentP1Circles;
        const hit = enemy.some((c) => dist2(c, m) <= (2 * radius) ** 2);

        // Set visual state for the reveal
        setLastShot(shot);
        setMirror(m);
        setPhase(player === 1 ? "P1_SCRATCH" : "P2_SCRATCH");

        // Short reveal, then resolve
        setTimeout(() => {
            if (hit) setPhase(player === 1 ? "WIN_P1" : "WIN_P2");
            else setPhase(player === 1 ? "P2_PLACE" : "P1_PLACE");
            setLastShot(null);
            setMirror(null);
        }, 180);
    }, [radius]);


    // Function to handle all incoming remote events
    const applyRemote = useCallback((ev: Event) => {
        if (ev.type === "reset") {
            // No broadcastAlso=false needed here as the broadcast is the source
            setP1Circles([]);
            setP2Circles([]);
            setPhase("P1_PLACE");
            setLastShot(null);
            setMirror(null);
            return;
        }

        if (ev.type === "place") {
            setLastShot(ev.shot);
            setMirror(mirrorAcrossFold(ev.shot));
            if (ev.player === 1) {
                // IMPORTANT: Use functional updates to ensure the latest state is use
                setP1Circles((prev) => [...prev, ev.shot]);
                setPhase("P1_READY");
            } else {
                setP2Circles((prev) => [...prev, ev.shot]);
                setPhase("P2_READY");
            }
        }

        if (ev.type === "scratch") {
            // Use the functional update syntax to get the latest circle state for scratch resolution
            // This ensures accuracy even if a 'place' or 'reset' was slightly delayed
            setP1Circles(prevP1 => {
                setP2Circles(prevP2 => {
                    resolveScratch(ev.player, ev.shot, prevP1, prevP2);
                    return prevP2; // return original P2 array
                });
                return prevP1; // return original P1 array
            });
        }
    }, [resolveScratch]); // Depend on resolveScratch

    // --- Local UI Handlers ---

    const handlePlace = (e: React.MouseEvent) => {
        if (!(phase === "P1_PLACE" || phase === "P2_PLACE")) return;
        if (!role) return; // spectators can't act
        const myTurn =
            (role === 1 && phase === "P1_PLACE") || (role === 2 && phase === "P2_PLACE");
        if (!myTurn) return;

        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const x = clamp(e.clientX - rect.left, 0, width);
        const y = clamp(e.clientY - rect.top, 0, height);
        const shot = {x, y};
        if (!inHalf(shot, role)) return;

        // Local State Update
        setLastShot(shot);
        setMirror(mirrorAcrossFold(shot));
        if (role === 1) {
            setP1Circles((prev) => [...prev, shot]);
            setPhase("P1_READY");
        } else {
            setP2Circles((prev) => [...prev, shot]);
            setPhase("P2_READY");
        }

        // Broadcast
        channelRef.current?.send({type: "broadcast", event: "game", payload: {type: "place", player: role, shot}});
    };

    const handleScratch = () => {
        if (!(phase === "P1_READY" || phase === "P2_READY")) return;
        if (!role) return;
        const myTurn =
            (role === 1 && phase === "P1_READY") || (role === 2 && phase === "P2_READY");
        if (!myTurn) return;
        if (!lastShot) return; // safety—should exist after place

        // Local State Update
        // Use the current state arrays directly since it is in the local action scope
        resolveScratch(role, lastShot, p1Circles, p2Circles);

        // Broadcast (must include the shot for the remote client to resolve)
        channelRef.current?.send({
            type: "broadcast",
            event: "game",
            payload: {type: "scratch", player: role, shot: lastShot}
        });
    };

    // Drawing
    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        const isGameOver = phase === "WIN_P1" || phase === "WIN_P2";
        //const isPlayer1Turn = phase.startsWith("P1_");
        //const isPlayer2Turn = phase.startsWith("P2_");

        ctx.clearRect(0, 0, width, height);

        // Background & halves
        ctx.fillStyle = "#0b1020";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#0f142a"; // left (P1)
        ctx.fillRect(0, 0, foldX, height);
        ctx.fillStyle = "#0d1325"; // right (P2)
        ctx.fillRect(foldX, 0, foldX, height);

        // Fold line
        ctx.strokeStyle = "#31408a";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 10]);
        ctx.beginPath();
        ctx.moveTo(foldX, 0);
        ctx.lineTo(foldX, height);
        ctx.stroke();
        ctx.setLineDash([]);

        //shows grid to spectator and when the game is over
        if (isGameOver || role === null) {
            // Grid
            ctx.strokeStyle = "#1a2145";
            ctx.lineWidth = 1;
            for (let x = 0; x <= width; x += 30) {
                ctx.beginPath();
                ctx.moveTo(x + 0.5, 0);
                ctx.lineTo(x + 0.5, height);
                ctx.stroke();
            }
            for (let y = 0; y <= height; y += 30) {
                ctx.beginPath();
                ctx.moveTo(0, y + 0.5);
                ctx.lineTo(width, y + 0.5);
                ctx.stroke();
            }
        }


        const drawCircles = (circles: Pt[], color: string) => {
            for (const c of circles) {
                ctx.beginPath();
                ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#e6e8ff11";
                ctx.stroke();
            }
        };

        // Reveal only own circles (spectators see none)
        //if (role === 1) drawCircles(p1Circles, "#5ee1ff");
        //(if (role === 2) drawCircles(p2Circles, "#ffa9f1");
        /*
        if (role === 1 || isGameOver || isPlayer2Turn || role === null) {
            drawCircles(p1Circles, "#5ee1ff");
        }

        if (role === 2 || isGameOver || isPlayer1Turn || role === null) {
            drawCircles(p2Circles, "#ffa9f1");
        }*/
        const isGlobalRevealPhase =
            phase === "P1_SCRATCH" ||
            phase === "P2_SCRATCH" ||
            phase === "WIN_P1" ||
            phase === "WIN_P2";


        // --- FINALIZED CIRCLE DRAWING LOGIC ---

        // Player 1 Circles
        // Show if: P1, OR it's the global reveal, OR spectator.
        if (role === 1 || isGlobalRevealPhase || role === null) {
            drawCircles(p1Circles, "#5ee1ff");
        }

        // Player 2 Circles
        // Show if: P2, OR it's the global reveal, OR spectator.
        if (role === 2 || isGlobalRevealPhase || role === null) {
            drawCircles(p2Circles, "#ffa9f1");
        }


        // Hover preview for placement turn
        const yourPlacementTurn =
            (phase === "P1_PLACE" && role === 1) || (phase === "P2_PLACE" && role === 2);
        if (yourPlacementTurn && hover && inHalf(hover, role!)) {
            ctx.beginPath();
            ctx.arc(hover.x, hover.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = role === 1 ? "#5ee1ff66" : "#ffa9f166";
            ctx.fill();
        }

        // Scratch visualization — ONLY for the acting player
        const iAmActiveViewer =
            // Player 1's turn: P1 sees the line when ready to scratch or during the scratch animation
            (role === 1 && (phase === "P1_READY" || phase === "P1_SCRATCH")) ||

            // Player 2's turn: P2 sees the line when ready to scratch or during the scratch animation
            (role === 2 && (phase === "P2_READY" || phase === "P2_SCRATCH")) ||

            // Spectators: Spectators see the line ONLY during the scratch animation
            (role === null && (phase === "P1_SCRATCH" || phase === "P2_SCRATCH"));

        // Only draw the scratch visualization if it's the active player's turn to scratch/reveal
        if (iAmActiveViewer && lastShot && mirror) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#c3d0ff88";
            ctx.arc(lastShot.x, lastShot.y, radius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.setLineDash([4, 6]);
            ctx.strokeStyle = "#ffd7f788";
            ctx.arc(mirror.x, mirror.y, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.moveTo(lastShot.x, lastShot.y);
            ctx.lineTo(mirror.x, mirror.y);
            ctx.strokeStyle = "#ffffff22";
            ctx.stroke();
        }
    }, [phase, p1Circles, p2Circles, hover, lastShot, mirror, role, radius, width, height, foldX]);

    const onMove = (e: React.MouseEvent) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        setHover({x: e.clientX - rect.left, y: e.clientY - rect.top});
    };

    // UI labels
    const labelPhase = () => {
        switch (phase) {
            case "P1_PLACE":
                return "P1 turn: place a circle (left)";
            case "P1_READY":
                return "P1: press SCRATCH to fold";
            case "P2_PLACE":
                return "P2 turn: place a circle (right)";
            case "P2_READY":
                return "P2: press SCRATCH to fold";
            case "P1_SCRATCH":
            case "P2_SCRATCH":
                return "Folding…";
            case "WIN_P1":
                return "Player 1 WINS!";
            case "WIN_P2":
                return "Player 2 WINS!";
        }
    };

    const createRoom = () => {
        const id = crypto.randomUUID().slice(0, 8);
        setRoomId(id);
        const url = new URL(window.location.href);
        url.pathname = "/games/paper-fold-war/online/" + id;
        window.history.replaceState({}, "", url.toString());
    };

    // --- UI Rendering ---

    if (!roomId) {
        return (
            <RoomCreationPage createRoom={createRoom} />
        );
    }

    const you = role ? (role === 1 ? "P1" : "P2") : "Spectator";
    const yourTurn =
        (role === 1 && (phase === "P1_PLACE" || phase === "P1_READY")) ||
        (role === 2 && (phase === "P2_PLACE" || phase === "P2_READY"));
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    async function shareRoom() {
        if (!roomId) return;
        const url = shareUrl;
        if (navigator.share) {
            try {
                await navigator.share({title: "Paper Fold War", text: "Join my room:", url});
                return;
            } catch {
                // canceled or not supported
            }
        }
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
    }

    const waitingForP2 = peers.length < 2;


    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start gap-4 p-6 bg-[#0a0e1c] text-white">
            <h1 className="text-2xl font-semibold tracking-tight">Paper Fold War — Online</h1>
            <p className="opacity-80 -mt-2">{labelPhase()}</p>

            <div className="flex items-center gap-3 text-sm opacity-80 flex-wrap justify-center">
                <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#5ee1ff]"></span> Player 1 (left)
                </span>
                <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ffa9f1]"></span> Player 2 (right)
                </span>
                <span className="opacity-60">•</span>
                <span>
                    You: <b>{you}</b> {yourTurn ? "— your turn" : ""}
                </span>
                <span className="opacity-60">•</span>
                <span>
                    Players in room: <b>{Math.min(peers.length, 2)}</b>
                    {peers.length > 2 ? ` (+${peers.length - 2} spectators)` : ""}
                </span>
                <span>Room: <code className="px-1.5 py-0.5 bg-white/5 rounded">{roomId}</code></span>
                <button
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                    className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15"
                >
                    Copy link
                </button>
                <button onClick={shareRoom} className="text-xs px-2 py-1 rounded bg-indigo-500/90 hover:bg-indigo-600">
                    Share
                </button>
            </div>

            {waitingForP2 && (
                <div className="text-xs px-3 py-2 rounded bg-amber-500/15 text-amber-200 border border-amber-500/20">
                    Waiting for Player 2 to join this room…
                </div>
            )}

            <div className="rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    onMouseMove={onMove}
                    onClick={handlePlace}
                    className={`block ${yourTurn ? "cursor-crosshair" : "cursor-not-allowed opacity-90"}`}
                />
            </div>

            <div className="flex gap-3 mt-2">
                <button onClick={() => handleReset(true)}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15">
                    Reset
                </button>
                <button
                    onClick={handleScratch}
                    disabled={
                        !(role === 1 && phase === "P1_READY") && !(role === 2 && phase === "P2_READY")
                    }
                    className={`px-4 py-2 rounded-xl transition ${
                        (role === 1 && phase === "P1_READY") || (role === 2 && phase === "P2_READY")
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : "bg-white/10 opacity-40"
                    }`}
                >
                    Scratch (Fold)
                </button>
            </div>

            <div className="text-xs text-slate-400">
                role: <b>{String(role)}</b> • phase: <b>{phase}</b> • peers: <b>{peers.length}</b>
            </div>

            {(phase === "WIN_P1" || phase === "WIN_P2") && (
                <div className="mt-2 text-sm opacity-80">Start a new round with <b>Reset</b>.</div>
            )}
        </div>
    );
}