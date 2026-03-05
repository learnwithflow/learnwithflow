'use client';

export default function Terms({ showPage }) {
    return (
        <div className="min-h-screen bg-[#f5f2eb] px-6 py-24 md:py-32 font-sans text-[#2c2520]">
            <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-[#e2ddd4] shadow-sm">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Terms and Conditions</h1>

                <div className="space-y-6 text-lg leading-relaxed text-[#3d3830]">
                    <p className="text-sm text-[#8b8278]">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <p>
                        Welcome to learnwithflow. By accessing or using our website and services, you agree to be bound by these
                        Terms and Conditions. Please read them carefully.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-[#1c1814]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>1. Use of the Platform</h2>
                    <p>
                        You must be at least 13 years old to use this platform. You agree to use the platform only for lawful purposes
                        and in a way that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the platform.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-[#1c1814]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>2. Intellectual Property</h2>
                    <p>
                        All content, features, and functionality on this platform—including text, graphics, logos, icons, and images—are
                        the exclusive property of learnwithflow and are protected by international copyright and intellectual property laws.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-[#1c1814]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>3. User Accounts</h2>
                    <p>
                        When creating an account, you must provide accurate and complete information. You are solely responsible for
                        maintaining the confidentiality of your account and password and for restricting access to your computer.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-[#1c1814]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>4. Limitation of Liability</h2>
                    <p>
                        learnwithflow provides educational content and resources for informational purposes only. We do not guarantee
                        that the use of our platform will result in employment or a specific career outcome. In no event shall we be liable
                        for any indirect, incidental, or consequential damages arising out of your use of the platform.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4 text-[#1c1814]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>5. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these Terms at any time. We will indicate at the top of this page the date the terms
                        were last revised. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms.
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
