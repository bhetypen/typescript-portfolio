import { Download } from "lucide-react";

interface HeroGreetingProps {
    onFrontend: () => void;
    resumeUrl?: string;
}

export default function HeroGreeting({
                                         onFrontend,
                                         resumeUrl = "#",
                                     }: HeroGreetingProps) {
    return (
        <div className="flex flex-col items-start text-white p-4">
            {/* MAIN HEADING (H1) */}
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-2 tracking-tighter">
                Hi, I'm Bhety
            </h1>

            {/* SUBTITLE (P) */}
            <p className="text-base sm:text-m text-gray-300 mb-1 font-light">
                Passionate about Building clean Frontend &amp; solid Backend.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-1">
                {/* 1. Explore Panels (Orange, Base Border) */}
                <button
                    onClick={onFrontend}
                    className="pointer-events-auto inline-flex items-center justify-center w-full sm:w-auto
                     px-2 py-1 text-sm font-light
                     text-white bg-transparent
                     border border-orange-500 rounded-sm
                     shadow-lg shadow-orange-500/20
                     hover:bg-orange-500 hover:text-black
                     transition duration-300 transform hover:scale-[1.02]"
                >
                    Explore Panels
                </button>

                {/* 2. Resume Download (White, Visually Thinner Border) */}
                <a
                    href={resumeUrl}
                    download
                    className="pointer-events-auto inline-flex items-center justify-center w-full sm:w-auto space-x-2
                     px-2 py-1 text-sm font-light
                     border border-white/70 text-white rounded-sm
                     hover:bg-white hover:text-black
                     transition duration-300"
                >
                    <span>Download Resume</span>
                    <Download className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}
