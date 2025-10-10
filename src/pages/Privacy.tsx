export default function Privacy() {
    return (
        <div className="bg-black min-h-screen text-white">
            <section className="max-w-3xl mx-auto px-4 py-14">
                <h1 className="text-3xl font-bold mb-4">Privacy</h1>
                <p className="text-slate-300">
                    Thanks for stopping by. I take privacy seriously and I keep this site simple on purpose.
                </p>

                <div className="mt-10 space-y-8 text-slate-300">
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-2">No cookies, no trackers</h2>
                        <p>
                            I don’t use analytics, ad pixels, fingerprinting, or any form of tracking cookies.
                            You can browse freely—nothing here follows you around the web.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white mb-2">What I do collect</h2>
                        <p>
                            Only what you choose to share with me—like your name, email, and message if you
                            contact me. If you email me directly, I’ll obviously see your email address and
                            whatever’s in your message (that’s how email works).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white mb-2">How I use your info</h2>
                        <p>
                            I use it to reply, follow up, or keep the conversation going. That’s it. I don’t sell
                            it, rent it, or trade it. If we stop working together and you’d like me to delete our
                            messages or files, just ask.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white mb-2">Storage & security</h2>
                        <p>
                            Any messages or files you send may live in my email inbox or project notes.
                            I try to keep things tidy and secured, but please avoid sending sensitive personal
                            information unless we’ve agreed on a safe way to handle it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white mb-2">Third-party links</h2>
                        <p>
                            My site may link to other websites (GitHub, LinkedIn, demos, etc.). I don’t control
                            those sites, so their privacy practices apply once you leave here.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white mb-2">Changes</h2>
                        <p>
                            If I ever change how this site handles data, I’ll update this page and keep it clear
                            and human. No legalese if I can help it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
                        <p>
                            Questions about privacy? Email me at{" "}
                            <a
                                className="underline underline-offset-4 hover:text-white"
                                href="mailto:your@email.com"
                            >
                                your@email.com
                            </a>
                            .
                        </p>
                    </section>

                    <p className="text-xs text-slate-500 pt-4">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </section>
        </div>
    );
}
