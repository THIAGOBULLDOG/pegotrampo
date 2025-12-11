import { Heart, MapPin, DollarSign, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types/job';
import { brazilStates, citiesByState, jobTypes } from '@/data/brazilLocations';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function JobCard({ job, isFavorite, onToggleFavorite }: JobCardProps) {
  const stateName = brazilStates.find(s => s.value === job.state)?.label || job.state;
  const cityName = citiesByState[job.state]?.find(c => c.value === job.city)?.label || job.city;
  const jobTypeName = jobTypes.find(t => t.value === job.jobType)?.label || job.jobType;

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Olá! Vi a vaga "${job.title}" no BicoFácil e tenho interesse!`);
    const phone = job.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        {/* Favorite button */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
            )}
          />
        </button>

        {/* Job type badge */}
        <Badge variant="secondary" className="mb-3 bg-accent text-accent-foreground">
          {jobTypeName}
        </Badge>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-2 pr-10">
          {job.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {job.description}
        </p>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{cityName}, {stateName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">R$ {job.salary.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>Publicado por {job.employerName}</span>
          </div>
        </div>

        {/* WhatsApp button */}
        <Button
          variant="whatsapp"
          className="w-full"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="w-4 h-4" />
          Quero a Vaga
        </Button>
      </CardContent>
    </Card>
  );
}
