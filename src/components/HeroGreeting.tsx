import {Download} from "lucide-react";

interface HeroGreetingProps {
    onFrontend: () => void;
    resumeUrl?: string;
}

export default function HeroGreeting({
                                         onFrontend,
                                         resumeUrl = "#",
                                     }: HeroGreetingProps) {
    return (
        <div className="flex flex-col items-start text-white p-3 sm:p-4 mt-4 md:mt-12 lg:mt-20">
            {/* MAIN HEADING (H1) */}
            <h1
                className="
            text-3xl sm:text-3xl md:text-4xl
            font-extrabold
            mb-2
            tracking-tight
        "
            >
                Hi, I'm Bhety
            </h1>

            {/* SUBTITLE */}
            <p
                className="
          text-sm sm:text-base md:text-sm
          text-gray-300
          mb-2 sm:mb-3
          font-light
        "
            >
                Passionate about building clean Frontend &amp; solid Backend.
            </p>

            {/* Call-to-Action Buttons */}
            <div
                className="
          flex flex-col sm:flex-row
          w-full sm:w-auto
          space-y-2 sm:space-y-0 sm:space-x-2
        "
            >
                {/* Explore Panels */}
                <button
                    onClick={onFrontend}
                    className="
            pointer-events-auto
            inline-flex items-center justify-center
            w-full sm:w-auto
            px-3 py-1 text-sm sm:px-3 sm:py-1 sm:text-sm md:px-2 md:py-1 md:text-xs
            font-light
            text-white bg-transparent
            border border-orange-500 rounded-sm
            shadow-lg shadow-orange-500/20
            hover:bg-orange-500 hover:text-black
            transition duration-300 transform hover:scale-[1.02]
          "
                >
                    Explore Panels
                </button>

                {/* Resume Download */}
                <a
                    href={resumeUrl}
                    download
                    className="
            pointer-events-auto
            inline-flex items-center justify-center
            w-full sm:w-auto
            px-3 py-1 text-sm sm:px-3 sm:py-1 sm:text-sm md:px-2 md:py-1 md:text-xs
            font-light
            border border-white/70 text-white rounded-sm
            hover:bg-white hover:text-black
            transition duration-300
          "
                >
                    <span>Download Resume</span>
                    <Download className="w-4 h-4 ml-1"/>
                </a>
            </div>
        </div>
    );
}
