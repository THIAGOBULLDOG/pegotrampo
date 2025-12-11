import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            toast({
                title: "Erro ao entrar",
                description: error.message === 'Invalid login credentials'
                    ? 'Email ou senha incorretos'
                    : error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Bem-vindo!",
                description: "Login realizado com sucesso.",
            });
            navigate('/anunciar');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-md">
                    <Link to="/">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>

                    <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                Entrar na sua conta
                            </h1>
                            <p className="text-muted-foreground">
                                Acesse sua conta para gerenciar suas vagas
                            </p>
                        </div>

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

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
                                    Esqueci minha senha
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="hero"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-muted-foreground">
                                Não tem uma conta?{' '}
                                <Link to="/cadastro" className="text-primary hover:underline font-medium">
                                    Cadastre-se
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
