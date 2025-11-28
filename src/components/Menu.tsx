import React from 'react';
import {
  HomeIcon,
  UserSquare2,
  FileText,
  Calendar,
  FileSignature,
  FileBarChart,
  Users,
  BarChart3,
  LifeBuoy
} from 'lucide-react';
import { useUsers } from '@/contexts/UsersContext';

interface MenuProps {
  activeView: string;
  onNavigate: (
    view:
      | 'home'
      | 'clientes'
      | 'processos'
      | 'prazos'
      | 'contratos'
      | 'relatorios'
      | 'usuarios'
      | 'dashboard'
      | 'suporte'
  ) => void;
}

export default function Menu({ activeView, onNavigate }: MenuProps) {
  const { currentUser } = useUsers();
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const menuItems = [
    { view: 'home', label: 'Página Inicial', icon: HomeIcon },
    {
      view: 'clientes',
      label: 'Clientes',
      icon: isMobile ? UserSquare2 : Users
    },
    { view: 'processos', label: 'Processos', icon: FileText },
    // { view: 'prazos', label: 'Prazos e Audiências', icon: Calendar },
    { view: 'contratos', label: 'Contratos de Honorários', icon: FileSignature },
    { view: 'relatorios', label: 'Relatórios', icon: FileBarChart },
    { view: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    {
      view: 'usuarios',
      label: 'Usuários',
      icon: isMobile ? Users : UserSquare2,
      adminOnly: true
    },
    { view: 'suporte', label: 'Suporte', icon: LifeBuoy }
  ];

  const filteredItems = menuItems.filter(
    (item) => !item.adminOnly || currentUser?.role === 'admin'
  );

  return (
    <div
      className="sticky top-0 z-40 w-full bg-white border-b border-[#d4c4b0]"
      style={{
        '--banner-height': '48px',
        '--spacing': '.25rem',
        height: 'var(--banner-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'auto',
        paddingTop: '20 px',
        margin: '20 px',
      } as React.CSSProperties}
    >
      <div
        className="flex gap-1 h-full items-center"
        style={{ paddingTop: '20px', paddingBottom: '20px' }}
      >
        {filteredItems.map((item) => {
          const isActive = activeView === item.view;

          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view as any)}
              className={`
                flex items-center gap-2 px-4 h-full min-w-fit whitespace-nowrap
                text-sm font-medium transition-all duration-200 rounded-md
                ${isActive
                  ? 'bg-[#a16535] text-white shadow-lg'
                  : 'text-[#4a3629] hover:text-[#a16535] hover:bg-[#f6f3ee]'
                }
                ${isActive
                  ? 'border-b-4 border-[#8b5329]'
                  : 'border-b-4 border-transparent'
                }
              `}
              style={{
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                height: '100%'
              }}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

