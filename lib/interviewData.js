// Question categories for AI to generate from
export const Q_CATEGORIES = {
    hr: ['introduction', 'motivation', 'teamwork', 'conflict', 'culture-fit', 'salary', 'strengths-weaknesses'],
    behavioral: ['leadership', 'failure', 'pressure', 'adaptability', 'decision-making', 'achievement'],
    technical: ['concepts', 'problem-solving', 'system-design', 'debugging', 'best-practices'],
    coding: ['algorithm', 'data-structure', 'string-manipulation', 'array-problem', 'logic-puzzle']
};

// How many questions per category based on difficulty
export const Q_MIX = {
    easy: { hr: 4, behavioral: 3, technical: 2, coding: 1 },
    medium: { hr: 4, behavioral: 5, technical: 6, coding: 3 },
    hard: { hr: 3, behavioral: 4, technical: 8, coding: 5 }
};

export const FILLERS = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'actually', 'so', 'right', 'okay'];

// Increased timers for more natural thinking time
export const DIFF_T = { easy: 120, medium: 90, hard: 60 };
export const DIFF_Q = { easy: 10, medium: 18, hard: 20 };
