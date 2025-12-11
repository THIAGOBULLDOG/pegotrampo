import { useState } from 'react';
import { Briefcase, Megaphone, Play, Building2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PricingModal } from '@/components/PricingModal';

export function Hero() {
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-secondary" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Secondary Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVideoModal(true)}
            className="rounded-full"
          >
            <Play className="w-4 h-4 mr-2" />
            Como funciona
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de indicar uma empresa para a plataforma Bico Certo.', '_blank')}
            className="rounded-full"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Indique uma empresa
          </Button>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-4 animate-slide-up">
          TRABALHOS TEMPORÁRIOS
        </h1>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary mb-6 animate-slide-up">
          DO SEU JEITO.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in">
          Encontre as melhores oportunidades de trabalho temporário na sua região.
          Escolha os dias que quer trabalhar e comece a ganhar!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <Button
            variant="hero"
            size="xl"
            onClick={() => navigate('/vagas')}
            className="min-w-[220px]"
          >
            <Briefcase className="w-5 h-5" />
            Vagas Temporárias
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={() => setShowPricingModal(true)}
            className="min-w-[220px]"
          >
            <Megaphone className="w-5 h-5" />
            Anunciar Trampo
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-foreground">0</p>
            <p className="text-sm text-muted-foreground">Vagas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-foreground">0.0</p>
            <p className="text-sm text-muted-foreground">Avaliação</p>
          </div>
          <div className="text-center col-span-2 md:col-span-1">
            <p className="text-3xl md:text-4xl font-bold text-foreground">4.9</p>
            <p className="text-sm text-muted-foreground">Avaliação</p>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-4xl bg-card p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Como funciona o Bico Certo</span>
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4">
            <div className="relative w-full aspect-video bg-secondary rounded-xl overflow-hidden">
              {/* Placeholder for video - replace with actual video URL */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Como funciona o Bico Certo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Assista o vídeo para entender como usar a plataforma
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pricing Modal */}
      <PricingModal
        open={showPricingModal}
        onOpenChange={setShowPricingModal}
        onSelectPlan={(plan) => {
          setShowPricingModal(false);
          // Redirect to registration/login regardless of plan choice for now
          // In a real app, we would pass the selected plan
          navigate('/cadastro');
        }}
      />
    </section>
  );
}
