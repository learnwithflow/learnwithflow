export function shuffleArr(arr) {
    const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a;
}

export const CHAPTERS = {
    eamcet: [
        "Physics — Mechanics", "Physics — Waves & Sound", "Physics — Optics", "Physics — Thermodynamics", "Physics — Electromagnetism",
        "Chemistry — Atomic Structure", "Chemistry — Organic Chemistry", "Chemistry — Physical Chemistry", "Chemistry — Inorganic Chemistry",
        "Maths — Algebra", "Maths — Calculus", "Maths — Integration", "Maths — Trigonometry", "Maths — Coordinate Geometry", "Maths — Vectors"
    ],
    it: [
        "Python Basics", "Data Types & Variables", "Control Flow", "Functions & Modules", "OOP Concepts",
        "SQL Basics", "Advanced SQL", "Relational Databases",
        "HTML & CSS", "JavaScript Basics", "React Foundation",
        "Data Structures — Arrays & Linked Lists", "Data Structures — Trees & Graphs",
        "Algorithm — Sorting & Searching", "Algorithm — Dynamic Programming",
        "Git & Version Control", "Computer Networks", "Operating Systems"
    ],
    diploma: [
        "Electrical Fundamentals", "DC Circuits", "Transformers", "AC Machines", "Power Systems",
        "Engineering Materials", "Fluid Mechanics", "Thermodynamics Basics",
        "Workshop Safety", "AutoCAD Basics", "Engineering Drawing", "Manufacturing Processes"
    ],
    neet: [
        "Cell Biology", "Genetics & Heredity", "Human Digestive System", "Respiration", "Human Circulation", "Neural Control",
        "Plant Physiology", "Ecology & Environment", "Biotechnology",
        "Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"
    ],
    appsc: [
        "Indian History", "Andhra Pradesh History",
        "Indian Geography", "AP Geography",
        "Indian Polity", "AP Economy",
        "General Science", "Current Affairs (National)", "Current Affairs (Regional)",
        "Maths — Arithmetic", "Logical Reasoning", "Data Interpretation"
    ]
};

