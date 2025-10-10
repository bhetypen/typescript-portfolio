import { Link, useLocation } from "react-router-dom";

const ACCENT = "#F59E0B"; // your orange accent

export default function Navbar() {
    const { pathname } = useLocation();

    const navItems = [
        { label: "home", to: "/" },
        { label: "projects", to: "/projects" },
        { label: "games", to: "/games" },
        { label: "tools", to: "/tools" },
        { label: "contact", to: "/contact" },
    ];

    return (
        <nav className="w-full bg-black text-slate-300">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-center gap-10 text-sm">
                {navItems.map((item) => {
                    const isActive = pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={[
                                "capitalize transition-colors relative",
                                isActive ? "text-white font-medium" : "hover:text-white",
                                "px-4 py-2",
                                "hover:shadow-[0_0_8px_var(--accent)]",
                            ].join(" ")}
                            style={{ "--accent": ACCENT } as React.CSSProperties}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
