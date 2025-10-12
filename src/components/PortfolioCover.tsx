// src/components/PortfolioCover.tsx
import React, {useEffect, useMemo, useRef, useState} from "react";
import {Stage, Layer, Line, Image as KonvaImage, Text} from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import HeroGreeting from "./HeroGreeting";

// --------------------
// Types
// --------------------
type Point = [number, number];

interface Hotspot {
    id: string;
    points: Point[];
}

interface Bounds {
    x: number;
    y: number;
    w: number;
    h: number;
}

// --------------------
// Constants / Data
// --------------------
const IMG_URL = "/images/hero-image2.png";

const HOTSPOTS: Hotspot[] = [
    {id: "about", points: [[695, 1441], [1055, 1290], [1055, 1708], [695, 1730]]},
    {id: "education", points: [[1350, 1445], [1685, 1365], [1685, 1658], [1348, 1685]]},
    {id: "contact-me", points: [[2362, 1295], [2549, 1372], [2549, 1490], [2362, 1440]]},
    {id: "tools", points: [[1762, 530], [1966, 670], [1968, 920], [1768, 820]]},
    {id: "experience", points: [[1350, 1245], [1689, 1122], [1688, 1259], [1350, 1355]]},
    {id: "project-frontend", points: [[1167, 770], [1287, 680], [1285, 1145], [1167, 1195]]},
    {id: "project-backend", points: [[1365, 615], [1480, 530], [1486, 1045], [1365, 1105]]},
];

const NEON: string[] = [
    "rgba(0, 255, 255, 0.75)",
    "rgba(255, 0, 255, 0.75)",
    "rgba(0, 255, 128, 0.75)",
    "rgba(255, 255, 255, 0.7)",
    "rgba(255, 255, 0, 0.75)",
];

const LABELS: Record<string, string> = {
    "about": "Games",
    "education": "Education",
    "contact-me": "Contact Me",
    "tools": "Tools",
    "experience": "Experience",
    "project-frontend": "Frontend",
    "project-backend": "Backend",
};

const ROTATION_MAP: Record<string, number> = {
    about: -12,
    education: -8,
    "contact-me": 18,
    tools: 25,
    experience: -18,
    "project-frontend": 0,
    "project-backend": 0,
};

// helpers: bounds of a polygon [[x,y],...]
function getBounds(points: Point[]): Bounds {
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return {x: minX, y: minY, w: maxX - minX, h: maxY - minY};
}

type CursorStr = string;

const defaultCursor = "default";
const customCursor = "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"%23F59E0B\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"></circle><path d=\"M1 12h5M18 12h5M12 6V1.04M12 23v-4.96M11.95 11.95h.1v.1h-.1z\"></path></g></svg>') 12 12, pointer";

