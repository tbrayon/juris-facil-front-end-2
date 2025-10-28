// src/components/Menu.tsx
// Este é o seu componente de SIDEBAR (Menu lateral)

import { useState } from 'react';
import { Button } from './ui/button';
import {
  HomeIcon, UserSquare2, Users, FileText, Calendar, FileSignature, BarChart3, FileBarChart, LifeBuoy, PanelLeftClose, PanelRightClose
} from 'lucide-react';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuProps {
  activeView: string;
  userTipo: string;
  onNavigate: (view: 'home' | 'dashboard' | 'clientes' | 'processos' | 'prazos' | 'contratos' | 'relatorios' | 'usuarios' | 'suporte') => void;
}

export default function Menu({ activeView, userTipo, onNavigate }: MenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getButtonClass = (view: string) => {
    const alignment = isMenuOpen ? 'justify-start' : 'justify-center';
    const activeStyle = 'bg-[#a16535] hover:bg-[#8b5329] text-white';
    const inactiveStyle = 'text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535]';
    return `w-full ${alignment} ${activeView === view ? activeStyle : inactiveStyle}`;
  };

  return (
    <TooltipProvider delayDuration={0}>
      {/* MUDANÇA: Removido 'h-screen', adicionado 'self-stretch' */}
      <aside className={
        `hidden md:flex flex-col ${isMenuOpen ? 'w-64' : 'w-20'}
         sticky top-0 self-stretch /* Stick within parent, fill height */
         p-3 pt-6 bg-white border-r-2 border-[#d4c4b0] space-y-2
         transition-all duration-300 ease-in-out z-10`
      }>

        {/* Botão de Abrir/Fechar Menu */}
        <Button
          variant="ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`mb-4 ${isMenuOpen ? 'self-end' : 'self-center'} text-[#a16535] hover:bg-[#f6f3ee] hover:text-[#a16535]`}
          size="icon"
        >
          {isMenuOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelRightClose className="w-5 h-5" />}
        </Button>

        {/* Botões de Navegação Principais */}
        <div className="flex flex-col space-y-2 flex-grow overflow-y-auto"> {/* Added overflow-y-auto here */}
            {/* --- Botão Home --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === 'home' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('home')}
                  className={getButtonClass('home')}
                  size={isMenuOpen ? 'default' : 'icon'}
                >
                  <HomeIcon className={isMenuOpen ? 'w-4 h-4 mr-2' : 'w-5 h-5'} />
                  {isMenuOpen && <span className="truncate">Página Inicial</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={isMenuOpen}>
                <p>Página Inicial</p>
              </TooltipContent>
            </Tooltip>

            {/* --- Botão Clientes --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === 'clientes' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('clientes')}
                  className={getButtonClass('clientes')}
                  size={isMenuOpen ? 'default' : 'icon'}
                >
                  <UserSquare2 className={isMenuOpen ? 'w-4 h-4 mr-2' : 'w-5 h-5'} />
                  {isMenuOpen && <span className="truncate">Clientes</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={isMenuOpen}>
                <p>Clientes</p>
              </TooltipContent>
            </Tooltip>

             {/* --- Botão Processos --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === 'processos' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('processos')}
                  className={getButtonClass('processos')}
                  size={isMenuOpen ? 'default' : 'icon'}
                >
                  <FileText className={isMenuOpen ? 'w-4 h-4 mr-2' : 'w-5 h-5'} />
                  {isMenuOpen && <span className="truncate">Processos</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={isMenuOpen}>
                <p>Processos</p>
              </TooltipContent>
            </Tooltip>

            {/* --- Botão Prazos e Audiências --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === 'prazos' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('prazos')}
                  className={getButtonClass('prazos')}
                  size={isMenuOpen ? 'default' : 'icon'}
                >
                  <Calendar className={isMenuOpen ? 'w-4 h-4 mr-2' : 'w-5 h-5'} />
                  {isMenuOpen && <span className="truncate">Prazos e Audiências</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={isMenuOpen}>
                <p>Prazos e Audiências</p>
              </TooltipContent>
            </Tooltip>

            {/* --- Botão Contratos --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === 'contratos' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('contratos')}
                  className={getButtonClass('contratos')}
                  size={isMenuOpen ? 'default' : 'icon'}
                >
                  <FileSignature className={isMenuOpen ? 'w-4 h-4 mr-2' : 'w-5 h-5'} />
                  {isMenuOpen && <span className="truncate">Contratos</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={isMenuOpen}>
                <p>Contratos de Honorários</p>
              </TooltipContent>
            </Tooltip>

            {/* --- Botão Relatórios --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === 'relatorios' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('relatorios')}
                  className={getButtonClass('relatorios')}
                  size={isMenuOpen ? 'default' : 'icon'}
                >
                  <FileBarChart className={isMenuOpen ? 'w-4 h-4 mr-2' : 'w-5 h-5'} />
                  {isMenuOpen && <span className="truncate">Relatórios</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={isMenuOpen}>
                <p>Relatórios</p>
              </TooltipContent>
            </Tooltip>

            {/* --- Botão Usuários --- */}
            {userTipo === 'administrador' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeView === 'usuarios' ? 'default' : 'ghost'}
                    onClick={() => onNavigate('usuarios')}
                    className={getButtonClass('usuarios')}
                    size={isMenuOpen ? 'default' : 'icon'}
                  >
                    <Users className={isMenuOpen ? 'w-4 h-4 mr-2' : 'w-5 h-5'} />
                    {isMenuOpen && <span className="truncate">Usuários</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" hidden={isMenuOpen}>
                  <p>Usuários</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* --- Botão Dashboard --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('dashboard')}
                  className={getButtonClass('dashboard')}
                  size={isMenuOpen ? 'default' : 'icon'}
                >
                  <BarChart3 className={isMenuOpen ? 'w-4 h-4 mr-2' : 'w-5 h-5'} />
                  {isMenuOpen && <span className="truncate">Dashboard</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={isMenuOpen}>
                <p>Dashboard</p>
              </TooltipContent>
            </Tooltip>
        </div> {/* Fim dos botões principais */}

        {/* Div separada para o botão Suporte */}
        <div className="mt-auto pt-2 flex-shrink-0"> {/* Add flex-shrink-0 */}
            {/* --- Botão Suporte --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === 'suporte' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('suporte')}
                  className={getButtonClass('suporte')}
                  size={isMenuOpen ? 'default' : 'icon'}
                >
                  <LifeBuoy className={isMenuOpen ? 'w-4 h-4 mr-2' : 'w-5 h-5'} />
                  {isMenuOpen && <span className="truncate">Suporte</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={isMenuOpen}>
                <p>Suporte</p>
              </TooltipContent>
            </Tooltip>
        </div>

      </aside>
    </TooltipProvider>
  );
}