export const QBANKS_RAW = {
    eamcet: [
        { s: "Physics", b: "A body thrown vertically upward with velocity u. Max height:", o: ["u/g", "u²/2g", "u²/g", "2u²/g"], a: 1 },
        { s: "Physics", b: "Newton's 3rd Law states:", o: ["F=ma", "Every action has equal & opposite reaction", "Objects at rest stay at rest", "Energy is conserved"], a: 1 },
        { s: "Physics", b: "Unit of electric field:", o: ["N/C", "C/N", "J/C", "V·m"], a: 0 },
        { s: "Chemistry", b: "Noble gas example:", o: ["Nitrogen", "Oxygen", "Argon", "Chlorine"], a: 2 },
        { s: "Chemistry", b: "pH of neutral solution:", o: ["0", "7", "14", "1"], a: 1 },
        { s: "Chemistry", b: "Bond in NaCl:", o: ["Covalent", "Ionic", "Metallic", "Hydrogen"], a: 1 },
        { s: "Mathematics", b: "sin θ = 3/5, cos θ =", o: ["4/5", "5/4", "3/4", "5/3"], a: 0 },
        { s: "Mathematics", b: "Derivative of sin(x):", o: ["-cos(x)", "cos(x)", "-sin(x)", "tan(x)"], a: 1 },
        { s: "Mathematics", b: "Sum of first n natural numbers:", o: ["n(n+1)", "n(n-1)/2", "n(n+1)/2", "n²"], a: 2 },
        { s: "Physics", b: "Speed of light in vacuum:", o: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], a: 0 },
        { s: "Physics", b: "Unit of power is:", o: ["Joule", "Watt", "Newton", "Pascal"], a: 1 },
        { s: "Chemistry", b: "Formula for Sulfuric Acid:", o: ["HCl", "H2SO4", "HNO3", "H2O"], a: 1 },
        { s: "Mathematics", b: "Integral of x:", o: ["x", "1", "x^2 / 2", "0"], a: 2 },
        { s: "Physics", b: "Resistance in parallel formula:", o: ["R1+R2", "R1-R2", "1/R1 + 1/R2 = 1/R", "R1*R2"], a: 2 },
        { s: "Chemistry", b: "Most abundant gas in atmosphere:", o: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"], a: 1 }
    ],
    it: [
        { s: "Programming", b: "CPU stands for:", o: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Control Processing Unit"], a: 0 },
        { s: "Programming", b: "LIFO data structure:", o: ["Queue", "Stack", "Array", "Linked List"], a: 1 },
        { s: "Programming", b: "print(2**3) in Python:", o: ["6", "8", "9", "5"], a: 1 },
        { s: "Programming", b: "Binary search complexity:", o: ["O(n)", "O(n²)", "O(log n)", "O(1)"], a: 2 },
        { s: "Networking", b: "HTTP stands for:", o: ["Hyper Text Transfer Protocol", "High Tech Transfer Protocol", "Hyper Tech Text Protocol", "Hyper Transfer Text Protocol"], a: 0 },
        { s: "Database", b: "SQL stands for:", o: ["Structured Query Language", "Simple Query Language", "System Query Language", "Standard Query Logic"], a: 0 },
        { s: "Programming", b: "Python function keyword:", o: ["function", "define", "def", "func"], a: 2 },
        { s: "Programming", b: "OOP stands for:", o: ["Object Oriented Programming", "Open Online Platform", "Object Operating Program", "Ordered Operations Protocol"], a: 0 },
        { s: "Networking", b: "DNS converts:", o: ["IP to MAC", "Domain names to IP", "Data to binary", "HTTP to HTTPS"], a: 1 },
        { s: "Programming", b: "Git is used for:", o: ["Database management", "Version control", "Web hosting", "Email services"], a: 1 },
        { s: "Programming", b: "Time complexity of bubble sort:", o: ["O(n)", "O(log n)", "O(n²)", "O(1)"], a: 2 },
        { s: "Database", b: "SQL command to get all columns:", o: ["SELECT EVERY", "SELECT *", "GET ALL", "FETCH *"], a: 1 },
        { s: "Programming", b: "What is JS NaN?", o: ["Not a Null", "Not a Number", "Now a Number", "New array Notation"], a: 1 },
        { s: "Networking", b: "Port for HTTPS:", o: ["80", "21", "22", "443"], a: 3 },
        { s: "Programming", b: "Java runs on:", o: ["V8 Engine", "JRE/JVM", ".NET Framework", "LLVM"], a: 1 }
    ],
    diploma: [
        { s: "Engineering", b: "Highest thermal conductivity:", o: ["Steel", "Aluminum", "Copper", "Iron"], a: 2 },
        { s: "Engineering", b: "DC motor converts:", o: ["Mechanical to electrical", "Electrical to mechanical", "Chemical to electrical", "Thermal to mechanical"], a: 1 },
        { s: "Engineering", b: "Pascal is unit of:", o: ["Force", "Pressure", "Energy", "Torque"], a: 1 },
        { s: "Engineering", b: "Series circuit current:", o: ["Different", "Same", "Zero", "Variable"], a: 1 },
        { s: "Engineering", b: "Transformer principle:", o: ["Magnetic resonance", "Electromagnetic induction", "Electrostatic induction", "Piezoelectric effect"], a: 1 },
        { s: "Engineering", b: "Electrical power unit:", o: ["Volt", "Ampere", "Watt", "Ohm"], a: 2 },
        { s: "Engineering", b: "IC chips made from:", o: ["Copper", "Iron", "Silicon", "Aluminum"], a: 2 },
        { s: "Engineering", b: "CAD stands for:", o: ["Computer Aided Design", "Computer Automated Drawing", "Central Auto Design", "Computer Applied Drafting"], a: 0 },
        { s: "Engineering", b: "Unit of capacitance:", o: ["Farad", "Henry", "Ohm", "Weber"], a: 0 },
        { s: "Engineering", b: "Kirchhoff's Current Law is based on conservation of:", o: ["Energy", "Charge", "Momentum", "Mass"], a: 1 }
    ],
    neet: [
        { s: "Biology", b: "Powerhouse of cell:", o: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"], a: 1 },
        { s: "Biology", b: "Photosynthesis occurs in:", o: ["Mitochondria", "Nucleus", "Chloroplast", "Ribosome"], a: 2 },
        { s: "Biology", b: "Normal body temp:", o: ["32°C", "37°C", "42°C", "28°C"], a: 1 },
        { s: "Chemistry", b: "pH of blood:", o: ["6.4", "7.4", "8.4", "5.4"], a: 1 },
        { s: "Biology", b: "Insulin secreted by:", o: ["Liver", "Kidney", "Pancreas", "Thyroid"], a: 2 },
        { s: "Biology", b: "Universal donor blood group:", o: ["A", "B", "AB", "O"], a: 3 },
        { s: "Biology", b: "Largest human organ:", o: ["Heart", "Liver", "Lungs", "Skin"], a: 3 },
        { s: "Chemistry", b: "Sunlight vitamin:", o: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], a: 3 },
        { s: "Biology", b: "Number of bones in human body:", o: ["200", "206", "212", "198"], a: 1 },
        { s: "Biology", b: "Which gas do plants absorb during photosynthesis?", o: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], a: 2 }
    ],
    appsc: [
        { s: "General Knowledge", b: "Capital of AP:", o: ["Hyderabad", "Visakhapatnam", "Amaravati", "Tirupati"], a: 2 },
        { s: "History", b: "AP bifurcation year:", o: ["2012", "2013", "2014", "2015"], a: 2 },
        { s: "General Knowledge", b: "National bird of India:", o: ["Sparrow", "Peacock", "Parrot", "Eagle"], a: 1 },
        { s: "Maths", b: "15% of number is 75, number is:", o: ["500", "450", "600", "550"], a: 0 },
        { s: "Maths", b: "Train 360km in 4hrs, speed:", o: ["90 km/h", "80 km/h", "100 km/h", "85 km/h"], a: 0 },
        { s: "History", b: "India independence year:", o: ["1945", "1946", "1947", "1948"], a: 2 },
        { s: "Reasoning", b: "Series: 2, 4, 8, 16, ___", o: ["18", "32", "24", "20"], a: 1 },
        { s: "General Knowledge", b: "Currency of Japan:", o: ["Yuan", "Won", "Yen", "Rupee"], a: 2 },
        { s: "Indian Polity", b: "Who is the first citizen of India?", o: ["Prime Minister", "Chief Justice", "President", "Vice President"], a: 2 },
        { s: "General Knowledge", b: "Longest river in India:", o: ["Brahmaputra", "Godavari", "Ganga", "Yamuna"], a: 2 }
    ]
};
