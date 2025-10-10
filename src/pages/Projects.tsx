// src/components/ProjectsTabs.tsx
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { frontendProjects, fullstackProjects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import { SquareSection } from "@/components/ui/square";

export type ProjectTab = "fullstack" | "frontend";

type Props = {
    defaultTab?: ProjectTab;
};

export default function ProjectsTabs({ defaultTab = "fullstack" }: Props) {
    const [searchParams] = useSearchParams();

    // fallback to defaultTab if param doesnt exist
    const urlTab = (searchParams.get("tab") as ProjectTab | null) ?? null;
    const initialTab = urlTab === "frontend" || urlTab === "fullstack" ? urlTab : defaultTab;

    const [tab, setTab] = useState<ProjectTab>(initialTab);
    const [q, setQ] = useState("");
    const [tag, setTag] = useState<string | null>(null);

    // Keep `tab` in sync if the URL search param changes after mount
    useEffect(() => {
        const p = (searchParams.get("tab") as ProjectTab | null) ?? null;
        if (p && (p === "frontend" || p === "fullstack")) {
            if (p !== tab) setTab(p);
        } else {
            // if no param, optionally reset to defaultTab
            if (!p && tab !== defaultTab) setTab(defaultTab);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const data = tab === "fullstack" ? fullstackProjects : frontendProjects;

    const allTags = useMemo(() => {
        const s = new Set<string>();
        data.forEach((p) => p.tags?.forEach((t) => s.add(t)));
        return Array.from(s).sort();
    }, [data]);

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase();
        return data.filter((p) => {
            const matchesQ =
                !ql ||
                p.title.toLowerCase().includes(ql) ||
                p.description.toLowerCase().includes(ql) ||
                p.tags?.some((t) => t.toLowerCase().includes(ql));
            const matchesTag = !tag || p.tags?.includes(tag);
            return matchesQ && matchesTag;
        });
    }, [q, tag, data]);

    return (
        <div className="bg-black min-h-screen text-white">
            <SquareSection className="py-12">
                <div className="flex justify-center text-xl sm:text-2xl font-bold mb-4">
                    <h1>Projects</h1>
                </div>

                <Tabs value={tab} onValueChange={(v) => setTab(v as ProjectTab)} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full bg-black/30 border border-white/10 rounded-sm mb-6">
                        <TabsTrigger value="fullstack"
                                     className="rounded-none border border-[#F59E0B]/50 data-[state=active]:bg-[#F59E0B] data-[state=active]:text-black data-[state=active]:shadow-[0_0_15px_#F59E0B] data-[state=inactive]:text-white hover:shadow-[0_0_10px_#F59E0B] transition">
                            Full-stack
                        </TabsTrigger>
                        <TabsTrigger value="frontend"
                                     className="rounded-none border border-[#F59E0B]/50 data-[state=active]:bg-[#F59E0B] data-[state=active]:text-black data-[state=active]:shadow-[0_0_15px_#F59E0B] data-[state=inactive]:text-white hover:shadow-[0_0_10px_#F59E0B] transition">
                            Frontend
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search projects..."
                            className="px-3 py-2 bg-slate-900/60 border border-white/10 rounded-sm outline-none focus:border-white/30 text-sm"
                        />
                        <select
                            value={tag ?? ""}
                            onChange={(e) => setTag(e.target.value || null)}
                            className="px-3 py-2 bg-slate-900/60 border border-white/10 rounded-sm text-sm"
                        >
                            <option value="">All tags</option>
                            {allTags.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    <TabsContent value="fullstack">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filtered.map((p, i) => (
                                <ProjectCard key={i} {...p} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="frontend">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filtered.map((p, i) => (
                                <ProjectCard key={i} {...p} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-end">
                    <a
                        href="/"
                        className="inline-block px-4 py-2 border border-white/30 rounded-sm hover:bg-white/10 transition hover:bg-amber-600 hover:shadow-[0_0_10px_#F59E0B]"
                    >
                        Back to Home →
                    </a>
                </div>
            </SquareSection>


        </div>
    );
}
