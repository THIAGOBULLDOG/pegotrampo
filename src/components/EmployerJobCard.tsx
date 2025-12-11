import { Edit, Trash2, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types/job';
import { brazilStates, citiesByState, jobTypes } from '@/data/brazilLocations';

interface EmployerJobCardProps {
  job: Job;
  onEdit: () => void;
  onDelete: () => void;
}

export function EmployerJobCard({ job, onEdit, onDelete }: EmployerJobCardProps) {
  const stateName = brazilStates.find(s => s.value === job.state)?.label || job.state;
  const cityName = citiesByState[job.state]?.find(c => c.value === job.city)?.label || job.city;
  const jobTypeName = jobTypes.find(t => t.value === job.jobType)?.label || job.jobType;

  return (
    <Card className="border-border/50 bg-card hover:shadow-card transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="mb-2 bg-accent text-accent-foreground text-xs">
              {jobTypeName}
            </Badge>
            <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{job.description}</p>
            
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {cityName}, {stateName}
              </span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <DollarSign className="w-3 h-3 text-primary" />
                R$ {job.salary.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
