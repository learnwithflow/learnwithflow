'use client';

export default function About({ showPage }) {
    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center px-6 py-24 md:py-32 font-sans text-slate-800">
            <div className="w-full max-w-3xl bg-white p-10 md:p-16 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>About Us</h1>
                    <div className="h-1 w-12 bg-slate-900 mt-6 rounded-full"></div>
                </div>

                <div className="space-y-8 text-lg font-medium leading-relaxed text-slate-600">
                    <p>
                        Welcome to <span className="font-bold text-slate-900">learnwithflow</span>, your ultimate platform for career growth and learning.
                        We believe in empowering individuals with the right tools, roadmaps, and resources to navigate their professional journeys effectively.
                    </p>

                    <div>
                        <h2 className="text-2xl font-bold mb-3 text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Mission</h2>
                        <p>
                            Our mission is to bridge the gap between education and industry requirements. We aim to provide clear, actionable
                            learning paths and intelligent interview preparation tools that help landing your dream job within reach.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What We Offer</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="text-slate-400 mr-3 mt-1">•</span>
                                <span><strong className="text-slate-800">Comprehensive Roadmaps:</strong> Step-by-step guides for various tech and non-tech career paths.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-slate-400 mr-3 mt-1">•</span>
                                <span><strong className="text-slate-800">AI Interview Practice:</strong> Mock interviews powered by AI to help you build confidence and improve your skills.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-slate-400 mr-3 mt-1">•</span>
                                <span><strong className="text-slate-800">Career Quizzes:</strong> Discover the best career paths aligned with your interests and strengths.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-slate-400 mr-3 mt-1">•</span>
                                <span><strong className="text-slate-800">Mock Exams:</strong> Prepare for certifications and assessments with our realistic mock exams.</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-3 text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Join Our Community</h2>
                        <p>
                            Whether you are just starting out or looking to make a career switch, learnwithflow is here to support you at every step.
                            Let&apos;s learn, grow, and achieve our goals together.
                        </p>
                    </div>
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
