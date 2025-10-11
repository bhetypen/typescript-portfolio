import React from 'react';
import { createRoot } from 'react-dom/client';
import GameOnlyApp from './game/GameOnlyApp';
import './index.css'
import './App.css';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GameOnlyApp />
    </React.StrictMode>
);
