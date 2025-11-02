import React from 'react';
import { Scale, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Footer } from './Footer';

interface WelcomePageProps {
  onSystemAccess: () => void;
  onNavigate: (view: 'home' | 'dashboard' | 'clientes' | 'processos' | 'prazos' | 'contratos' | 'relatorios' | 'usuarios' | 'suporte' | 'termos' | 'privacidade' | 'cookies') => void;
}

export function WelcomePage({ onSystemAccess, onNavigate }: WelcomePageProps) {
  return (
    <div
      className="w-full min-h-screen flex flex-col bg-[#f6f3ee]"
      style={{
        '--banner-height': '48px',
        '--banner-height-v2': '40px',
        '--full-height-with-banner': 'calc(100dvh - var(--banner-height))',
        '--100dvw': '100dvw',
        '--100dvh': '100dvh',
        '--font-sans': 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        '--font-mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSynthesis: 'none',
        textAlign: 'left' as const,
        fontFamily: 'var(--font-sans)',
        fontSize: '16px',
        lineHeight: 'inherit',
        color: '#2d1f16',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      } as React.CSSProperties}
    >
      {/* Container principal */}
      <div
        className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12"
        style={{ minHeight: 'var(--full-height-with-banner)' }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 space-y-6 sm:space-y-8">

          {/* Logo + Título */}
          <div className="flex flex-col items-center space-y-4 text-center pt-6 sm:pt-8">
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-[#a16535] p-2.5 sm:p-3 rounded-lg shadow-lg">
                  <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-[#f6f3ee]" />
                </div>
                <h1 className="text-3xl sm:text-5xl text-[#2d1f16] tracking-tight font-bold">
                  JURIS <span className="text-[#a16535]">FÁCIL</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Linha branca separadora */}
          <div className="w-full h-0.5 bg-white my-4 sm:my-6"></div>

          {/* Textos + Botão */}
          <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center">
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-[#4a3629] max-w-2xl text-base sm:text-lg">
                Soluções jurídicas completas para você e seu escritório.
              </p>
              <p className="text-[#6b5544] max-w-2xl text-sm sm:text-base">
                Expertise, confiança e resultados.
              </p>
            </div>

            {/* Botão Acessar Sistema */}
            <Button
              onClick={onSystemAccess}
              className="inline-flex items-center justify-center gap-2 text-sm font-medium h-10 rounded-md bg-[#a16535] hover:bg-[#8b5329] text-white px-6 sm:px-8 py-5 sm:py-6 shadow-xl shadow-[#a16535]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#a16535]/40"
            >
              Acessar Sistema
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Imagem com Overlay + Estatísticas */}
          <div className="relative">
            {/* Blur de fundo */}
            <div className="absolute inset-0 bg-[#a16535] rounded-2xl blur-3xl opacity-15 -z-10"></div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#d4c4b0]">
              <img
                src="/src/assets/Welcome.jpeg"
                alt="Escritório de Advocacia Sofisticado"
                className="w-full h-48 sm:h-64 md:h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d1f16]/90 via-[#2d1f16]/50 to-transparent"></div>

              {/* Estatísticas - Responsivas */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-12 text-white text-center">
                  <div>
                    <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-[#e8b882]">500+</span>
                    <span className="block text-xs sm:text-sm md:text-base text-white/80 mt-0.5 sm:mt-1 uppercase tracking-wide">Casos resolvidos</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-[#e8b882]">98%</span>
                    <span className="block text-xs sm:text-sm md:text-base text-white/80 mt-0.5 sm:mt-1 uppercase tracking-wide">Taxa de sucesso</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-[#e8b882]">24/7</span>
                    <span className="block text-xs sm:text-sm md:text-base text-white/80 mt-0.5 sm:mt-1 uppercase tracking-wide">Atendimento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Oficial */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
