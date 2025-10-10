import { SquareCard } from "@/components/ui/square";

type Project = {
    title: string;
    description: string;
    tags?: string[];
    links?: { demo?: string; github?: string };
    thumbnail?: string;
};

export default function ProjectCard({
                                        title,
                                        description,
                                        tags = [],
                                        links = {},
                                        thumbnail,
                                    }: Project) {
    return (
        <SquareCard>
            <div className="space-y-3 text-white">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full aspect-video object-cover rounded-[4px] border border-white/10"
                        loading="lazy"
                    />
                ) : null}

                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-slate-300">{description}</p>

                {tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((t) => (
                            <span
                                key={t}
                                className="rounded-[3px] bg-slate-800 px-2 py-0.5 text-xs text-slate-200 border border-slate-700"
                            >
                {t}
              </span>
                        ))}
                    </div>
                ) : null}

                {(links?.demo || links?.github) && (
                    <div className="pt-2 flex gap-3 text-sm">
                        {links.demo && (
                            <a
                                className="underline underline-offset-4 hover:opacity-80"
                                href={links.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Live Demo
                            </a>
                        )}
                        {links.github && (
                            <a
                                className="underline underline-offset-4 hover:opacity-80"
                                href={links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub
                            </a>
                        )}
                    </div>
                )}
            </div>
        </SquareCard>
    );
}
