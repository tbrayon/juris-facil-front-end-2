// src/components/Footer.tsx
import { Scale } from 'lucide-react';

// Interface defining the props expected by Footer
interface FooterProps {
  onNavigate: (view: 'home' | 'dashboard' | 'clientes' | 'processos' | 'prazos' | 'contratos' | 'relatorios' | 'usuarios' | 'suporte' | 'termos' | 'privacidade' | 'cookies') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gradient-to-b from-white to-[#f6f3ee] border-t-2 border-[#d4c4b0] mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Scale className="w-5 h-5 text-[#a16535]" />
          <p className="text-[#2d1f16]">JURIS <span className="text-[#a16535]">FÁCIL</span></p>
        </div>
        <p className="text-sm text-[#6b5544]">© 2025 Sistema de Gestão Jurídica</p>

        {/* Links legais como botões */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-x-4 md:gap-x-6 gap-y-2">
          <button
            onClick={() => onNavigate('termos')}
            className="text-xs text-[#6b5544] hover:text-[#a16535] hover:underline transition-colors cursor-pointer"
          >
            Termos de Uso
          </button>
          <span className="text-[#d4c4b0] hidden md:inline">|</span>
          <button
            onClick={() => onNavigate('privacidade')}
            className="text-xs text-[#6b5544] hover:text-[#a16535] hover:underline transition-colors cursor-pointer"
          >
            Política de Privacidade
          </button>
          <span className="text-[#d4c4b0] hidden md:inline">|</span>
          <button
            onClick={() => onNavigate('cookies')}
            className="text-xs text-[#6b5544] hover:text-[#a16535] hover:underline transition-colors cursor-pointer"
          >
            Política de Cookies
          </button>
        </div>

        {/* Informações dos desenvolvedores */}
        <div className="mt-4 pt-4 border-t border-[#d4c4b0]">
          <p className="text-xs text-[#6b5544]">
            Desenvolvido por Alexandre Guzmán, Ana Paula Sena, Brayon Duarte, Gina Rocha e Salomão Lobato
          </p>
        </div>
      </div>
    </footer>
  );
}