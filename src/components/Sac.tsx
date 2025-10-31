import React from 'react';
import { LifeBuoy, Mail, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

type AppView = 'home' | 'dashboard' | 'suporte' | 'termos' | 'privacidade' | 'cookies';
type NavigateFunc = (view: AppView) => void;

interface SacProps {
  onNavigate: NavigateFunc;
}

const WHATSAPP_URL = "https://chat.whatsapp.com/BU1iRDPbpzSK2T4bu4mj30";

export function Sac({ onNavigate }: SacProps) {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* Botão "Página Inicial" FORA DO CARD – ALINHADO À DIREITA */}
      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          onClick={() => onNavigate('home')}
          className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Página Inicial
        </Button>
      </div>

      {/* Card Principal */}
      <div className="p-6 md:p-8 bg-white rounded-lg shadow-md border border-[#d4c4b0]">
        {/* Título */}
        <h2 className="text-2xl font-semibold text-[#2d1f16] mb-4 flex items-center">
          <LifeBuoy className="w-6 h-6 mr-3 text-[#a16535]" />
          Precisa de Suporte?
        </h2>

        {/* Texto principal */}
        <p className="text-[#4a3629] mb-6 text-base md:text-lg leading-relaxed">
          Se você encontrar qualquer problema, tiver dúvidas ou precisar de ajuda com o sistema <strong>Juris Fácil</strong>, não hesite em entrar em contato. Nossa equipe de suporte está disponível para ajudar!
        </p>

        {/* Dois Botões: WhatsApp + E-mail */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Botão WhatsApp com ÍCONE OFICIAL */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              className="w-full bg-[#a16535] hover:bg-[#8b5329] text-white font-medium rounded-md shadow-sm transition-all duration-200 flex items-center justify-center"
              size="lg"
            >
              <svg
                className="w-6 h-6 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              Entrar em Contato via WhatsApp
            </Button>
          </a>

          {/* Botão E-mail */}
          <a
            href="mailto:suporte@jurisfacil.com.br"
            className="flex-1"
          >
            <Button
              className="w-full bg-[#a16535] hover:bg-[#8b5329] text-white font-medium rounded-md shadow-sm transition-all duration-200"
              size="lg"
            >
              <Mail className="w-5 h-5 mr-2" />
              Enviar E-mail
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}