export const QUIZ_Q = [
    { t: "What were your marks in Intermediate/10th?", o: ["90%+ (Very good)", "75–90% (Good)", "60–75% (Average)", "Below 60%"] },
    { t: "What do you want to do in future?", o: ["Become an Engineer (EAMCET/JEE)", "Become a Doctor (NEET)", "Get quick job — Diploma/ITI", "Learn IT skills, no degree needed"] },
    { t: "Which stream are you in?", o: ["MPC (Maths, Physics, Chemistry)", "BiPC (Biology, Physics, Chemistry)", "CEC / Commerce", "Other / Not sure"] },
    { t: "What is your family financial situation?", o: ["Need a job fast — family support urgent", "Can study 3-4 yrs — family can wait", "Want only a Govt/stable job", "Want to freelance or start own business"] },
    { t: "How is your English speaking confidence?", o: ["Good — I speak confidently", "Basic — I can improve", "Still improving", "Still learning"] }
];

export const RESULTS = {
    eamcet: { p: "🎓 EAMCET → Engineering", t: "Engineering is your path!", d: "Your marks + interest → EAMCET best choice.", b: ["EAMCET 2025 prep — 6 months enough", "Maths + Physics strong chesuko", "70+ engineering colleges available", "B.Tech tarvata TCS/Infosys/Wipro"], s: "₹3.5L – ₹8L/yr starting" },
    diploma: { p: "🔧 Diploma → Quick Job", t: "Diploma is the smart move!", d: "Fast job kavali ante Diploma best. 3 years lo industry-ready.", b: ["Polytechnic entrance prepare", "Mechanical/Electrical/Civil — choose", "3 years + direct job", "Lateral entry B.Tech possible later"], s: "₹1.8L – ₹4L/yr starting" },
    it: { p: "💻 IT Skills → Job Without Degree", t: "Learn skills, skip the degree!", d: "Python, Web Dev nerchukoni 6 months lo job.", b: ["Python or Web Dev (free YouTube)", "Build 2-3 projects", "Internship apply", "Remote jobs possible"], s: "₹1.5L – ₹5L/yr starting" },
    neet: { p: "🏥 NEET → Medical", t: "Medicine is calling you!", d: "BiPC student — NEET try cheyyadam best.", b: ["NEET: Biology, Chem, Physics", "Coaching helpful", "BAMS/BDS alternatives", "Internship + registration"], s: "₹4L – ₹15L/yr after internship" },
    appsc: { p: "🏛️ APPSC → Govt Job", t: "Stable Govt Job is your path!", d: "Stable income kavali ante APPSC/TSPSC best option.", b: ["Regional language + English grammar strong", "State GK — history & geography", "Daily current affairs", "Mock tests daily 50 Qs"], s: "₹25K – ₹60K/month" }
};
