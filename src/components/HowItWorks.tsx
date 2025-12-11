import { Search, MessageCircle, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Search,
    title: 'Busque',
    description: 'Digite sua localização e encontre vagas temporárias próximas a você.',
  },
  {
    number: 2,
    icon: MessageCircle,
    title: 'Converse',
    description: 'Fale diretamente com o contratante via WhatsApp e tire suas dúvidas.',
  },
  {
    number: 3,
    icon: CreditCard,
    title: 'Combine',
    description: 'Negocie o valor e as condições do trabalho diretamente com o empregador.',
  },
  {
    number: 4,
    icon: CheckCircle,
    title: 'Trabalhe',
    description: 'Realize o trabalho e receba seu pagamento. Simples assim!',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Em apenas 4 passos simples, você encontra o trabalho temporário ideal para suas necessidades.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Step number badge */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm z-10 shadow-lg">
                {step.number}
              </div>

              {/* Card */}
              <div className="bg-card rounded-2xl p-6 pt-8 shadow-card border border-border/50 h-full transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
