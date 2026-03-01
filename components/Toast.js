'use client';
import { useState, useEffect } from 'react';

export default function Toast({ message }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const t = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(t);
        }
    }, [message]);

    return (
        <div className={`toast${visible ? ' show' : ''}`}>
            {message?.replace(/\s+\d+$/, '')}
        </div>
    );
}
