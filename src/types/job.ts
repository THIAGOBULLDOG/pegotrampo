export interface Job {
  id: string;
  title: string;
  description: string;
  salary: number;
  jobType: string;
  state: string;
  city: string;
  whatsapp: string;
  employerName: string;
  createdAt: string;
}

export interface Employer {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  createdAt: string;
}
