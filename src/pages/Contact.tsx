import { useState, useMemo } from "react";
import type { FC, FormEvent, ChangeEvent, Dispatch, SetStateAction } from "react";
import { Github, Linkedin, Mail, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const Contact: FC = () => {
    // Email validation
    const isValidEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    // State
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [hp, setHp] = useState<string>(""); // honeypot
    const [sending, setSending] = useState<boolean>(false);

    // Optional live hints (not used to disable the button anymore)
    const isNameOk = useMemo(() => name.trim().length >= 2, [name]);
    const isEmailOk = useMemo(() => isValidEmail(email.trim()), [email]);
    const isMessageOk = useMemo(() => message.trim().length >= 10, [message]);

    // Input helper
    const handleInputChange =
        (setter: Dispatch<SetStateAction<string>>) =>
            (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setter(e.target.value);
            };

    // Submit
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const n = name.trim();
        const em = email.trim();
        const msg = message.trim();

        // Submit-time validation with toasts
        if (n.length < 2) {
            toast.error("Name must be at least 2 characters.", { id: "name-error" });
            return;
        }
        if (!isValidEmail(em)) {
            toast.error("Please enter a valid email address.", { id: "email-error" });
            return;
        }
        if (msg.length < 10) {
            toast.error("Message must be at least 10 characters.", { id: "message-error" });
            return;
        }

        try {
            setSending(true);

            const body = new URLSearchParams({
                name: n,
                email: em,
                message: msg,
                hp: hp || "",
            }).toString();

            const res = await fetch("https://bhetycodes.online/send.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body,
                mode: "cors",
                credentials: "omit",
            });

            const text = await res.text(); // server returns "OK" or an error message

            if (!res.ok) {
                throw new Error(text || `HTTP ${res.status}`);
            }

            toast.success("Thanks! Your message was sent successfully.", { id: "success" });

            // reset form
            setName("");
            setEmail("");
            setMessage("");
            setHp("");
        } catch (err: any) {
            console.error("Submission Error:", err);
            toast.error(err?.message || "Something went wrong while sending the message.", { id: "server-error" });
        } finally {
            setSending(false);
        }
    };

    // Styles
    const inputClasses =
        "w-full px-3 py-2 rounded-[3px] bg-slate-900/60 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500";
    const labelClasses = "block text-sm mb-1 text-neutral-300";

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <section className="max-w-4xl mx-auto px-6 py-16">
                <header className="mb-10 text-center">
                    <h1 className="text-xl sm:text-2xl font-bold mb-4 tracking-tight">Contact Me</h1>
                    <p className="mt-3 text-neutral-400">
                        Have a project or a question? Send me a message and I’ll get back to you.
                    </p>
                </header>

                <div className="rounded-[3px] border border-slate-800 shadow-lg p-6 md:p-10 bg-[#060911]">
                    <h2 className="text-xl font-semibold mb-6">Send a message</h2>

                    {/* noValidate to avoid native browser popups; we show toasts instead */}
                    <form className="space-y-5" onSubmit={onSubmit} noValidate>
                        {/* Honeypot (hidden) */}
                        <input
                            value={hp}
                            onChange={handleInputChange(setHp)}
                            type="text"
                            className="hidden"
                            autoComplete="off"
                            tabIndex={-1}
                            aria-hidden="true"
                        />

                        {/* Name */}
                        <div>
                            <label className={labelClasses} htmlFor="name">Name</label>
                            <input
                                id="name"
                                value={name}
                                onChange={handleInputChange(setName)}
                                type="text"
                                placeholder="Your name"
                                className={inputClasses}
                                minLength={2}
                                aria-invalid={name.length > 0 && !isNameOk}
                                onBlur={() => {
                                    if (name.trim().length > 0 && !isNameOk) {
                                        toast.error("Name must be at least 2 characters.");
                                    }
                                }}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className={labelClasses} htmlFor="email">Email</label>
                            <input
                                id="email"
                                value={email}
                                onChange={handleInputChange(setEmail)}
                                type="email"
                                placeholder="you@email.com"
                                className={inputClasses}
                                aria-invalid={email.length > 0 && !isEmailOk}
                                onBlur={() => {
                                    const em = email.trim();
                                    if (em.length > 0 && !isValidEmail(em)) {
                                        toast.error("Please enter a valid email address.");
                                    }
                                }}
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className={labelClasses} htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={handleInputChange(setMessage)}
                                rows={6}
                                placeholder="Tell me a bit about your project…"
                                className={inputClasses}
                                minLength={10}
                                aria-invalid={message.length > 0 && !isMessageOk}
                                onBlur={() => {
                                    const msg = message.trim();
                                    if (msg.length > 0 && msg.length < 10) {
                                        toast.error("Message must be at least 10 characters.");
                                    }
                                }}
                            />
                            <div className="mt-1 text-xs text-neutral-500">
                                {message.trim().length}/10 minimum
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={sending} // only disabled while sending
                                className="w-full md:w-auto px-6 py-3 rounded-[3px] font-semibold shadow-md transition-colors
                           bg-[#F59E0B] text-black shadow-[0_0_15px_#F59E0B]
                           hover:bg-amber-600 hover:shadow-[0_0_10px_#F59E0B]
                           disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {sending ? (
                                    <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </span>
                                ) : (
                                    "Send Message"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Social links */}
                <div className="mt-12 text-center md:text-left">
                    <h2 className="text-lg font-semibold mb-4 border-b border-neutral-700/50 pb-2 inline-block">
                        Or reach me directly:
                    </h2>
                    <div className="flex justify-center md:justify-start gap-6 text-slate-400 mt-4">
                        <a
                            href="https://www.linkedin.com/in/bhety-penetzdorfer/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-amber-400 transition"
                        >
                            <Linkedin className="w-7 h-7" />
                        </a>
                        <a
                            href="https://github.com/bhetypen"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-amber-400 transition"
                        >
                            <Github className="w-7 h-7" />
                        </a>
                        <a
                            href="mailto:info@bhetyportfolio.com"
                            className="hover:text-amber-400 transition"
                        >
                            <Mail className="w-7 h-7" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
