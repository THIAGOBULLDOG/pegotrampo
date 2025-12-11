import { useState, useEffect, useCallback, useMemo } from 'react';
import { Job } from '@/types/job';
import { supabase, DbJob } from '@/lib/supabase';
import { generateSeedJobs } from '@/data/seedData';

const JOBS_KEY = 'bico_jobs';
const FAVORITES_KEY = 'bico_favorites';
const ITEMS_PER_PAGE = 9;

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && !url.includes('placeholder') && !key.includes('placeholder');
};

// Convert DB job to app job
const dbJobToJob = (dbJob: DbJob): Job => ({
  id: dbJob.id,
  title: dbJob.title,
  description: dbJob.description,
  salary: dbJob.salary,
  jobType: dbJob.job_type,
  state: dbJob.state,
  city: dbJob.city,
  whatsapp: dbJob.whatsapp,
  employerName: dbJob.employer_name,
  createdAt: dbJob.created_at,
});

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Load jobs
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);

      if (isSupabaseConfigured()) {
        // Load from Supabase
        try {
          const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (data && data.length > 0) {
            setJobs(data.map(dbJobToJob));
          } else {
            // Fallback to seed data if no jobs in DB
            setJobs(generateSeedJobs());
          }
        } catch (error) {
          console.error('Error loading jobs from Supabase:', error);
          // Fallback to localStorage
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }

      setIsLoading(false);
    };

    const loadFromLocalStorage = () => {
      const storedJobs = localStorage.getItem(JOBS_KEY);
      if (storedJobs) {
        setJobs(JSON.parse(storedJobs));
      } else {
        const seedJobs = generateSeedJobs();
        setJobs(seedJobs);
        localStorage.setItem(JOBS_KEY, JSON.stringify(seedJobs));
      }
    };

    loadJobs();

    // Load favorites from localStorage (always local for now)
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    // Set up real-time subscription if Supabase is configured
    if (isSupabaseConfigured()) {
      const channel = supabase
        .channel('jobs-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'jobs' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newJob = dbJobToJob(payload.new as DbJob);
              setJobs(prev => [newJob, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              const updatedJob = dbJobToJob(payload.new as DbJob);
              setJobs(prev => prev.map(job =>
                job.id === updatedJob.id ? updatedJob : job
              ));
            } else if (payload.eventType === 'DELETE') {
              setJobs(prev => prev.filter(job => job.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Filter jobs by search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;

    const query = searchQuery.toLowerCase();
    return jobs.filter(job =>
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.employerName.toLowerCase().includes(query)
    );
  }, [jobs, searchQuery]);

  // Paginated jobs
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  }, [filteredJobs]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const addJob = useCallback(async (job: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .insert({
            title: job.title,
            description: job.description,
            salary: job.salary,
            job_type: job.jobType,
            state: job.state,
            city: job.city,
            whatsapp: job.whatsapp,
            employer_name: job.employerName,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;
        return dbJobToJob(data);
      } catch (error) {
        console.error('Error adding job to Supabase:', error);
      }
    }

    // Fallback to localStorage
    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    localStorage.setItem(JOBS_KEY, JSON.stringify(updatedJobs));
    return newJob;
  }, [jobs]);

  const updateJob = useCallback(async (id: string, updates: Partial<Job>) => {
    if (isSupabaseConfigured()) {
      try {
        const dbUpdates: Partial<DbJob> = {};
        if (updates.title) dbUpdates.title = updates.title;
        if (updates.description) dbUpdates.description = updates.description;
        if (updates.salary) dbUpdates.salary = updates.salary;
        if (updates.jobType) dbUpdates.job_type = updates.jobType;
        if (updates.state) dbUpdates.state = updates.state;
        if (updates.city) dbUpdates.city = updates.city;
        if (updates.whatsapp) dbUpdates.whatsapp = updates.whatsapp;
        if (updates.employerName) dbUpdates.employer_name = updates.employerName;

        const { error } = await supabase
          .from('jobs')
          .update(dbUpdates)
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating job in Supabase:', error);
      }
    }

    // Update local state
    const updatedJobs = jobs.map(job =>
      job.id === id ? { ...job, ...updates } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem(JOBS_KEY, JSON.stringify(updatedJobs));
  }, [jobs]);

  const deleteJob = useCallback(async (id: string) => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting job from Supabase:', error);
      }
    }

    // Update local state
    const updatedJobs = jobs.filter(job => job.id !== id);
    setJobs(updatedJobs);
    localStorage.setItem(JOBS_KEY, JSON.stringify(updatedJobs));
  }, [jobs]);

  const toggleFavorite = useCallback((jobId: string) => {
    const updatedFavorites = favorites.includes(jobId)
      ? favorites.filter(id => id !== jobId)
      : [...favorites, jobId];
    setFavorites(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  }, [favorites]);

  const isFavorite = useCallback((jobId: string) => {
    return favorites.includes(jobId);
  }, [favorites]);

  const getEmployerJobs = useCallback((whatsapp: string) => {
    return jobs.filter(job => job.whatsapp === whatsapp);
  }, [jobs]);

  return {
    jobs: filteredJobs,
    paginatedJobs,
    favorites,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    addJob,
    updateJob,
    deleteJob,
    toggleFavorite,
    isFavorite,
    getEmployerJobs,
  };
}
