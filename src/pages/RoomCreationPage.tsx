interface RoomCreationPageProps {
    createRoom: () => void;
}

export default function RoomCreationPage({ createRoom }: RoomCreationPageProps) {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start gap-6 p-6 bg-[#0a0e1c] text-white">
            <h1 className="text-3xl font-bold tracking-tight">Paper Fold War — Online 🇵🇭</h1>

            <div className="max-w-3xl w-full p-6 rounded-xl bg-[#0f142a] shadow-lg">
                <p className="opacity-90 max-w-xlg mx-auto text-center mb-6">
                    Ever play 'Battleship' without the board? Growing up, our version in the Philippines was Paper Fold War, where our 'ships' were just brave circles swimming
                    across the paper sea (because, well, budget cuts!). This digital version recreates that nostalgic, high-stakes classroom classic where every single turn is an instant-win threat.
                    You'll place a soldier,
                    and that placement immediately folds the paper to see if its reflection has earned you a 'Mirror Kill' against the opponent's hidden troops.
                </p>

                <h2 className="text-xl font-semibold mb-3 text-[#F59E0B] border-b border-indigo-400/50 pb-1">
                    🎣 The Rules (The "No Rulers Needed" Edition)
                </h2>

                <div className="overflow-x-auto mb-6">
                    <table className="min-w-full text-sm text-left text-white/80">
                        <thead className="text-xs uppercase bg-[#1a2145] text-white/90">
                        <tr>
                            <th scope="col" className="px-6 py-3">Step</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                            <th scope="col" className="px-6 py-3">Game View</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="bg-[#0f142a] border-b border-white/5">
                            <td className="px-6 py-4 font-medium whitespace-nowrap">1. Place Soldier</td>
                            <td className="px-6 py-4">Click to place <span
                                className="text-yellow-500 font-bold">one circle</span> (soldier) on your side.
                            </td>
                            <td className="px-6 py-4">Placement is <span
                                className="text-yellow-500 font-bold">hidden</span>. Opponent sees <span
                                className="text-yellow-500 font-bold">nothing</span> on your side.
                            </td>
                        </tr>
                        <tr className="bg-[#0f142a] border-b border-white/5">
                            <td className="px-6 py-4 font-medium whitespace-nowrap">2. The Mighty Fold</td>
                            <td className="px-6 py-4">The game automatically triggers the <span
                                className="text-yellow-500 font-bold">Fold/Scratch</span> using your new soldier as the
                                shot.
                            </td>
                            <td className="px-6 py-4">You see the <span
                                className="text-yellow-500 font-bold">aiming line</span> (mirror path). Your opponent does <span
                                className="text-yellow-500 font-bold">not</span>.
                            </td>
                        </tr>
                        <tr className="bg-[#0f142a] border-b border-white/5">
                            <td className="px-6 py-4 font-medium whitespace-nowrap">3. Win Condition</td>
                            <td className="px-6 py-4">If your new soldier's reflection hits an existing enemy circle, <span
                                className="text-yellow-500 font-bold">you win immediately!</span>.
                            </td>
                            <td className="px-6 py-4">For a brief moment, <span
                                className="text-yellow-500 font-bold">all</span> circles are revealed to confirm the victory.
                            </td>
                        </tr>
                        <tr className="bg-[#0f142a]">
                            <td className="px-6 py-4 font-medium whitespace-nowrap">4. Next Turn</td>
                            <td className="px-6 py-4">If you missed, the board returns to hidden view. The next player takes their turn.</td>
                            <td className="px-6 py-4">The game continues until a player successfully hits an existing enemy soldier.</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-xl font-semibold text-emerald-400">Ready to Play?</h2>
                    <p className="opacity-80 text-center">
                        Create a room and share the link with a friend. P1/P2 roles are assigned automatically.
                    </p>
                    <button
                        onClick={createRoom}
                        className="px-5 py-2 rounded-sm bg-[#F59E0B] text-black font-medium shadow-[0_0_8px_#F59E0B] hover:bg-[#f6b23a] transition"
                    >
                        Create Room
                    </button>
                </div>
            </div>
        </div>
    );
}