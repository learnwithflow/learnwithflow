'use client';

export default function Terms({ showPage }) {
    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center px-6 py-24 md:py-32 font-sans text-slate-800">
            <div className="w-full max-w-3xl bg-white p-10 md:p-16 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Terms and Conditions</h1>
                    <p className="text-sm font-medium text-slate-400">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <div className="h-1 w-12 bg-slate-900 mt-6 rounded-full"></div>
                </div>

                <div className="space-y-8 text-[17px] font-medium leading-relaxed text-slate-600">
                    <p>
                        Welcome to learnwithflow. By accessing or using our website and services, you agree to be bound by these
                        Terms and Conditions. Please read them carefully.
                    </p>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>1. Use of the Platform</h2>
                        <p>
                            You must be at least 13 years old to use this platform. You agree to use the platform only for lawful purposes
                            and in a way that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>2. Intellectual Property</h2>
                        <p>
                            All content, features, and functionality on this platform—including text, graphics, logos, icons, and images—are
                            the exclusive property of learnwithflow and are protected by international copyright and intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>3. User Accounts</h2>
                        <p>
                            When creating an account, you must provide accurate and complete information. You are solely responsible for
                            maintaining the confidentiality of your account and password and for restricting access to your computer.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>4. Limitation of Liability</h2>
                        <p>
                            learnwithflow provides educational content and resources for informational purposes only. We do not guarantee
                            that the use of our platform will result in employment or a specific career outcome. In no event shall we be liable
                            for any indirect, incidental, or consequential damages arising out of your use of the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>5. AI-Generated Content</h2>
                        <p>
                            Certain content on our platform — including but not limited to practice questions, quiz options, explanations,
                            interview questions, roadmap suggestions, and exam feedback — is generated using artificial intelligence (AI) models.
                            This AI-generated content is provided for educational and practice purposes only.
                        </p>
                        <br />
                        <p>
                            AI-generated content may contain inaccuracies, errors, or outdated information. learnwithflow does not
                            guarantee the accuracy, completeness, or reliability of any AI-generated content. Users are advised to
                            independently verify important information before relying on it for academic, professional, or other critical purposes.
                        </p>
                        <br />
                        <p>
                            Our platform does <strong className="text-slate-800">not</strong> claim to provide or reproduce official question papers from
                            any examination board, government authority, or regulatory body. All practice questions are original,
                            AI-assisted content designed for learning and skill-building.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>6. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. We will indicate at the top of this page the date the terms
                            were last revised. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms.
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-100 flex justify-start">
                    <button
                        onClick={() => showPage('home')}
                        className="group flex items-center gap-2 px-6 py-3 bg-white text-slate-800 font-bold rounded-full shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        <span className="text-slate-400 group-hover:-translate-x-1 transition-transform">←</span>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
