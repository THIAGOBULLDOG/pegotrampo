import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Database types
export interface DbJob {
  id: string;
  employer_id: string | null;
  title: string;
  description: string;
  salary: number;
  job_type: string;
  state: string;
  city: string;
  whatsapp: string;
  employer_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbEmployer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  whatsapp: string;
  created_at: string;
  updated_at: string;
}

export interface DbFavorite {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
}
