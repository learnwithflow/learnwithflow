'use client';
import { useState, useEffect } from 'react';

export default function Toast({ message }) {
    const [visible, setVisible] = useState(false);

    const [prevMessage, setPrevMessage] = useState(message);

    if (message !== prevMessage) {
        setPrevMessage(message);
        if (message) {
            setVisible(true);
        }
    }

    useEffect(() => {
        if (visible) {
            const t = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(t);
        }
    }, [visible]);

    return (
        <div className={`toast${visible ? ' show' : ''}`}>
            {message?.replace(/\s+\d+$/, '')}
        </div>
    );
}
