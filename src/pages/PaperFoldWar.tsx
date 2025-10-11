import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Paper Fold War — pass-and-play React mini-game (OFFLINE)
 * Rules (digital version):
 * 1) The board is split by a vertical fold line (left = Player 1, right = Player 2).
 * 2) On your turn, click your half to place ONE circle (your "shot").
 * 3) Press SCRATCH to "fold"; your shot mirrors across the fold line.
 * 4) If the mirrored shot overlaps any hidden enemy circle, you WIN.
 * 5) Otherwise, play passes to the other player. Their circles remain hidden.
 *
 * Notes:
 * - Only YOUR circles are visible on your turn.
 * - Overlap = distance between centers <= 2 * radius (touching counts).
 * - Tip: Pass the device after pressing Scratch to keep circles secret.
 */
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

export default function PaperFoldWar() {

    const [board, setBoard] = useState<BoardConfig>(getBoardConfig());

    useEffect(() => {
        function handleResize() {
            setBoard(getBoardConfig());
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { width, height, foldX, radius } = board

    // Board config
    //const width = 900;
    //const height = 520;
    //const foldX = width / 2;
    //const radius = 14; // circle radius (px)

    type Pt = { x: number; y: number };

    // Hidden state: circles placed by each player
    const [p1Circles, setP1Circles] = useState<Pt[]>([]);
    const [p2Circles, setP2Circles] = useState<Pt[]>([]);

    // Turn state machine
    type Phase =
        | "P1_PLACE"
        | "P1_READY"
        | "P1_SCRATCH"
        | "P2_PLACE"
        | "P2_READY"
        | "P2_SCRATCH"
        | "WIN_P1"
        | "WIN_P2";

    const [phase, setPhase] = useState<Phase>("P1_PLACE");
    const [hover, setHover] = useState<Pt | null>(null);
    const [lastShot, setLastShot] = useState<Pt | null>(null); // where player clicked
    const [mirror, setMirror] = useState<Pt | null>(null); // mirrored position across fold

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Helpers
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const dist2 = (a: Pt, b: Pt) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

    const currentPlayer = useMemo(
        () => (phase.startsWith("P1") ? 1 : phase.startsWith("P2") ? 2 : null),
        [phase]
    );

    const yourHalf = (player: 1 | 2) => ({
        minX: player === 1 ? 0 : foldX,
        maxX: player === 1 ? foldX : width,
        minY: 0,
        maxY: height,
    });

    const inHalf = (pt: Pt, player: 1 | 2) => {
        const h = yourHalf(player);
        return pt.x >= h.minX && pt.x <= h.maxX && pt.y >= h.minY && pt.y <= h.maxY;
    };

    const mirrorAcrossFold = (pt: Pt): Pt => ({ x: width - pt.x, y: pt.y });

    const handlePlace = (e: React.MouseEvent) => {
        if (!(phase === "P1_PLACE" || phase === "P2_PLACE")) return;
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const x = clamp(e.clientX - rect.left, 0, width);
        const y = clamp(e.clientY - rect.top, 0, height);

        const player: 1 | 2 = phase.startsWith("P1") ? 1 : 2;
        if (!inHalf({ x, y }, player)) return; // ignore clicks outside your half

        const shot = { x, y };
        setLastShot(shot);
        setMirror(mirrorAcrossFold(shot));

        if (player === 1) {
            setP1Circles((prev) => [...prev, shot]);
            setPhase("P1_READY");
        } else {
            setP2Circles((prev) => [...prev, shot]);
            setPhase("P2_READY");
        }
    };

    const handleScratch = () => {
        if (!(phase === "P1_READY" || phase === "P2_READY")) return;
        const player: 1 | 2 = phase.startsWith("P1") ? 1 : 2;

        const mirrored = mirror;
        if (!mirrored) return;

        const enemy = player === 1 ? p2Circles : p1Circles;
        const hit = enemy.some((c) => dist2(c, mirrored) <= (2 * radius) ** 2);

        // Animate brief scratch ripple (optional via phase swap)
        setTimeout(() => {
            if (hit) setPhase(player === 1 ? "WIN_P1" : "WIN_P2");
            else setPhase(player === 1 ? "P2_PLACE" : "P1_PLACE");
            setLastShot(null);
            setMirror(null);
        }, 150);

        // Show interim "SCRATCH" visual
        setPhase(player === 1 ? "P1_SCRATCH" : "P2_SCRATCH");
    };

    const handleReset = () => {
        setP1Circles([]);
        setP2Circles([]);
        setPhase("P1_PLACE");
        setLastShot(null);
        setMirror(null);
    };

    // Drawing
    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        // Background
        ctx.fillStyle = "#0b1020";
        ctx.fillRect(0, 0, width, height);

        // Halves
        ctx.fillStyle = "#0f142a";
        ctx.fillRect(0, 0, foldX, height);
        ctx.fillStyle = "#0d1325";
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

        // Grid (subtle)
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

        // Show only current player's circles on their turn
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

        //if (phase.startsWith("P1")) drawCircles(p1Circles, "#5ee1ff");
        //if (phase.startsWith("P2")) drawCircles(p2Circles, "#ffa9f1");

        const isWinningPhase = phase === "WIN_P1" || phase === "WIN_P2";

        // Draw P1's circles
        if (phase.startsWith("P1") || isWinningPhase) {
            drawCircles(p1Circles, "#5ee1ff");
        }

        // Draw P2's circles
        if (phase.startsWith("P2") || isWinningPhase) {
            drawCircles(p2Circles, "#ffa9f1");
        }

        // Hover preview (placement only)
        if ((phase === "P1_PLACE" || phase === "P2_PLACE") && hover) {
            const player: 1 | 2 = phase.startsWith("P1") ? 1 : 2;
            if (inHalf(hover, player)) {
                ctx.beginPath();
                ctx.arc(hover.x, hover.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = player === 1 ? "#5ee1ff66" : "#ffa9f166";
                ctx.fill();
            }
        }

        // Scratch visualization
        if (phase === "P1_SCRATCH" || phase === "P2_SCRATCH") {
            if (lastShot && mirror) {
                // show original shot
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#c3d0ff88";
                ctx.arc(lastShot.x, lastShot.y, radius, 0, Math.PI * 2);
                ctx.stroke();
                // show mirrored position
                ctx.beginPath();
                ctx.setLineDash([4, 6]);
                ctx.strokeStyle = "#ffd7f788";
                ctx.arc(mirror.x, mirror.y, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                // scratch line
                ctx.beginPath();
                ctx.moveTo(lastShot.x, lastShot.y);
                ctx.lineTo(mirror.x, mirror.y);
                ctx.strokeStyle = "#ffffff22";
                ctx.stroke();
            }
        }
    }, [phase, p1Circles, p2Circles, hover, lastShot, mirror]);

    // Mouse tracking for hover
    const onMove = (e: React.MouseEvent) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    // UI helpers
    const labelPhase = () => {
        switch (phase) {
            case "P1_PLACE":
                return "Player 1: place a circle";
            case "P1_READY":
                return "Player 1: press SCRATCH to fold";
            case "P2_PLACE":
                return "Player 2: place a circle";
            case "P2_READY":
                return "Player 2: press SCRATCH to fold";
            case "P1_SCRATCH":
            case "P2_SCRATCH":
                return "Folding…";
            case "WIN_P1":
                return "Player 1 WINS!";
            case "WIN_P2":
                return "Player 2 WINS!";
        }
    };

    const canScratch = phase === "P1_READY" || phase === "P2_READY";
    const canPlace = phase === "P1_PLACE" || phase === "P2_PLACE";

    // Safe zones text
    const zoneText =
        currentPlayer === 1 ? "Your zone: LEFT half" : currentPlayer === 2 ? "Your zone: RIGHT half" : "";

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start gap-4 p-6 bg-[#0a0e1c] text-white">
            <h1 className="text-2xl font-semibold tracking-tight">Paper Fold War</h1>
            <p className="opacity-80 -mt-2">{labelPhase()}</p>

            <div className="flex items-center gap-3 text-sm opacity-80">
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#5ee1ff]"></span> Player 1
        </span>
                <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ffa9f1]"></span> Player 2
        </span>
                <span className="opacity-60">•</span>
                <span>{zoneText}</span>
            </div>

            <div className="rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    onMouseMove={onMove}
                    onClick={handlePlace}
                    className="cursor-crosshair block"
                />
            </div>

            <div className="flex gap-3 mt-2">
                <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 transition"
                >
                    Reset
                </button>

                <button
                    disabled={!canPlace}
                    className={`px-4 py-2 rounded-xl transition ${
                        canPlace ? "bg-indigo-500 hover:bg-indigo-600" : "bg-white/10 opacity-40"
                    }`}
                >
                    Click your half to place
                </button>

                <button
                    onClick={handleScratch}
                    disabled={!canScratch}
                    className={`px-4 py-2 rounded-xl transition ${
                        canScratch ? "bg-emerald-500 hover:bg-emerald-600" : "bg-white/10 opacity-40"
                    }`}
                >
                    Scratch (Fold)
                </button>
            </div>

            {(phase === "P1_READY" || phase === "P2_READY") && (
                <p className="text-xs opacity-70">
                    Tip: Hand the device to the next player only after pressing <b>Scratch</b>, so their circles stay secret.
                </p>
            )}

            {(phase === "WIN_P1" || phase === "WIN_P2") && (
                <div className="mt-2 text-sm opacity-80">
                    Start a new round with <b>Reset</b>.
                </div>
            )}
        </div>
    );
}
