// src/pages/Games.tsx
import { Link } from "react-router-dom";
import { Gamepad2, ExternalLink } from "lucide-react";

type Game = {
    slug: string;
    title: string;
    blurb: string;
    route?: string;      // internal route (preferred)
    external?: string;   // external demo link (optional)
    status?: "Playable" | "WIP";
    tech?: string[];
    thumb?: string;      // optional image path
};

const GAMES: Game[] = [
    {
        slug: "paper-fold-war",
        title: "Paper Fold War",
        blurb: "(Currently in Dev) The art of the scratch-card war. Predict your foe's move while hiding your own target in this unique, circular game of offense and defense.",
        route: "/games/paper-fold-war",
        status: "Playable",
        tech: ["React", "Canvas", "TypeScript"],
    },

    {
        slug: "paper-fold-war-online",
        title: "Paper Fold War (Online)",
        blurb: "Take the war online! Challenge friends instantly across any device with real-time room creation and link sharing.",
        route: "/games/paper-fold-war/online",
        status: "Playable",
        tech: ["React", "Supabase Realtime"],
    },
    // more games

];

export default function Games() {
    return (
        <div className="bg-black min-h-screen text-white">
            <section className="max-w-4xl mx-auto px-4 py-14">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold">Games</h1>
                    <p className="text-slate-300 mt-2">
                        Small interactive experiments and mini-games I built. Click a card to play.
                    </p>
                </header>

                {/* Grid */}
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {GAMES.map((g) => {
                        const Wrapper: any = g.route ? Link : "a";
                        const wrapperProps = g.route
                            ? { to: g.route }
                            : g.external
                                ? { href: g.external, target: "_blank", rel: "noopener noreferrer" }
                                : { href: "#", onClick: (e: any) => e.preventDefault() };

                        return (
                            <li key={g.slug}>
                                <Wrapper
                                    {...wrapperProps}
                                    // 1. ADD: h-full, flex, and flex-col for uniform card height
                                    className="group block h-full rounded-lg border border-white/10 bg-slate-900/40 hover:bg-slate-900/60 transition overflow-hidden flex flex-col"
                                >
                                    {/* Thumbnail / placeholder */}
                                    <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0">
                                        {g.thumb ? (
                                            <img
                                                src={g.thumb}
                                                alt={g.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Gamepad2 className="w-10 h-10 text-white/50 group-hover:text-white/80 transition" />
                                        )}
                                    </div>

                                    {/* Content - 2. ADD: flex-grow to ensure it fills vertical space */}
                                    <div className="p-4 flex-grow flex flex-col">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-lg font-semibold">{g.title}</h3>
                                            {g.external ? (
                                                <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-white/80" />
                                            ) : null}
                                        </div>
                                        {/* Optional: Add line-clamp-2 for blurb height consistency, if needed */}
                                        <p className="text-sm text-slate-300 mt-1 mb-1">{g.blurb}</p>

                                        {/* Meta - 3. ADD: mt-auto to anchor tags to the bottom */}
                                        <div className="mt-3 flex flex-wrap items-center gap-2 mt-auto">
                                            {g.status && (
                                                <span
                                                    className={`text-[11px] px-2 py-0.5 rounded ${
                                                        g.status === "Playable"
                                                            ? "bg-emerald-500/20 text-emerald-300"
                                                            : "bg-amber-500/20 text-amber-300"
                                                    }`}
                                                >
                          {g.status}
                        </span>
                                            )}
                                            {g.tech?.map((t) => (
                                                <span
                                                    key={t}
                                                    className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-slate-300"
                                                >
                          {t}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                </Wrapper>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}