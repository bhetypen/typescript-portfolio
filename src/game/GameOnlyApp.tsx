import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaperFoldWarOnline from '@/pages/PaperFoldWarOnline';

export default function GameOnlyApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/games/paper-fold-war/online" element={<PaperFoldWarOnline />} />
                <Route path="/games/paper-fold-war/online/:roomId" element={<PaperFoldWarOnline />} />
            </Routes>
        </BrowserRouter>
    );
}
