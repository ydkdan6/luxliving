import { createClient } from '@supabase/supabase-js';

// These would typically come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pybhkdbzxysasbmeeebx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YmhrZGJ6eHlzYXNibWVlZWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDI2NDgsImV4cCI6MjA2MzMxODY0OH0.7hq42J7QId-1A4j0XELmbWX4zPHNkvo2XW0_4FvrIkk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);