import { Linkedin, Github, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-black text-slate-400 border-t border-white/10">
            <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between text-sm">
                {/* Left side */}
                <div className="flex items-center gap-2">
                    <span>© {new Date().getFullYear()} bhetyportfolio.com</span>
                    <span className="text-slate-600">|</span>
                    <Link to="/privacy" className="hover:text-white transition">
                        privacy
                    </Link>
                </div>

                {/* Right side (socials) */}
                <div className="flex items-center gap-4 text-slate-400">
                    <a
                        href="https://www.linkedin.com/in/bhety-penetzdorfer/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                        href="https://github.com/bhetypen"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                    <a
                        href="mailto:bhety.tech@gmail.com"
                        className="hover:text-white transition"
                    >
                        <Mail className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
