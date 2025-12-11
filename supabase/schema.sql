-- Bico Certo Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- EMPLOYERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS employers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_employers_user_id ON employers(user_id);

-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  salary NUMERIC(10, 2) NOT NULL,
  job_type TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  employer_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_jobs_state ON jobs(state);
CREATE INDEX IF NOT EXISTS idx_jobs_city ON jobs(city);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- Full-text search index on title and description
CREATE INDEX IF NOT EXISTS idx_jobs_search ON jobs 
USING GIN (to_tsvector('portuguese', title || ' ' || description));

-- ============================================
-- FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Create index for user favorites lookup
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- EMPLOYERS policies
CREATE POLICY "Users can view their own employer profile"
  ON employers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own employer profile"
  ON employers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employer profile"
  ON employers FOR UPDATE
  USING (auth.uid() = user_id);

-- JOBS policies
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Employers can view their own jobs"
  ON jobs FOR SELECT
  USING (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

CREATE POLICY "Employers can create jobs"
  ON jobs FOR INSERT
  WITH CHECK (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

CREATE POLICY "Employers can update their own jobs"
  ON jobs FOR UPDATE
  USING (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

CREATE POLICY "Employers can delete their own jobs"
  ON jobs FOR DELETE
  USING (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

-- FAVORITES policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_employers_updated_at
  BEFORE UPDATE ON employers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional demo jobs)
-- ============================================
-- Note: Run this separately if you want demo data

-- INSERT INTO jobs (title, description, salary, job_type, state, city, whatsapp, employer_name)
-- VALUES 
--   ('Ajudante de Mudança', 'Preciso de 2 ajudantes para carregar móveis. Trabalho de 1 dia.', 150, 'mudanca', 'SP', 'sao-paulo', '5511999999999', 'João Silva'),
--   ('Garçom para Evento', 'Evento corporativo no sábado. Das 18h às 23h.', 120, 'garcom', 'RJ', 'rio-de-janeiro', '5521988888888', 'Maria Eventos'),
--   ('Auxiliar de Cozinha', 'Restaurante precisa de auxiliar para fim de semana.', 100, 'cozinha', 'MG', 'belo-horizonte', '5531977777777', 'Restaurante Sabor'),
--   ('Motoboy para Entregas', 'Entregas na região central. Moto própria necessária.', 200, 'entrega', 'SP', 'campinas', '5519966666666', 'Express Delivery');
