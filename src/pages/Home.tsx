// src/pages/Home.tsx
import { useState } from "react";
import PortfolioCover from "@/components/PortfolioCover";
import BackgroundTabs, { type BgTab } from "@/components/BackgroundTabs";
import FeaturedProjects from "@/components/FeaturedProjects";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const [bgTab, setBgTab] = useState<BgTab>("work");
    const navigate = useNavigate();

    const goBackground = (tab: BgTab) => {
        setBgTab(tab);
        document.getElementById("background")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <div className="flex flex-col items-center justify-center bg-black min-h-screen">
            <PortfolioCover
                onGoWork={() => goBackground("work")}
                onGoEducation={() => goBackground("education")}
                onGoAbout={() => {
                    // example: scroll to about section or navigate
                    const el = document.getElementById("about");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    else navigate("/games");
                }}
                onGoContact={() => navigate("/contact")}
                onGoTools={() => navigate("/tools")}
                onGoFrontendProject={() => navigate("/projects?tab=frontend")}
                onGoBackendProject={() => navigate("/projects?tab=fullstack")}
            />
            <BackgroundTabs value={bgTab} onValueChange={setBgTab} />
            <FeaturedProjects />
        </div>
    );
}
