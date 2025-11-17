// src/components/CookieConsentBanner.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Cookie } from 'lucide-react'; // Ícone de Cookie

// Tipo para a prop onNavigate que virá do Header
type NavigateFunction = (view: 'home' | 'dashboard' | 'clientes' | 'processos' | 'prazos' | 'contratos' | 'relatorios' | 'usuarios' | 'suporte' | 'termos' | 'privacidade' | 'cookies') => void;

interface CookieConsentBannerProps {
  onNavigate: NavigateFunction; // Recebe a função para navegar para a política
}

export function CookieConsentBanner({ onNavigate }: CookieConsentBannerProps) {
  // Estado para controlar a visibilidade do banner
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState("");

  // Verifica no carregamento se o consentimento já foi dado
  useEffect(() => {
    const item = localStorage.getItem('cookieConsent');
    setConsent(String(item));
    // Mostra o banner apenas se nenhum consentimento (aceito ou negado) foi registrado
    if (!consent) {
      setIsVisible(true);
    }
  }, [isVisible, consent]);

  // Função para lidar com a aceitação
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted'); // Salva a escolha
    setIsVisible(false); // Esconde o banner
    // ** PONTO IMPORTANTE **
    // Aqui é onde você DEVE inicializar scripts que dependem de consentimento
    // Ex: Google Analytics, Facebook Pixel, Hotjar, etc.
    // Exemplo: if (typeof window.gtag === 'function') { /* configure analytics */ }
    console.log("Cookies aceitos. Carregar scripts dependentes aqui.");
  };

  // Função para lidar com a negação
  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined'); // Salva a escolha
    setIsVisible(false); // Esconde o banner
    // Garanta que scripts não essenciais NÃO sejam carregados
    console.log("Cookies negados.");
  };

  // Não renderiza nada se não for visível
  if (!isVisible) {
    return null;
  }

  // Renderiza o banner
  return (
    // Banner fixo na parte inferior, sobrepondo outros elementos (z-50)
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#d4c4b0] shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Texto explicativo */}
        <div className="flex-grow text-sm text-[#4a3629]">
          <Cookie className="inline-block w-5 h-5 mr-2 mb-1 text-[#a16535]" />
          Utilizamos cookies essenciais para o funcionamento do site e, opcionalmente, cookies de desempenho para melhorar sua experiência. Ao continuar, você concorda com o uso dos cookies essenciais. Saiba mais em nossa{' '}
          <button
            onClick={() => onNavigate('cookies')} // Usa a navegação interna
            className="text-[#a16535] hover:underline font-medium"
          >
            Política de Cookies
          </button>.
        </div>

        {/* Botões de Ação */}
        <div className="flex-shrink-0 flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecline}
            className="border-[#a16535] text-[#a16535] hover:bg-[#f6f3ee]"
          >
            Negar Opcionais
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="bg-[#a16535] hover:bg-[#8b5329] text-white"
          >
            Aceitar Todos
          </Button>
        </div>
      </div>
    </div>
  );
}