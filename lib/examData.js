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
        { s: "Physics", b: "A body thrown vertically upward with velocity u. Max height:", o: ["u/g", "u²/2g", "u²/g", "2u²/g"], a: 1, e: "Using equation of motion v² = u² - 2gh (v=0 at max height), h = u²/2g" },
        { s: "Physics", b: "Newton's 3rd Law states:", o: ["F=ma", "Every action has equal & opposite reaction", "Objects at rest stay at rest", "Energy is conserved"], a: 1, e: "Newton's 3rd Law is about action and reaction forces being equal and opposite." },
        { s: "Physics", b: "Unit of electric field:", o: ["N/C", "C/N", "J/C", "V·m"], a: 0, e: "Electric field is defined as Force per unit charge (E = F/q), so Newton/Coulomb." },
        { s: "Chemistry", b: "Noble gas example:", o: ["Nitrogen", "Oxygen", "Argon", "Chlorine"], a: 2, e: "Argon is a chemically inert Group 18 element, making it a noble gas." },
        { s: "Chemistry", b: "pH of neutral solution:", o: ["0", "7", "14", "1"], a: 1, e: "On the pH scale of 0 to 14, 7 represents a perfectly neutral solution (like pure water)." },
        { s: "Chemistry", b: "Bond in NaCl:", o: ["Covalent", "Ionic", "Metallic", "Hydrogen"], a: 1, e: "Na transfers an electron to Cl, creating positive and negative ions that attract each other (Ionic Bond)." },
        { s: "Mathematics", b: "sin θ = 3/5, cos θ =", o: ["4/5", "5/4", "3/4", "5/3"], a: 0, e: "Using the Pythagorean identity sin²θ + cos²θ = 1. So, cosθ = √(1 - (3/5)²) = 4/5." },
        { s: "Mathematics", b: "Derivative of sin(x):", o: ["-cos(x)", "cos(x)", "-sin(x)", "tan(x)"], a: 1, e: "The standard derivative of sin(x) is cos(x)." },
        { s: "Mathematics", b: "Sum of first n natural numbers:", o: ["n(n+1)", "n(n-1)/2", "n(n+1)/2", "n²"], a: 2, e: "The arithmetic progression sum formula for the first n natural numbers is n(n+1)/2." },
        { s: "Physics", b: "Speed of light in vacuum:", o: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], a: 0, e: "The speed of light in a vacuum (c) is exactly 299,792,458 m/s, usually approximated as 3×10⁸ m/s." },
        { s: "Physics", b: "Unit of power is:", o: ["Joule", "Watt", "Newton", "Pascal"], a: 1, e: "Power is the rate of doing work, measured in Joules per second, which is equivalent to Watts." },
        { s: "Chemistry", b: "Formula for Sulfuric Acid:", o: ["HCl", "H2SO4", "HNO3", "H2O"], a: 1, e: "Sulfuric acid formula is H₂SO₄, composed of hydrogen, sulfur, and oxygen." },
        { s: "Mathematics", b: "Integral of x:", o: ["x", "1", "x^2 / 2", "0"], a: 2, e: "Using the power rule for integration ∫x^n dx = (x^(n+1))/(n+1). For n=1, it is x²/2." },
        { s: "Physics", b: "Resistance in parallel formula:", o: ["R1+R2", "R1-R2", "1/R1 + 1/R2 = 1/R", "R1*R2"], a: 2, e: "In a parallel circuit, the reciprocal of total resistance equals the sum of the reciprocals of individual resistances." },
        { s: "Chemistry", b: "Most abundant gas in atmosphere:", o: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"], a: 1, e: "Nitrogen makes up approximately 78% of the Earth's atmosphere." }
    ],
    it: [
        { s: "Programming", b: "CPU stands for:", o: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Control Processing Unit"], a: 0, e: "CPU stands for Central Processing Unit, acting as the brain of the computer." },
        { s: "Programming", b: "LIFO data structure:", o: ["Queue", "Stack", "Array", "Linked List"], a: 1, e: "Stack follows Last-In-First-Out (LIFO), where the last added element is the first to be removed." },
        { s: "Programming", b: "print(2**3) in Python:", o: ["6", "8", "9", "5"], a: 1, e: "The ** operator in Python stands for exponentiation. 2 to the power of 3 is 8." },
        { s: "Programming", b: "Binary search complexity:", o: ["O(n)", "O(n²)", "O(log n)", "O(1)"], a: 2, e: "Binary search halves the search space at each step, resulting in logarithmic O(log n) time complexity." },
        { s: "Networking", b: "HTTP stands for:", o: ["Hyper Text Transfer Protocol", "High Tech Transfer Protocol", "Hyper Tech Text Protocol", "Hyper Transfer Text Protocol"], a: 0, e: "HTTP (Hyper Text Transfer Protocol) is the foundation of data communication for the World Wide Web." },
        { s: "Database", b: "SQL stands for:", o: ["Structured Query Language", "Simple Query Language", "System Query Language", "Standard Query Logic"], a: 0, e: "SQL is a standardized programming language that is used to manage relational databases." },
        { s: "Programming", b: "Python function keyword:", o: ["function", "define", "def", "func"], a: 2, e: "Python uses the 'def' keyword to define a block of code as a function." },
        { s: "Programming", b: "OOP stands for:", o: ["Object Oriented Programming", "Open Online Platform", "Object Operating Program", "Ordered Operations Protocol"], a: 0, e: "Object Oriented Programming (OOP) organizes software design around data, or objects, rather than functions and logic." },
        { s: "Networking", b: "DNS converts:", o: ["IP to MAC", "Domain names to IP", "Data to binary", "HTTP to HTTPS"], a: 1, e: "Domain Name System (DNS) acts as the phonebook of the internet, translating human readable domain names to IP addresses." },
        { s: "Programming", b: "Git is used for:", o: ["Database management", "Version control", "Web hosting", "Email services"], a: 1, e: "Git is a distributed version control system for tracking changes in source code during software development." },
        { s: "Programming", b: "Time complexity of bubble sort:", o: ["O(n)", "O(log n)", "O(n²)", "O(1)"], a: 2, e: "In the worst case, bubble sort compares every pair of elements, requiring n×n operations (O(n²))." },
        { s: "Database", b: "SQL command to get all columns:", o: ["SELECT EVERY", "SELECT *", "GET ALL", "FETCH *"], a: 1, e: "The asterisk (*) acts as a wildcard in SELECT statements to fetch all columns from a table." },
        { s: "Programming", b: "What is JS NaN?", o: ["Not a Null", "Not a Number", "Now a Number", "New array Notation"], a: 1, e: "NaN stands for Not-a-Number, representing a value which is not a valid number in JavaScript." },
        { s: "Networking", b: "Port for HTTPS:", o: ["80", "21", "22", "443"], a: 3, e: "Port 443 is the standard port for secure HTTPS web traffic over TLS/SSL." },
        { s: "Programming", b: "Java runs on:", o: ["V8 Engine", "JRE/JVM", ".NET Framework", "LLVM"], a: 1, e: "Java code is compiled into bytecode, which is executed by the Java Virtual Machine (JVM) inside the JRE." }
    ],
    diploma: [
        { s: "Engineering", b: "Highest thermal conductivity:", o: ["Steel", "Aluminum", "Copper", "Iron"], a: 2, e: "Copper has one of the highest thermal conductivities among common metals, making it excellent for heat transfer." },
        { s: "Engineering", b: "DC motor converts:", o: ["Mechanical to electrical", "Electrical to mechanical", "Chemical to electrical", "Thermal to mechanical"], a: 1, e: "A DC motor takes direct current (electrical energy) and converts it into rotational movement (mechanical energy)." },
        { s: "Engineering", b: "Pascal is unit of:", o: ["Force", "Pressure", "Energy", "Torque"], a: 1, e: "The Pascal (Pa) is the SI derived unit of pressure, defined as one newton per square meter." },
        { s: "Engineering", b: "Series circuit current:", o: ["Different", "Same", "Zero", "Variable"], a: 1, e: "In a series circuit, there is only one path for electrons to flow, so the current is the same through all components." },
        { s: "Engineering", b: "Transformer principle:", o: ["Magnetic resonance", "Electromagnetic induction", "Electrostatic induction", "Piezoelectric effect"], a: 1, e: "Transformers work on the principle of Faraday's law of electromagnetic induction to step voltage up or down." },
        { s: "Engineering", b: "Electrical power unit:", o: ["Volt", "Ampere", "Watt", "Ohm"], a: 2, e: "The Watt (W) is the SI unit of power, equivalent to one joule per second." },
        { s: "Engineering", b: "IC chips made from:", o: ["Copper", "Iron", "Silicon", "Aluminum"], a: 2, e: "Integrated circuits (ICs) are primarily made from semiconductor materials, with silicon being the most common." },
        { s: "Engineering", b: "CAD stands for:", o: ["Computer Aided Design", "Computer Automated Drawing", "Central Auto Design", "Computer Applied Drafting"], a: 0, e: "CAD (Computer-Aided Design) is software used by architects, engineers, and designers to create precision drawings." },
        { s: "Engineering", b: "Unit of capacitance:", o: ["Farad", "Henry", "Ohm", "Weber"], a: 0, e: "The Farad (F) is the SI unit of electrical capacitance." },
        { s: "Engineering", b: "Kirchhoff's Current Law is based on conservation of:", o: ["Energy", "Charge", "Momentum", "Mass"], a: 1, e: "KCL states that total current entering a junction equals total current leaving, which is conservation of electric charge." }
    ],
    neet: [
        { s: "Biology", b: "Powerhouse of cell:", o: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"], a: 1, e: "Mitochondria are called powerhouses because they generate most of the cell's supply of ATP (energy)." },
        { s: "Biology", b: "Photosynthesis occurs in:", o: ["Mitochondria", "Nucleus", "Chloroplast", "Ribosome"], a: 2, e: "Chloroplasts contain chlorophyll, which absorbs light energy to drive photosynthesis in plant cells." },
        { s: "Biology", b: "Normal body temp:", o: ["32°C", "37°C", "42°C", "28°C"], a: 1, e: "The normal resting body temperature for a healthy adult is typically around 37°C (98.6°F)." },
        { s: "Chemistry", b: "pH of blood:", o: ["6.4", "7.4", "8.4", "5.4"], a: 1, e: "Human blood is slightly basic (alkaline) with a tightly regulated pH range of 7.35 to 7.45." },
        { s: "Biology", b: "Insulin secreted by:", o: ["Liver", "Kidney", "Pancreas", "Thyroid"], a: 2, e: "Insulin is a hormone produced by the beta cells of the pancreatic islets to regulate blood sugar levels." },
        { s: "Biology", b: "Universal donor blood group:", o: ["A", "B", "AB", "O"], a: 3, e: "Type O negative blood has no A or B antigens, making it safe to donate to anyone." },
        { s: "Biology", b: "Largest human organ:", o: ["Heart", "Liver", "Lungs", "Skin"], a: 3, e: "The skin is the body's largest organ, covering the entire outside of the body." },
        { s: "Chemistry", b: "Sunlight vitamin:", o: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], a: 3, e: "Vitamin D is synthesized in the skin when exposed to sunlight (UVB radiation)." },
        { s: "Biology", b: "Number of bones in human body:", o: ["200", "206", "212", "198"], a: 1, e: "An adult human skeleton consists of 206 bones, though we are born with more that fuse together over time." },
        { s: "Biology", b: "Which gas do plants absorb during photosynthesis?", o: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], a: 2, e: "Plants take in carbon dioxide (CO₂) from the air and use it to produce glucose and oxygen." }
    ],
    appsc: [
        { s: "General Knowledge", b: "Capital of AP:", o: ["Hyderabad", "Visakhapatnam", "Amaravati", "Tirupati"], a: 2, e: "Amaravati is the designated legislative capital of the Indian state of Andhra Pradesh." },
        { s: "History", b: "AP bifurcation year:", o: ["2012", "2013", "2014", "2015"], a: 2, e: "The Andhra Pradesh Reorganisation Act, 2014 bifurcated the state into Telangana and residuary Andhra Pradesh." },
        { s: "General Knowledge", b: "National bird of India:", o: ["Sparrow", "Peacock", "Parrot", "Eagle"], a: 1, e: "The Indian peacock (Pavo cristatus) was declared the National Bird of India in 1963." },
        { s: "Maths", b: "15% of number is 75, number is:", o: ["500", "450", "600", "550"], a: 0, e: "Let x be the number. 0.15 * x = 75. Therefore x = 75 / 0.15 = 500." },
        { s: "Maths", b: "Train 360km in 4hrs, speed:", o: ["90 km/h", "80 km/h", "100 km/h", "85 km/h"], a: 0, e: "Speed = Distance / Time. So, 360 km / 4 hours = 90 km/h." },
        { s: "History", b: "India independence year:", o: ["1945", "1946", "1947", "1948"], a: 2, e: "India gained independence from British rule on August 15, 1947." },
        { s: "Reasoning", b: "Series: 2, 4, 8, 16, ___", o: ["18", "32", "24", "20"], a: 1, e: "This is a geometric progression where each term is multiplied by 2 (16 * 2 = 32)." },
        { s: "General Knowledge", b: "Currency of Japan:", o: ["Yuan", "Won", "Yen", "Rupee"], a: 2, e: "The Japanese Yen (¥) is the official currency of Japan." },
        { s: "Indian Polity", b: "Who is the first citizen of India?", o: ["Prime Minister", "Chief Justice", "President", "Vice President"], a: 2, e: "The President of India is the head of state and the first citizen of India." },
        { s: "General Knowledge", b: "Longest river in India:", o: ["Brahmaputra", "Godavari", "Ganga", "Yamuna"], a: 2, e: "The Ganga (Ganges) is the longest river flowing entirely within the borders of India." }
    ]
};
