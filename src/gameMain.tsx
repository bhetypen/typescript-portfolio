import React from 'react';
import { createRoot } from 'react-dom/client';
import GameOnlyApp from './game/GameOnlyApp';

// If you need Tailwind styles in the game build, import your main CSS here:
import './App.css';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GameOnlyApp />
    </React.StrictMode>
);
