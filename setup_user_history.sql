CREATE TABLE IF NOT EXISTS user_question_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text,
  chapter text,
  exam_type text,
  question_text text,
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_question_history 
ON user_question_history(user_id, exam_type, subject);

ALTER TABLE user_question_history ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own history' AND tablename = 'user_question_history'
    ) THEN
        CREATE POLICY "Users can manage own history" 
        ON user_question_history 
        FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;
