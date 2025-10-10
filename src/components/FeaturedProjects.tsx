// src/components/FeaturedProjects.tsx
import { SquareSection } from "@/components/ui/square";
import ProjectCard from "@/components/ProjectCard";
import { fullstackProjects } from "@/data/projects"; // adjust path

export default function FeaturedProjects() {
    const items = fullstackProjects.slice(0, 2);

    return (
        <SquareSection className="text-white pb-20">
            <div>
                <h2 className="mb-8 text-xl font-bold text-center sm:text-left">Featured Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((project, i) => (
                    <ProjectCard key={i} {...project} />
                ))}
            </div>

            <div className="mt-6 flex justify-end">
                <a
                    href="/projects"
                    className="inline-block px-4 py-2 border border-white/30 rounded-sm hover:bg-white/10 transition hover:bg-amber-600 hover:shadow-[0_0_10px_#F59E0B]"
                >
                    View All Projects →
                </a>
            </div>
        </SquareSection>
    );
}

