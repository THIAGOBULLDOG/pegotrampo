import { useState } from 'react';
import { Briefcase, FileText, DollarSign, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { brazilStates, citiesByState, jobTypes } from '@/data/brazilLocations';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/types/job';

interface JobFormProps {
  onSubmit: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  employerName: string;
  whatsapp: string;
  initialData?: Job;
  isEditing?: boolean;
}

export function JobForm({ onSubmit, employerName, whatsapp, initialData, isEditing }: JobFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [salary, setSalary] = useState(initialData?.salary?.toString() || '');
  const [jobType, setJobType] = useState(initialData?.jobType || '');
  const [state, setState] = useState(initialData?.state || '');
  const [city, setCity] = useState(initialData?.city || '');
  const { toast } = useToast();

  const cities = state ? citiesByState[state] || [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !salary || !jobType || !state || !city) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const salaryNum = parseFloat(salary);
    if (salaryNum < 50) {
      toast({
        title: "Erro",
        description: "O salário mínimo é R$ 50,00.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      salary: salaryNum,
      jobType,
      state,
      city,
      whatsapp,
      employerName,
    });

    if (!isEditing) {
      setTitle('');
      setDescription('');
      setSalary('');
      setJobType('');
      setState('');
      setCity('');
    }
  };

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          {isEditing ? 'Editar Vaga' : 'Nova Vaga'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Título da Vaga
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ajudante de Mudança"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Descrição
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as atividades, horários e requisitos..."
              className="bg-background min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Valor (R$)
              </label>
              <Input
                type="number"
                min="50"
                step="0.01"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Mínimo R$ 50,00"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tipo de Vaga
              </label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {jobTypes.filter(t => t.value !== 'todos').map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Estado
              </label>
              <Select value={state} onValueChange={(v) => { setState(v); setCity(''); }}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {brazilStates.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Cidade
              </label>
              <Select value={city} onValueChange={setCity} disabled={!state}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {cities.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full" size="lg">
            {isEditing ? 'Salvar Alterações' : 'Publicar Vaga'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
