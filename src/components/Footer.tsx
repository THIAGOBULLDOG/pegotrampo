import { Briefcase, Instagram, Facebook, Linkedin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">BicoFácil</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm">
              A forma mais fácil de encontrar e anunciar trabalhos temporários.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Para Trabalhadores */}
          <div>
            <h3 className="font-semibold mb-4">Para Trabalhadores</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link to="/vagas" className="hover:text-primary-foreground transition-colors">
                  Buscar vagas
                </Link>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-primary-foreground transition-colors">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Segurança
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Dicas de trabalho
                </a>
              </li>
            </ul>
          </div>

          {/* Para Empresários */}
          <div>
            <h3 className="font-semibold mb-4">Para Empresários</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link to="/anunciar" className="hover:text-primary-foreground transition-colors">
                  Cadastre-se
                </Link>
              </li>
              <li>
                <Link to="/anunciar" className="hover:text-primary-foreground transition-colors">
                  Como anunciar
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Taxas e valores
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Central de ajuda
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:contato@bicofacil.com" className="hover:text-primary-foreground transition-colors">
                  contato@bicofacil.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+5511999999999" className="hover:text-primary-foreground transition-colors">
                  (11) 99999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2024 BicoFácil. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Termos de uso
              </a>
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
