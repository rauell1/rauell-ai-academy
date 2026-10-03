-- Enable Row-Level Security (RLS) on all tables and create permissive application policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
        EXECUTE format('DROP POLICY IF EXISTS "allow_all_authenticated_app" ON public.%I;', r.tablename);
        EXECUTE format('CREATE POLICY "allow_all_authenticated_app" ON public.%I FOR ALL USING (true) WITH CHECK (true);', r.tablename);
    END LOOP;
END $$;