// --------------------
// Component
// --------------------
export default function PortfolioCover({
                                           onGoWork,
                                           onGoEducation,
                                           onGoAbout,
                                           onGoContact,
                                           onGoTools,
                                           onGoFrontendProject,
                                           onGoBackendProject,
                                       }: {
    onGoWork: () => void;
    onGoEducation: () => void;
    onGoAbout?: () => void;
    onGoContact?: () => void;
    onGoTools?: () => void;
    onGoFrontendProject?: () => void;
    onGoBackendProject?: () => void;
}) {
    const [hoverId, setHoverId] = useState<string | null>(null); //sanity check delete later
    const [cursor, setCursor] = useState<CursorStr>(defaultCursor);


    // Refs
    const containerRef = useRef<HTMLDivElement | null>(null);
    const lineRefs = useRef<Array<Konva.Line | null>>([]);
    const textRefs = useRef<Array<Konva.Text | null>>([]);
    const flickerTimers = useRef<number[]>([]);

    // State
    const [containerW, setContainerW] = useState<number>(1000);
    const [img] = useImage(IMG_URL) as [HTMLImageElement | undefined, string?];
    const [toast, setToast] = useState<string>("");

    // natural size of the loaded image (source pixels)
    const natural = useMemo(
        () =>
            img
                ? {
                    w: (img as HTMLImageElement).naturalWidth || img.width,
                    h: (img as HTMLImageElement).naturalHeight || img.height,
                }
                : {w: 1200, h: 1600},
        [img]
    );


    // make stage width follow container
    useEffect(() => {
        const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    const scale = containerW / natural.w;
    const stageW = containerW;
    const stageH = natural.h * scale;

    const showToast = (msg: string) => {
        setToast(msg);
        window.setTimeout(() => setToast(""), 1500);
    };

    // fade on, then flicker
    useEffect(() => {
        // clear previous timers
        flickerTimers.current.forEach((id) => clearInterval(id));
        flickerTimers.current = [];

        HOTSPOTS.forEach((_, i) => {
            const line = lineRefs.current[i];
            const label = textRefs.current[i];
            if (!line || !label) return;

            // start dark
            line.opacity(0);
            line.shadowBlur(0);
            label.opacity(0);

            // fade in
            const d = 1.2 + i * 0.2;
            new Konva.Tween({
                node: line,
                duration: d,
                opacity: 0.7,
                shadowBlur: 12,
                easing: Konva.Easings.EaseInOut,
            }).play();

            new Konva.Tween({
                node: label,
                duration: d,
                opacity: 0.9,
                easing: Konva.Easings.EaseInOut,
            }).play();

            // subtle flicker
            const timer = window.setInterval(() => {
                const lineTween = new Konva.Tween({
                    node: line,
                    duration: 0.9,
                    opacity: 0.62 + Math.random() * 0.12,
                    shadowBlur: 10 + Math.random() * 4,
                    easing: Konva.Easings.EaseInOut,
                });
                const textTween = new Konva.Tween({
                    node: label,
                    duration: 0.9,
                    opacity: 0.85 + Math.random() * 0.1,
                    easing: Konva.Easings.EaseInOut,
                });
                lineTween.play();
                textTween.play();
            }, 2000 + i * 300);

            flickerTimers.current[i] = timer;
        });

        return () => {
            flickerTimers.current.forEach((id) => clearInterval(id));
            flickerTimers.current = [];
        };
    }, [containerW]);

    //  Explore Panels → trigger panels strong flicker
    const handleFront = () => {
        showToast("Flickering all panels...");

        // loop through all hotspot refs
        lineRefs.current.forEach((line, i) => {
            const label = textRefs.current[i];
            if (!line || !label) return;

            // fast, jittery neon steps
            const steps = [
                {o: 0.2, b: 4}, {o: 1.0, b: 25},
                {o: 0.4, b: 6}, {o: 0.9, b: 20},
                {o: 0.3, b: 5}, {o: 0.7, b: 12},
            ];

            steps.forEach((s, k) => {
                setTimeout(() => {
                    line.opacity(s.o);
                    line.shadowBlur(s.b);
                    line.getLayer()?.batchDraw();
                    label.opacity(s.o);
                    label.getLayer()?.batchDraw();
                }, k * 120); // 120ms jitter
            });

            // settle back to the normal subtle glow
            setTimeout(() => {
                line.opacity(0.7);
                line.shadowBlur(12);
                label.opacity(0.9);
                line.getLayer()?.batchDraw();
                label.getLayer()?.batchDraw();
            }, steps.length * 120 + 200);
        });
    };


    //const cssLeft = 228 * scale;
    //const cssTop = 100 * scale;
    const isReady = !!img && containerW > 0;


    const hotspotAction = (id: string) => {
        switch (id) {
            case "experience":
                return () => onGoWork();
            case "education":
                return () => onGoEducation();
            case "about":
                return onGoAbout ?? (() => showToast("About panel clicked"));
            case "contact-me":
                return onGoContact ?? (() => showToast("Contact panel clicked"));
            case "tools":
                return onGoTools ?? (() => showToast("Tools panel clicked"));
            case "project-frontend":
                return onGoFrontendProject ?? (() => showToast("Frontend panel clicked"));
            case "project-backend":
                return onGoBackendProject ?? (() => showToast("Backend panel clicked"));
            default:
                return () => showToast(`${id} clicked`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-white">
            {toast && (
                <div className="absolute bottom-8 bg-gray-900 px-4 py-2 rounded shadow">
                    {toast}
                </div>
            )}

            <div ref={containerRef} className="w-80 sm:w-2xl xl:max-w-3xl mx-auto">
                {/* Hero Greeting overlay */}
                {isReady && (
                    <div
                        className="w-full sm:max-w-lg px-6 sm:px-0 mb-6 pointer-events-none"
                    >
                        <HeroGreeting onFrontend={handleFront} resumeUrl="/files/bhety-resume.pdf"/>
                    </div>
                )}

                <Stage width={stageW} height={stageH} scaleX={scale} scaleY={scale} style={{cursor}} draggable={false}                >
                    {/* Background */}
                    <Layer listening={false}>
                        {img && <KonvaImage image={img} width={natural.w} height={natural.h}/>}
                    </Layer>

                    {/* Hotspots */}
                    <Layer listening>
                        {HOTSPOTS.map((h, i) => {
                            const color = NEON[i % NEON.length];
                            const bounds = getBounds(h.points);
                            const fontSize = Math.max(16, Math.min(36, bounds.h * 10));
                            const label = LABELS[h.id] ?? h.id;
                            const isVertical = h.id === "project-frontend" || h.id === "project-backend";

                            const inv = 1 / scale;
                            const lineHeight = 1.0;
                            const lines = isVertical ? label.length : 1;
                            const textHeight = fontSize * lines * lineHeight;
                            const centeredY = isVertical
                                ? bounds.y + (bounds.h - textHeight) / 2
                                : bounds.y + bounds.h / 2 - fontSize / 2;

                            const bumpHover = (isHover: boolean) => {
                                const line = lineRefs.current[i];
                                const label = textRefs.current[i];
                                if (!line || !label) return;

                                // fast, clear feedback
                                line.to({
                                    opacity: isHover ? 0.98 : 0.7,
                                    shadowBlur: isHover ? 28 : 12,
                                    shadowOpacity: isHover ? 1 : 0.6,
                                    duration: 0.08,
                                });
                                label.to({
                                    opacity: isHover ? 1 : 0.9,
                                    duration: 0.08,
                                });
                            };

                            return (
                                <React.Fragment key={`${h.id}-${i}`}>
                                    <Line
                                        ref={(node) => {
                                            lineRefs.current[i] = node as unknown as Konva.Line
                                        }}
                                        points={h.points.flat()}
                                        closed
                                        fill={color}
                                        stroke="white"
                                        strokeWidth={1}
                                        shadowEnabled
                                        shadowColor={color}
                                        //shadowOpacity={0.6}
                                        //opacity={0}
                                        //shadowBlur={0}
                                        hitStrokeWidth={30} //bigger click area

                                        onMouseEnter={() => {
                                            setHoverId(h.id);
                                            bumpHover(true);
                                            setCursor(customCursor);   // custom image cursor
                                        }}
                                        onMouseLeave={() => {
                                            setHoverId((prev) => (prev === h.id ? null : prev));
                                            bumpHover(false);
                                            setCursor(defaultCursor);  // back to default
                                        }}


                                        opacity={hoverId === h.id ? 0.9 : 0.7}         // brighter on hover
                                        shadowBlur={hoverId === h.id ? 20 : 12}        // stronger glow on hover
                                        shadowOpacity={hoverId === h.id ? 0.9 : 0.6}   // slightly stronger halo
                                        onTap={hotspotAction(h.id)}
                                        onTouchStart={() => setHoverId(h.id)}          // mobile feedback
                                        onTouchEnd={() => setHoverId(null)}

                                        onClick={hotspotAction(h.id)}



                                    />
                                    <Text
                                        ref={(node) => {
                                            textRefs.current[i] = node as unknown as Konva.Text
                                        }}
                                        text={isVertical ? label.split("").join("\n") : label}
                                        x={bounds.x + bounds.w / 2}
                                        y={centeredY}
                                        width={bounds.w}
                                        height={bounds.h}
                                        align="center"
                                        verticalAlign="top"
                                        fontSize={fontSize * scale}
                                        scaleX={inv}
                                        scaleY={inv}
                                        fontStyle="bold"
                                        fill="#111"
                                        opacity={0}
                                        rotation={ROTATION_MAP[h.id] ?? 0}
                                        offsetX={bounds.w / 2}
                                        offsetY={0}
                                        listening={false}
                                    />
                                </React.Fragment>
                            );
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
}
