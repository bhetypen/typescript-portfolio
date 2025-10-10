import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const ACCENT = "#F59E0B"; // orange accent

export default function Navbar() {
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);

    const navItems = [
        { label: "home", to: "/" },
        { label: "projects", to: "/projects" },
        { label: "games", to: "/games" },
        { label: "tools", to: "/tools" },
        { label: "contact", to: "/contact" },
    ];

    const linkBase =
        "block w-full text-center md:w-auto capitalize px-4 py-2 rounded-md transition-colors";
    const hoverFx = "hover:text-white";
    const activeFx = "text-white font-medium";

    return (
        <nav className="w-full bg-black text-slate-300 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4">
                {/* Top row: just menu + hamburger */}
                <div className="h-14 flex items-center justify-center">
                    {/* Hamburger (mobile only) */}
                    <button
                        className="md:hidden absolute left-4 inline-flex items-center justify-center p-2 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
                        aria-label="Toggle menu"
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                    >
                        <svg
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            {open ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M3 6h18M3 12h18M3 18h18" />
                            )}
                        </svg>
                    </button>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.to;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={[
                                        linkBase,
                                        isActive ? activeFx : hoverFx,
                                    ].join(" ")}
                                    style={{ "--accent": ACCENT } as React.CSSProperties}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile menu (collapsible) */}
                <div
                    className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
                        open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                    style={{ "--accent": ACCENT } as React.CSSProperties}
                >
                    <div className="pb-3 flex flex-col items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.to;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setOpen(false)}
                                    className={[
                                        linkBase,
                                        isActive ? activeFx : hoverFx,
                                    ].join(" ")}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
