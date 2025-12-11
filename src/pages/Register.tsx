import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const { toast } = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formatWhatsapp = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Senhas não conferem",
                description: "Por favor, verifique se as senhas são iguais.",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Senha muito curta",
                description: "A senha deve ter no mínimo 6 caracteres.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        const { error } = await signUp(email, password, name, whatsapp);

        if (error) {
            toast({
                title: "Erro no cadastro",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Cadastro realizado!",
                description: "Verifique seu email para confirmar a conta.",
            });
            navigate('/login');
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
                                Cadastre-se como Empresário
                            </h1>
                            <p className="text-muted-foreground">
                                Crie sua conta para anunciar suas vagas
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome completo / Nome da empresa</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Seu nome ou nome da empresa"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

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
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="whatsapp"
                                        type="tel"
                                        placeholder="(11) 99999-9999"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
                                        className="pl-10"
                                        required
                                        maxLength={15}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Senha</Label>
                                    <Link to="/esqueci-senha" className="text-xs text-primary hover:underline">
                                        Esqueci minha senha
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Mínimo 6 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Repita sua senha"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        title={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="hero"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Cadastrando...' : 'Criar conta'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-muted-foreground">
                                Já tem uma conta?{' '}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Entre aqui
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
