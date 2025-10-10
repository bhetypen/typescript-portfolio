import * as React from "react";

// Section wrapper with consistent max-width and padding
export function SquareSection({
                                  children,
                                  className = "",
                              }: { children: React.ReactNode; className?: string }) {
    return <section className={`max-w-5xl mx-auto px-4 ${className}`}>{children}</section>;
}

// Card wrapper that matches the square design in BackgroundTabs
export function SquareCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full rounded-sm border border-white/12 bg-slate-900/40 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            {children}
        </div>
    );
}
