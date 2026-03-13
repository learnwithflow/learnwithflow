-- Copy and paste this into your Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.user_question_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    exam_type TEXT NOT NULL,
    chapter TEXT,
    question_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recommended Indexing for fast lookups during exam generation
CREATE INDEX IF NOT EXISTS idx_uqh_user_exam ON public.user_question_history(user_id, exam_type);
CREATE INDEX IF NOT EXISTS idx_uqh_user_exam_chapter ON public.user_question_history(user_id, exam_type, chapter);

-- Set Row Level Security (RLS) policies if you enforce them on your Supabase instance:
-- ALTER TABLE public.user_question_history ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can insert their own question history" ON public.user_question_history FOR INSERT WITH CHECK (true); -- Modify depending on specific Auth vs Anon rules
-- CREATE POLICY "Users can view their own question history" ON public.user_question_history FOR SELECT USING (true);
