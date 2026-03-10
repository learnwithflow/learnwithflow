export const incrementStreak = () => {
    try {
        const lastActiveStr = localStorage.getItem('lwf_last_active');
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        let currentStreak = parseInt(localStorage.getItem('lwf_streak') || '0', 10);

        if (lastActiveStr) {
            const lastDate = new Date(lastActiveStr);
            const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const lastMidnight = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
            const diffTime = todayMidnight.getTime() - lastMidnight.getTime();
            const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

            if (diffDays === 1) {
                // Streak maintained, increment!
                currentStreak += 1;
            } else if (diffDays > 1) {
                // Streak broken, start fresh today
                currentStreak = 1;
            }
            // if diffDays === 0, they already got the streak today, do nothing.
        } else {
            // First time ever
            currentStreak = 1;
        }

        localStorage.setItem('lwf_streak', currentStreak.toString());
        localStorage.setItem('lwf_last_active', now.toISOString());

        // Dispatch custom event so Navbar updates immediately without refresh
        window.dispatchEvent(new Event('lwf_streak_updated'));

        return currentStreak;
    } catch (e) {
        console.error('Streak increment error', e);
        return 0;
    }
};
