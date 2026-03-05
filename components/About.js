'use client';

export default function About({ showPage }) {
    return (
        <div className="min-h-screen bg-[#f5f2eb] px-6 py-24 md:py-32 font-sans text-[#2c2520]">
            <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-[#e2ddd4] shadow-sm">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>About Us</h1>
                
                <div className="space-y-6 text-lg leading-relaxed text-[#3d3830]">
                    <p>
                        Welcome to <span className="font-bold text-[#2563a8]">learnwithflow</span>, your ultimate platform for career growth and learning. 
                        We believe in empowering individuals with the right tools, roadmaps, and resources to navigate their professional journeys effectively.
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4 text-[#1c1814]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Mission</h2>
                    <p>
                        Our mission is to bridge the gap between education and industry requirements. We aim to provide clear, actionable 
                        learning paths and intelligent interview preparation tools that help landing your dream job within reach.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-[#1c1814]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What We Offer</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Comprehensive Roadmaps:</strong> Step-by-step guides for various tech and non-tech career paths.</li>
                        <li><strong>AI Interview Practice:</strong> Mock interviews powered by AI to help you build confidence and improve your skills.</li>
                        <li><strong>Career Quizzes:</strong> Discover the best career paths aligned with your interests and strengths.</li>
                        <li><strong>Mock Exams:</strong> Prepare for certifications and assessments with our realistic mock exams.</li>
                    </ul>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4 text-[#1c1814]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Join Our Community</h2>
                    <p>
                        Whether you are just starting out or looking to make a career switch, learnwithflow is here to support you at every step. 
                        Let's learn, grow, and achieve our goals together.
                    </p>
                </div>
                
                <div className="mt-12 flex justify-center">
                    <button 
                        onClick={() => showPage('home')}
                        className="px-6 py-3 bg-[#1c1814] text-white font-bold rounded-xl hover:bg-[#3d3830] transition-colors"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
