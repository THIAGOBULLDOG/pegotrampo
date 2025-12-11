import { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, Plus, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { JobForm } from '@/components/JobForm';
import { EmployerJobCard } from '@/components/EmployerJobCard';
import { PricingModal } from '@/components/PricingModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/types/job';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const TRIAL_DAYS = 15;

export default function Advertise() {
  const { employer, signOut, user } = useAuth();
  const { addJob, updateJob, deleteJob, getEmployerJobs } = useJobs();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [trialExpired, setTrialExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(TRIAL_DAYS);

  const employerJobs = employer ? getEmployerJobs(employer.whatsapp) : [];

  // Check trial status
  useEffect(() => {
    if (employer) {
      const trialStartKey = `trial_start_${employer.id || employer.whatsapp}`;
      const planKey = `plan_${employer.id || employer.whatsapp}`;

      let trialStart = localStorage.getItem(trialStartKey);
      const activePlan = localStorage.getItem(planKey);

      // If has active plan, no need to check trial
      if (activePlan) {
        setTrialExpired(false);
        return;
      }

      // If no trial start, set it now
      if (!trialStart) {
        trialStart = new Date().toISOString();
        localStorage.setItem(trialStartKey, trialStart);
      }

      const startDate = new Date(trialStart);
      const now = new Date();
      const diffTime = now.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const remaining = TRIAL_DAYS - diffDays;
      setDaysRemaining(Math.max(0, remaining));
      setTrialExpired(remaining <= 0);

      // Show pricing if trial expired
      if (remaining <= 0) {
        setShowPricing(true);
      }
    }
  }, [employer]);

  const handleAddJob = async (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    if (trialExpired) {
      setShowPricing(true);
      return;
    }

    await addJob(jobData);
    setShowJobForm(false);
    toast({
      title: "Vaga publicada!",
      description: "Sua vaga já está disponível para os candidatos.",
    });
  };

  const handleUpdateJob = async (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    if (editingJob) {
      await updateJob(editingJob.id, jobData);
      setEditingJob(null);
      toast({
        title: "Vaga atualizada!",
        description: "As alterações foram salvas.",
      });
    }
  };

  const handleDeleteJob = async () => {
    if (deletingJobId) {
      await deleteJob(deletingJobId);
      setDeletingJobId(null);
      toast({
        title: "Vaga removida",
        description: "A vaga foi excluída com sucesso.",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "Até logo!",
      description: "Você saiu da sua conta.",
    });
  };

  const handleSelectPlan = (plan: 'free' | 'monthly' | 'donation') => {
    if (plan === 'free' && !trialExpired) {
      setShowPricing(false);
      toast({
        title: "Teste grátis ativado!",
        description: `Você tem ${daysRemaining} dias para testar a plataforma.`,
      });
    } else if (plan === 'monthly') {
      // Redirect to payment (placeholder)
      window.open('https://pay.example.com/monthly', '_blank');
      toast({
        title: "Redirecionando para pagamento...",
        description: "Complete o pagamento para ativar seu plano.",
      });
    } else if (plan === 'donation') {
      // Redirect to donation payment (placeholder)
      window.open('https://pay.example.com/donation', '_blank');
      toast({
        title: "Redirecionando para doação...",
        description: "Obrigado por apoiar nossa plataforma!",
      });
    }
  };

  const handleNewJob = () => {
    if (trialExpired) {
      setShowPricing(true);
    } else {
      setShowJobForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>

          {/* Trial Expired Banner */}
          {trialExpired && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">
                  Seu teste acabou. Ative o plano mensal e volte a anunciar.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowPricing(true)}
              >
                Ver Planos
              </Button>
            </div>
          )}

          {/* Trial Days Remaining */}
          {!trialExpired && daysRemaining < TRIAL_DAYS && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                ⏰ Seu teste grátis termina em <strong>{daysRemaining} dias</strong>.
                <button
                  onClick={() => setShowPricing(true)}
                  className="underline ml-1 hover:no-underline"
                >
                  Ver planos
                </button>
              </p>
            </div>
          )}

          {/* Dashboard header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Olá, {employer?.name}!
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas vagas de trabalho
              </p>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          {/* Add job button */}
          <Button
            variant="hero"
            size="lg"
            onClick={handleNewJob}
            className="mb-8"
            disabled={trialExpired}
          >
            <Plus className="w-5 h-5" />
            Nova Vaga
          </Button>

          {/* Job list */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Suas Vagas ({employerJobs.length})
              {trialExpired && employerJobs.length > 0 && (
                <span className="text-xs text-destructive ml-2">(pausadas)</span>
              )}
            </h2>

            {employerJobs.length > 0 ? (
              employerJobs.map(job => (
                <div key={job.id} className={trialExpired ? 'opacity-50 pointer-events-none' : ''}>
                  <EmployerJobCard
                    job={job}
                    onEdit={() => setEditingJob(job)}
                    onDelete={() => setDeletingJobId(job.id)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-secondary/50 rounded-2xl">
                <p className="text-muted-foreground">
                  Você ainda não tem vagas publicadas.
                </p>
              </div>
            )}
          </div>

          {/* Pricing Modal */}
          <PricingModal
            open={showPricing}
            onOpenChange={setShowPricing}
            onSelectPlan={handleSelectPlan}
            trialExpired={trialExpired}
          />

          {/* New Job Dialog */}
          <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
            <DialogContent className="max-w-2xl bg-card">
              <DialogHeader>
                <DialogTitle>Nova Vaga</DialogTitle>
              </DialogHeader>
              <JobForm
                onSubmit={handleAddJob}
                employerName={employer?.name || ''}
                whatsapp={employer?.whatsapp || ''}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Job Dialog */}
          <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
            <DialogContent className="max-w-2xl bg-card">
              <DialogHeader>
                <DialogTitle>Editar Vaga</DialogTitle>
              </DialogHeader>
              {editingJob && (
                <JobForm
                  onSubmit={handleUpdateJob}
                  employerName={employer?.name || ''}
                  whatsapp={employer?.whatsapp || ''}
                  initialData={editingJob}
                  isEditing
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Delete confirmation */}
          <AlertDialog open={!!deletingJobId} onOpenChange={() => setDeletingJobId(null)}>
            <AlertDialogContent className="bg-card">
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir vaga?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. A vaga será removida permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteJob} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
}
