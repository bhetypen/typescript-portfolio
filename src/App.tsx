import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProjectsPage from "@/pages/Projects";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import Privacy from "@/pages/Privacy.tsx";
import Contact from "@/pages/Contact.tsx";
import Games from "@/pages/Games.tsx";
import PaperFoldWarOnline from "@/pages/PaperFoldWarOnline.tsx"
import PaperFoldWar from "@/pages/PaperFoldWar.tsx";
import ToolsPage from "@/pages/Tools.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/privacy" element={<Privacy/>}/>
                <Route path="/contact" element={<Contact />} />
                <Route path="/games" element={<Games/>}/>
                <Route path="/tools" element={<ToolsPage/>}/>
                <Route path="/games/paper-fold-war" element={<PaperFoldWar/>}/>
                <Route path="/games/paper-fold-war/online" element={<PaperFoldWarOnline />} />
                <Route path="/games/paper-fold-war/online/:roomId" element={<PaperFoldWarOnline />} />
            </Routes>
            <Footer/>
        </BrowserRouter>
    );
}
