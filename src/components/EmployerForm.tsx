import { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface EmployerFormProps {
  onSubmit: (data: { name: string; email: string; whatsapp: string }) => void;
}

export function EmployerForm({ onSubmit }: EmployerFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !whatsapp.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({ name: name.trim(), email: email.trim(), whatsapp: whatsapp.trim() });
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  return (
    <Card className="max-w-md mx-auto border-border/50 shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          Cadastre-se como Empresário
        </CardTitle>
        <CardDescription>
          Preencha seus dados para começar a anunciar vagas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Nome Completo
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome ou nome da empresa"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              WhatsApp
            </label>
            <Input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
              placeholder="(11) 99999-9999"
              className="bg-background"
            />
          </div>

          <Button type="submit" variant="hero" className="w-full" size="lg">
            Criar Conta e Anunciar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
