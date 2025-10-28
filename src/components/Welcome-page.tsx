// src/components/Welcome-page.tsx
import React from 'react';
// Ícones necessários para esta página
import { Scale, ArrowRight } from 'lucide-react'; 
import { Button } from './ui/button';
// Não importamos mais o Footer principal aqui

interface WelcomePageProps {
  onAcessarSistema: () => void;
}

export function WelcomePage({ onAcessarSistema }: WelcomePageProps) {
  return (
    // Container geral da página
    <div className="w-full min-h-screen flex flex-col bg-[#f6f3ee]"> 
      
      {/* Conteúdo principal centralizado, ocupa espaço vertical */}
      <div className="flex-1 flex flex-col items-center justify-start pt-12 sm:pt-16 md:pt-20 p-4"> 
        
        {/* Limitador de largura para o conteúdo */}
        <div className="w-full max-w-xl lg:max-w-2xl text-center"> 

          {/* --- BLOCO DO LOGO E TÍTULO --- */}
          <div className="mb-8 md:mb-10">
            <div className="flex justify-center mb-4">
              <div className="bg-[#a16535] p-3 md:p-4 rounded-xl shadow-lg"> {/* Padding ajustado */}
                <Scale className="w-8 h-8 md:w-10 md:h-10 text-white" /> {/* Tamanho ajustado */}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl text-[#2d1f16] font-extrabold mb-1 tracking-tight">
              JURIS <span className="text-[#a16535]">FÁCIL</span>
            </h1>
            <p className="text-sm md:text-base text-[#6b5544]">Sistema de Gestão Jurídica</p>
          </div>

          {/* --- BLOCO DE TEXTOS E BOTÃO --- */}
          <div className="mb-8 md:mb-10 space-y-3 md:space-y-4"> {/* Espaçamento ajustado */}
            <h2 className="text-base md:text-lg text-[#4a3629] font-normal px-2"> {/* Padding horizontal pequeno */}
              Soluções jurídicas completas para você e seu escritório.
            </h2>
            <p className="text-sm text-[#6b5544] px-2">
              Expertise, confiança e resultados.
            </p>
            {/* Botão Acessar Sistema */}
            <div className="pt-2"> {/* Espaço acima do botão */}
              <Button
                onClick={onAcessarSistema}
                className="w-auto bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/40 transition-all duration-300 transform hover:scale-[1.03] text-sm px-6 py-2.5 font-semibold inline-flex items-center justify-center rounded-md" // rounded-md para cantos menos arredondados
              >
                Acessar Sistema
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* --- Área de Estatísticas (Imagem com Overlay) --- */}
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-[#d4c4b0]/50 w-full mx-auto"> {/* Borda mais sutil, cantos ajustados */}
            <img
              src="/src/assets/Welcome-Page.jpeg" // VERIFIQUE ESTE CAMINHO!
              alt="Escritório de Advocacia"
              className="object-cover w-full block" // block para remover espaço extra
              style={{ aspectRatio: '16/7', maxHeight: '450px' }} // Proporção e altura máxima
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2d1f16]/80 via-[#2d1f16]/40 to-transparent"></div>
            
            {/* Conteúdo das Estatísticas */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="grid grid-cols-3 gap-2 md:gap-4 text-white">
                <div className="text-center">
                  <span className="text-xl md:text-2xl font-bold block text-[#e8b882]">500+</span>
                  <span className="text-[10px] md:text-xs text-white/80 uppercase tracking-wide">Casos resolvidos</span> {/* Estilo ajustado */}
                </div>
                <div className="text-center">
                  <span className="text-xl md:text-2xl font-bold block text-[#e8b882]">98%</span>
                  <span className="text-[10px] md:text-xs text-white/80 uppercase tracking-wide">Taxa de sucesso</span> {/* Estilo ajustado */}
                </div>
                <div className="text-center">
                  <span className="text-xl md:text-2xl font-bold block text-[#e8b882]">24/7</span>
                  <span className="text-[10px] md:text-xs text-white/80 uppercase tracking-wide">Atendimento</span> {/* Estilo ajustado */}
                </div>
              </div>
            </div>
          </div>
        </div> {/* Fim do max-w container */}
      </div> {/* Fim do container principal do conteúdo */}

      {/* Footer Básico (Copyright e Desenvolvedores) */}
      <footer className="w-full py-6 text-center border-t border-[#d4c4b0]/50 mt-8 flex-shrink-0"> {/* Adicionado flex-shrink-0 */}
        <p className="text-sm text-[#6b5544] mb-2">© {new Date().getFullYear()} Sistema de Gestão Jurídica</p> {/* Ano dinâmico */}
        <p className="text-xs text-[#6b5544]">
          Desenvolvido por Alexandre Guzmán, Ana Paula Sena, Brayon Duarte, Gina Rocha e Salomão Lobato
        </p>
      </footer>

      {/* O Footer principal com links NÃO está incluído */}
      {/* <Footer onNavigate={dummyNavigate} /> */}

    </div> // Fim da div da página inteira
  );
}