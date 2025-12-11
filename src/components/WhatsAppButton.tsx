import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
    phoneNumber?: string;
    message?: string;
}

export function WhatsAppButton({
    phoneNumber = '5511999999999',
    message = 'Olá! Gostaria de saber mais sobre a plataforma Bico Certo.'
}: WhatsAppButtonProps) {
    const handleClick = () => {
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(url, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group"
            aria-label="Fale conosco no WhatsApp"
        >
            <MessageCircle className="w-7 h-7 text-white fill-white" />

            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                Fale conosco
            </span>

            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
        </button>
    );
}
