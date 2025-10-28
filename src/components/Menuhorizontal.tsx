import * as React from 'react';
import { Button } from './ui/button';
import { Users, FileText, Calendar, FileSignature, FileBarChart, Shield, BarChart3, ArrowLeft, LogOut } from 'lucide-react';
import { Separator } from './ui/separator';

interface MenuProps {
  // O 'home' é a Landpage pós-login, mas mantemos o nome para consistência de navegação.
  activeView: 'home' | 'dashboard' | 'clientes' | 'processos' | 'prazos' | 'contratos' | 'relatorios' | 'usuarios';
  userTipo: string;
  onNavigate: (view: 'home' | 'dashboard' | 'clientes' | 'processos' | 'prazos' | 'contratos' | 'relatorios' | 'usuarios') => void;
}

// Usamos export default para ser importado corretamente no Dashboard.tsx
export default function Menu({ activeView, userTipo, onNavigate }: MenuProps) {
  
  const isViewActive = (view: string) => activeView === view;

  return (
    // ESTILO HORIZONTAL ORIGINAL
    <nav className="hidden md:block bg-white border-b-2 border-[#d4c4b0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-3">
          
          {/* Botões de Navegação */}
          <Button
            variant={isViewActive('clientes') ? 'default' : 'ghost'}
            onClick={() => onNavigate('clientes')}
            className={
              isViewActive('clientes')
                ? 'bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30 border-b-4 border-[#8b5329] transition-all duration-200'
                : 'text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535] transition-all duration-200 border-b-4 border-transparent'
            }
          >
            <Users className="w-4 h-4 mr-2" />
            Clientes
          </Button>
          <Button
            variant={isViewActive('processos') ? 'default' : 'ghost'}
            onClick={() => onNavigate('processos')}
            className={
              isViewActive('processos')
                ? 'bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30 border-b-4 border-[#8b5329] transition-all duration-200'
                : 'text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535] transition-all duration-200 border-b-4 border-transparent'
            }
          >
            <FileText className="w-4 h-4 mr-2" />
            Processos
          </Button>
          <Button
            variant={isViewActive('prazos') ? 'default' : 'ghost'}
            onClick={() => onNavigate('prazos')}
            className={
              isViewActive('prazos')
                ? 'bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30 border-b-4 border-[#8b5329] transition-all duration-200'
                : 'text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535] transition-all duration-200 border-b-4 border-transparent'
            }
          >
            <Calendar className="w-4 h-4 mr-2" />
            Prazos e Audiências
          </Button>
          <Button
            variant={isViewActive('contratos') ? 'default' : 'ghost'}
            onClick={() => onNavigate('contratos')}
            className={
              isViewActive('contratos')
                ? 'bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30 border-b-4 border-[#8b5329] transition-all duration-200'
                : 'text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535] transition-all duration-200 border-b-4 border-transparent'
            }
          >
            <FileSignature className="w-4 h-4 mr-2" />
            Contratos de Honorários
          </Button>
          <Button
            variant={isViewActive('relatorios') ? 'default' : 'ghost'}
            onClick={() => onNavigate('relatorios')}
            className={
              isViewActive('relatorios')
                ? 'bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30 border-b-4 border-[#8b5329] transition-all duration-200'
                : 'text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535] transition-all duration-200 border-b-4 border-transparent'
            }
          >
            <FileBarChart className="w-4 h-4 mr-2" />
            Relatórios
          </Button>

          {userTipo === 'administrador' && (
            <Button
              variant={isViewActive('usuarios') ? 'default' : 'ghost'}
              onClick={() => onNavigate('usuarios')}
              className={
                isViewActive('usuarios')
                  ? 'bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30 border-b-4 border-[#8b5329] transition-all duration-200'
                  : 'text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535] transition-all duration-200 border-b-4 border-transparent'
              }
            >
              <Shield className="w-4 h-4 mr-2" />
              Usuários
            </Button>
          )}

          <Button
            variant={isViewActive('dashboard') ? 'default' : 'ghost'}
            onClick={() => onNavigate('dashboard')}
            className={
              isViewActive('dashboard')
                ? 'bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30 border-b-4 border-[#8b5329] transition-all duration-200'
                : 'text-[#4a3629] hover:bg-[#f6f3ee] hover:text-[#a16535] transition-all duration-200 border-b-4 border-transparent'
            }
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          
        </div>
      </div>
    </nav>
  );
}
