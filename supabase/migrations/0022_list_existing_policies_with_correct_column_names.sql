SELECT polname, polrelid::regclass as table_name, polcmd, polroles 
FROM pg_policy 
WHERE polrelid::regclass::text LIKE 'public.%'
ORDER BY polrelid::regclass::text, polname;