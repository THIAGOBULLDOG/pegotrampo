import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
    const { resetPassword } = useAuth();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await resetPassword(email);

        if (error) {
            toast({
                title: "Erro",
                description: error.message,
                variant: "destructive",
            });
        } else {
            setSent(true);
            toast({
                title: "Email enviado!",
                description: "Verifique sua caixa de entrada.",
            });
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-md">
                    <Link to="/login">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>

                    <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                Recuperar senha
                            </h1>
                            <p className="text-muted-foreground">
                                Digite seu email para receber um link de recuperação
                            </p>
                        </div>

                        {sent ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-lg font-semibold text-foreground mb-2">
                                    Verifique seu email
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Enviamos um link de recuperação para <strong>{email}</strong>
                                </p>
                                <Button variant="outline" onClick={() => setSent(false)}>
                                    Enviar novamente
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="hero"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                                </Button>
                            </form>
                        )}

                        <div className="mt-6 text-center">
                            <p className="text-muted-foreground">
                                Lembrou a senha?{' '}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Fazer login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
