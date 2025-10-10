import React from 'react';
import { Code, Cloud, Database, HardDrive } from 'lucide-react';

// --- 1. Define Data Structure ---

type TechItem = {
    name: string;
    icon?: string; // Icon names from lucide-react could be used here, but we'll use a string for simplicity
};

type TechCategory = {
    title: string;
    description: string;
    icon: React.ElementType;
    tools: TechItem[];
};

const TECHNOLOGIES: TechCategory[] = [
    {
        title: "Frontend & UI",
        description: "Modern interfaces, frameworks, and component libraries.",
        icon: Code,
        tools: [
            { name: "React / Next.js" },
            { name: "Vue / Nuxt" },
            { name: "Tailwind CSS & shadcn/ui" },
            { name: "Material UI" },
        ],
    },
    {
        title: "Backend & Services",
        description: "Robust services using Node.js and Java/Spring Boot.",
        icon: HardDrive,
        tools: [
            { name: "Node.js / Express" },
            { name: "Java / Spring Boot" },
            { name: "RESTful APIs" },
            { name: "Authentication (JWT)" },
        ],
    },
    {
        title: "Databases & ORMs", //
        description: "Relational and NoSQL database management.",
        icon: Database,
        tools: [
            { name: "PostgreSQL" },
            { name: "MySQL" },
            { name: "OracleDB" },
            { name: "MongoDB" },

        ],
    },
    {
        title: "DevOps & Deployment", // Renamed for clarity
        description: "Containerization, cloud, and version control.",
        icon: Cloud,
        tools: [
            { name: "Docker (Containerization)" },
            { name: "AWS Lambda (Serverless)" },
            { name: "Vercel / Netlify" },
            { name: "Git & GitHub" },
        ],
    },
];

// --- 2. Tech Card Component (with glowing effect) ---

const TechCard: React.FC<TechCategory> = ({ title, description, icon: Icon, tools }) => {
    return (
        <div className="bg-slate-900/60 p-6 rounded-xl border border-white/10 transition-all duration-300 hover:border-[#F59E0B] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-amber-500" />
                <h2 className="text-xl font-bold">{title}</h2>
            </div>
            <p className="text-sm text-slate-300 mb-4">{description}</p>

            <div className="space-y-2">
                {tools.map((tool, index) => (
                    <div key={index} className="flex items-center text-sm">
                        {/* CHANGED bg-amber-400 to bg-white for white bullet points */}
                        <span className="w-2 h-2 mr-3 bg-white rounded-full inline-block flex-shrink-0" aria-hidden="true" />
                        <span className="text-white/90">{tool.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 3. Main Tools Page Component ---

export default function ToolsPage() {
    return (
        <div className="bg-black min-h-screen text-white font-sans">
            <section className="max-w-4xl mx-auto px-4 py-16">
                <header className="mb-12 text-center">
                    <h1 className="text-2xl sm:text-2xl font-bold mb-4 tracking-tight text-white">
                        Tools Stack
                    </h1>
                    {/* Subtitle design retained (centered, slate text) */}
                    <p className="text-slate-300 max-w-2xl mx-auto">
                        A focused overview of the primary technologies, frameworks, and languages I use to bring projects to life.
                    </p>
                </header>

                {/* Grid Container for Technology Cards */}
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {TECHNOLOGIES.map((category) => (
                        <TechCard key={category.title} {...category} />
                    ))}
                </div>

                {/* Simple Callout/Footer */}
                <footer className="mt-16 text-center text-slate-400">
                    <p className="text-lg">Always learning and adapting to new technologies.</p>
                </footer>
            </section>
        </div>
    );
}
