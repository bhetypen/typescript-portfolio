// src/components/BackgroundTabs.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { education } from "@/data/education";
import { workExperience} from "@/data/workExperience";

export type BgTab = "work" | "education";

export default function BackgroundTabs({value, onValueChange}:{value: BgTab; onValueChange:(value: BgTab) => void}) {
    return (
        <section id="background" className="max-w-5xl mx-auto px-4 py-16 text-white">
            <div className="flex justify-start text-xl sm:text-2xl font-bold mb-4">
                <h1>Background Info</h1>
            </div>
            <Tabs value={value}
                  onValueChange={(v) => onValueChange(v as BgTab)}
                  className="w-full"
            >
                {/* Squarer tab bar */}
                <TabsList className="grid grid-cols-2 w-full bg-black/30 border border-white/10 rounded-sm mb-6">
                    <TabsTrigger
                        value="work"
                        className="rounded-none border border-[#F59E0B]/50
                        data-[state=active]:bg-[#F59E0B]
                        data-[state=active]:text-black
                        data-[state=active]:shadow-[0_0_15px_#F59E0B]
                        data-[state=inactive]:text-white
                        hover:shadow-[0_0_10px_#F59E0B] transition"
                    >
                        Work
                    </TabsTrigger>
                    <TabsTrigger
                        value="education"
                        className="rounded-none border border-[#F59E0B]/50
                        data-[state=active]:bg-[#F59E0B]
                        data-[state=active]:text-black
                        data-[state=active]:shadow-[0_0_15px_#F59E0B]
                        data-[state=inactive]:text-white
                        hover:shadow-[0_0_10px_#F59E0B] transition"
                    >
                        Education
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="work">
                    <div className="max-w-3xl mx-auto"><Timeline>
                        {workExperience.map((item, i) => (
                            <TimelineItem key={i}>
                                <SquareAvatar text={logoAlt(item.company)}/>
                                <SquareCard>
                                    <h3 className="text-base sm:text-lg font-semibold text-white">{item.role}</h3>
                                    <p className="text-sm text-slate-300">{item.company}</p>
                                    <p className="text-xs text-slate-400">{item.duration} • {item.location}</p>

                                    {item.description?.length ? (
                                        <ul className="mt-3 space-y-1 text-sm text-slate-200 list-disc pl-5">
                                            {item.description.map((d, idx) => <li key={idx}>{d}</li>)}
                                        </ul>
                                    ) : null}

                                    {item.tags?.length ? (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {item.tags.map(t => (
                                                <span key={t}
                                                      className="rounded-[3px] bg-slate-800 px-2 py-0.5 text-xs text-slate-200 border border-slate-700">
                          {t}
                        </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </SquareCard>
                            </TimelineItem>
                        ))}
                    </Timeline></div>
                </TabsContent>

                <TabsContent value="education">
                    <div className="max-w-3xl mx-auto"><Timeline>
                        {education.map((item, i) => (
                            <TimelineItem key={i}>
                                <SquareAvatar text={logoAlt(item.institution)}/>
                                <SquareCard>
                                    <h3 className="text-base sm:text-lg font-semibold text-white">{item.degree}</h3>
                                    <p className="text-sm text-slate-300">{item.institution}</p>
                                    <p className="text-xs text-slate-400">{item.duration} • {item.location}</p>

                                    {item.description?.length ? (
                                        <ul className="mt-3 space-y-1 text-sm text-slate-200 list-disc pl-5">
                                            {item.description.map((d, idx) => <li key={idx}>{d}</li>)}
                                        </ul>
                                    ) : null}
                                </SquareCard>
                            </TimelineItem>
                        ))}
                    </Timeline></div>
                </TabsContent>
            </Tabs>
        </section>
    );
}

/* ---------- layout primitives (square look) ---------- */

function Timeline({children}: { children: React.ReactNode }) {
    return (
        <div className="relative">
            {/* vertical rail */}
            <div className="absolute left-[28px] sm:left-[30px] top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-5">{children}</div>
        </div>
    );
}

function TimelineItem({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative pl-20 sm:pl-24 w-full">
            <div className="w-full">{children}</div>
        </div>
    );
}

function SquareCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full rounded-sm border border-white/12 bg-slate-900/40 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            {children}
        </div>
    );
}




/* ---------- square avatar (fallback initials) ---------- */

function SquareAvatar({ text }: { text: string }) {
    return (
        <div
            className="absolute left-0 top-0 translate-y-1 rounded-[6px] bg-slate-800 border border-white/15 w-14 h-14 grid place-items-center text-sm font-semibold text-white select-none"
            aria-hidden
        >
            {initials(text)}
        </div>
    );
}

/* ---------- small helpers ---------- */

function initials(s: string) {
    return s
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() ?? "")
        .join("");
}

function logoAlt(s: string) {
    // what shows inside the square avatar (e.g., company initials)
    return s && s.trim().length > 0 ? s : "•";
}
