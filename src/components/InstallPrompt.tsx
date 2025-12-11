import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if user dismissed the prompt before
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissed) {
            const dismissedAt = new Date(dismissed);
            const daysSinceDismissed = (Date.now() - dismissedAt.getTime()) / (1000 * 60 * 60 * 24);
            // Show again after 7 days
            if (daysSinceDismissed < 7) return;
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show prompt after 30 seconds on the page
            setTimeout(() => setShowPrompt(true), 30000);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
    };

    if (isInstalled || !showPrompt || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-2xl">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Download className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">
                            Instalar Bico Certo
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            Acesse mais rápido e receba notificações de novas vagas!
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="hero"
                                size="sm"
                                onClick={handleInstall}
                                className="flex-1"
                            >
                                Instalar
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDismiss}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
