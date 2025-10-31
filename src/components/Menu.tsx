// src/components/Menu.tsx
// Este é o menu de navegação (Top Nav)

import { useState } from 'react';
import { Button } from './ui/button';
import {
  UserSquare2, FileText, Calendar, FileSignature, FileBarChart, Users, BarChart3,
  HomeIcon, 
  LifeBuoy  
} from 'lucide-react'; 

interface MenuProps {
  activeView: string;
  userTipo: string;
  onNavigate: (view: 'home' | 'dashboard' | 'clientes' | 'processos' | 'prazos' | 'contratos' | 'relatorios' | 'usuarios' | 'suporte') => void;
}

const menuItems = [
  { view: 'home', label: 'Página Inicial', icon: HomeIcon }, 
  { view: 'clientes', label: 'Clientes', icon: UserSquare2 },
  { view: 'processos', label: 'Processos', icon: FileText },
  { view: 'prazos', label: 'Prazos e Audiências', icon: Calendar },
  { view: 'contratos', label: 'Contratos de Honorários', icon: FileSignature },
  { view: 'relatorios', label: 'Relatórios', icon: FileBarChart },
  { view: 'usuarios', label: 'Usuários', icon: Users, adminOnly: true },
  { view: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { view: 'suporte', label: 'Suporte', icon: LifeBuoy }, 
];


export default function Menu({ activeView, userTipo, onNavigate }: MenuProps) {
  
  // Função para estilizar o botão ativo/inativo
  const getButtonClass = (view: string) => {
    const activeStyle = 'text-[#a16535] border-b-2 border-[#a16535]'; 
    const inactiveStyle = 'text-[#4a3629] hover:text-[#a16535] hover:border-b-2 hover:border-[#a16535] transition-colors';
    // Remove o 'rounded-lg' para um visual reto
    return `h-full py-2 flex items-center space-x-2 font-medium bg-transparent rounded-none ${activeView === view ? activeStyle : inactiveStyle}`;
  };

  return (
    // A tag <nav> ocupa toda a largura, mas o conteúdo é centralizado com max-w
    <nav className="hidden md:flex flex-row justify-center items-stretch h-12 bg-white px-0 z-10 w-full">
        {/* Container Centralizado para o Menu */}
        
        {/* **** ALTERAÇÃO AQUI **** */}
        {/* Mudei 'justify-start' para 'justify-center' */}
        <div className="max-w-7xl w-full flex justify-center items-center h-full px-6 mx-auto">
            
            {menuItems
                .filter(item => !item.adminOnly || userTipo === 'administrador')
                .map(item => (
                    <Button
                        key={item.view}
                        variant="ghost"
                        onClick={() => onNavigate(item.view as any)}
                        // Mantém o padding 'px-6' para dar espaço entre os itens
                        className={`px-6 ${getButtonClass(item.view)}`} 
                    >
                        <item.icon className='w-4 h-4 mr-2' />
                        <span className="truncate">{item.label}</span>
                    </Button>
            ))}
        </div>
    </nav>
  );
}