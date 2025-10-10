import {useState, useMemo} from "react";
import type {FC, FormEvent, ChangeEvent, Dispatch, SetStateAction} from "react";
import {Github, Linkedin, Mail, Loader2} from "lucide-react";

// Define the component type explicitly as a Functional Component (FC)
const Contact: FC = () => {
    // Email validation utility function
    const isValidEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    // 1. State Management (Explicitly typed)
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [hp, setHp] = useState<string>(''); // Honeypot field
    const [sending, setSending] = useState<boolean>(false);
    const [sent, setSent] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 2. Computed Property (Mimicking Vue's computed property using useMemo)
    const canSubmit = useMemo((): boolean =>
            name.trim().length >= 2 &&
            isValidEmail(email.trim()) &&
            message.trim().length >= 10
        , [name, email, message]);

    // 3. Submission Handler (Explicitly typing the form event)
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setError(null);
        setSent(false);

        if (!canSubmit) {
            setError('Please fill all fields correctly.');
            return;
        }

        try {
            setSending(true);

            // Using URLSearchParams to correctly format form data for PHP endpoint
            const body = new URLSearchParams({
                name: name,
                email: email,
                message: message,
                hp: hp || '' // Pass honeypot value
            }).toString();

            const res = await fetch('https://bhetycodes.online/send.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: body,
                mode: 'cors',
                credentials: 'omit'
            });

            const text = await res.text();

            if (!res.ok) {
                throw new Error(text || `HTTP ${res.status}`);
            }

            // Success: clear form and show success message
            setSent(true);
            setName('');
            setEmail('');
            setMessage('');
            setHp('');

        } catch (e: any) { // Using 'any' for handling dynamic error types
            console.error("Submission Error:", e);
            setError(e?.message || 'Something went wrong while sending the message.');
        } finally {
            setSending(false);
        }
    };

    // --- Updated Styles to use Amber/Yellow Color Palette ---
    const inputClasses: string = "w-full px-3 py-2 rounded-[3px] bg-slate-900/60 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500";
    const labelClasses: string = "block text-sm mb-1 text-neutral-300";

    // Helper function for change event typing
    const handleInputChange = (setter: Dispatch<SetStateAction<string>>) =>
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setter(e.target.value);
        };

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

                    <form className="space-y-5" onSubmit={onSubmit}>
                        {/* Honeypot */}
                        <input
                            value={hp}
                            onChange={handleInputChange(setHp)}
                            type="text"
                            className="hidden"
                            autoComplete="off"
                            tabIndex={-1} // Ensure no tab focus
                            aria-hidden="true"
                        />

                        {/* Name */}
                        <div>
                            <label className={labelClasses}>Name</label>
                            <input
                                value={name}
                                onChange={handleInputChange(setName)}
                                type="text"
                                required
                                placeholder="Your name"
                                className={inputClasses}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className={labelClasses}>Email</label>
                            <input
                                value={email}
                                onChange={handleInputChange(setEmail)}
                                type="email"
                                required
                                placeholder="you@email.com"
                                className={inputClasses}
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className={labelClasses}>Message</label>
                            <textarea
                                value={message}
                                onChange={handleInputChange(setMessage)}
                                rows={6}
                                required
                                placeholder="Tell me a bit about your project…"
                                className={inputClasses}
                            />
                        </div>

                        {/* Alerts */}
                        {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
                        {sent && <p className="text-sm text-green-400 font-medium">Thanks! Your message was sent
                            successfully.</p>}

                        {/* Actions */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={!canSubmit || sending}
                                className="w-full md:w-auto px-6 py-3 rounded-[3px] font-semibold shadow-md transition-colors
                                             bg-[#F59E0B] text-black shadow-[0_0_15px_#F59E0B]
                                             hover:bg-amber-600 hover:shadow-[0_0_10px_#F59E0B]"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin"/>
                                        Sending…
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Social links */}
                <div className="mt-12 text-center md:text-left">
                    <h2 className="text-lg font-semibold mb-4 border-b border-neutral-700/50 pb-2 inline-block">Or reach
                        me directly:</h2>
                    <div className="flex justify-center md:justify-start gap-6 text-slate-400 mt-4">
                        <a
                            href="https://www.linkedin.com/in/bhety-penetzdorfer/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-amber-400 transition"
                        >
                            <Linkedin className="w-7 h-7"/>
                        </a>
                        <a
                            href="https://github.com/bhetypen"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-amber-400 transition"
                        >
                            <Github className="w-7 h-7"/>
                        </a>
                        <a
                            href="mailto:info@bhetyportfolio.com"
                            className="hover:text-amber-400 transition"
                        >
                            <Mail className="w-7 h-7"/>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
