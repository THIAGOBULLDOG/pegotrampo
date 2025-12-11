import { useState } from 'react';
import { Check, Gift, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface PricingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectPlan: (plan: 'free' | 'monthly' | 'donation') => void;
    trialExpired?: boolean;
}

export function PricingModal({ open, onOpenChange, onSelectPlan, trialExpired = false }: PricingModalProps) {
    const [donationAmount, setDonationAmount] = useState('');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl bg-card max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">
                        {trialExpired ? (
                            <span className="text-destructive">Seu teste acabou. Ative o plano mensal e volte a anunciar.</span>
                        ) : (
                            '💰 Escolha seu Plano'
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {/* Free Trial */}
                    <div className="relative bg-secondary/50 rounded-2xl p-6 border-2 border-border hover:border-primary/50 transition-colors">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            🆓 GRÁTIS
                        </div>

                        <div className="text-center mb-6 mt-2">
                            <Gift className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-foreground">TESTE GRÁTIS</h3>
                            <p className="text-3xl font-extrabold text-green-500 mt-2">15 DIAS</p>
                        </div>

                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                Acesso total à plataforma
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                Publique anúncios ilimitados durante o teste
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                Sem necessidade de pagamento
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                Teste todas as funcionalidades antes de assinar
                            </li>
                        </ul>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => onSelectPlan('free')}
                            disabled={trialExpired}
                        >
                            {trialExpired ? 'Teste expirado' : 'Começar Teste Grátis'}
                        </Button>
                    </div>

                    {/* Monthly Plan */}
                    <div className="relative bg-gradient-to-b from-primary/10 to-secondary/50 rounded-2xl p-6 border-2 border-primary shadow-lg scale-105">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                            📅 RECOMENDADO
                        </div>

                        <div className="text-center mb-6 mt-2">
                            <Crown className="w-12 h-12 text-primary mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-foreground">PLANO MENSAL</h3>
                            <p className="text-3xl font-extrabold text-primary mt-2">R$ 45,00</p>
                            <p className="text-xs text-muted-foreground">/mês</p>
                        </div>

                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                Anúncios infinitos
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                Curso completo: "Como Vender Pela Internet"
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                Suporte via chat
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                Atualizações contínuas da plataforma
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-primary font-medium">10% do lucro destinado à caridade</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                Perfil profissional verificado
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                Receba avaliações e depoimentos
                            </li>
                        </ul>

                        <Button
                            variant="hero"
                            className="w-full"
                            onClick={() => onSelectPlan('monthly')}
                        >
                            PAGAR AGORA
                        </Button>
                    </div>

                    {/* Donation Plan */}
                    <div className="relative bg-secondary/50 rounded-2xl p-6 border-2 border-border hover:border-amber-500/50 transition-colors">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                            📅 APOIADOR
                        </div>

                        <div className="text-center mb-6 mt-2">
                            <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-foreground">PLANO DOAÇÃO</h3>
                            <p className="text-lg text-muted-foreground mt-2">Você escolhe o valor</p>
                            <div className="mt-3">
                                <Input
                                    type="number"
                                    placeholder="R$ Valor"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    className="text-center text-lg font-bold"
                                    min="1"
                                />
                            </div>
                        </div>

                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                Selo de Apoiador Oficial no perfil
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                Acesso antecipado a novas funcionalidades
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                Prioridade no suporte
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                Curso completo: "Como Vender Pela Internet"
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span className="text-amber-500 font-medium">10% do lucro destinado à caridade</span>
                            </li>
                        </ul>

                        <Button
                            variant="outline"
                            className="w-full border-amber-500 text-amber-500 hover:bg-amber-500/10"
                            onClick={() => onSelectPlan('donation')}
                            disabled={!donationAmount || parseFloat(donationAmount) <= 0}
                        >
                            APOIAR MENSALMENTE
                        </Button>
                    </div>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    Após o término do teste de 15 dias, seus anúncios serão pausados automaticamente.
                    <br />
                    Ative um plano para continuar anunciando.
                </p>
            </DialogContent>
        </Dialog>
    );
}
