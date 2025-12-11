import { useState, useEffect } from 'react';
import { Employer } from '@/types/job';

const EMPLOYER_KEY = 'bico_employer';

export function useEmployer() {
  const [employer, setEmployer] = useState<Employer | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(EMPLOYER_KEY);
    if (stored) {
      setEmployer(JSON.parse(stored));
    }
  }, []);

  const registerEmployer = (data: Omit<Employer, 'id' | 'createdAt'>) => {
    const newEmployer: Employer = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setEmployer(newEmployer);
    localStorage.setItem(EMPLOYER_KEY, JSON.stringify(newEmployer));
    return newEmployer;
  };

  const logout = () => {
    setEmployer(null);
    localStorage.removeItem(EMPLOYER_KEY);
  };

  return {
    employer,
    isLoggedIn: !!employer,
    registerEmployer,
    logout,
  };
}
