import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaperFoldWarOnline from '@/pages/PaperFoldWarOnline';
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";

export default function GameOnlyApp() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/games/paper-fold-war/online" element={<PaperFoldWarOnline />} />
                <Route path="/games/paper-fold-war/online/:roomId" element={<PaperFoldWarOnline />} />
            </Routes>
            <Footer/>
        </BrowserRouter>
    );
}
