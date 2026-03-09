import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get or create anonymous user ID
export function getAnonId() {
    if (typeof window === 'undefined') return null;
    let id = localStorage.getItem('lwf_anon_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('lwf_anon_id', id);
    }
    return id;
}
