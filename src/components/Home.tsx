import { useUsers } from '@/contexts/UsersContext';
import { AppView } from '@/types/navigation';
import {
  Scale, UserSquare2, FileText, Calendar, FileSignature, BookOpen, Gavel, Award, BarChart3, FileBarChart, HomeIcon, LifeBuoy, Users
} from 'lucide-react';

interface HomeProps {
  onNavigate: (view: AppView) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { currentUser } = useUsers();
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#a16535] to-[#8b5329] p-4 rounded-xl shadow-xl">
            <Scale className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="text-4xl text-[#2d1f16]">
          Bem-vindo(a) ao <span className="text-[#a16535]">Sistema Jurídico</span>
        </h2>
        <p className="text-lg text-[#6b5544] max-w-2xl mx-auto">
          {currentUser?.role === 'admin'
            ? 'Gerencie usuários, clientes, processos, prazos e contratos de forma eficiente e profissional.'
            : 'Gerencie seus clientes, processos, prazos e contratos de forma eficiente e profissional.'}
        </p>
      </div>

      {/* Hero Image e Stats (Imagem de topo) */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#d4c4b0]">
        <img
          src="https://images.unsplash.com/photo-1584556326561-c8746083993b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBvZmZpY2UlMjBib29rcyUyMGp1c3RpY2V8ZW58MXx8fHwxNzYwNzE3MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Escritório de Advocacia - Livros Jurídicos"
          className="w-full h-[450px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2d1f16]/90 via-[#2d1f16]/50 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div className="bg-[#a16535]/20 backdrop-blur-sm rounded-lg p-6 border border-[#e8b882]/30">
              <div className="flex items-center gap-3 mb-2">
                {/* Ícone de Clientes */}
                <UserSquare2 className="w-8 h-8 text-[#e8b882]" />
                <span className="text-3xl text-[#e8b882]">Clientes</span>
              </div>
              <p className="text-sm text-white/80">Gestão completa de clientes</p>
            </div>
            <div className="bg-[#a16535]/20 backdrop-blur-sm rounded-lg p-6 border border-[#e8b882]/30">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8 text-[#e8b882]" />
                <span className="text-3xl text-[#e8b882]">Processos</span>
              </div>
              <p className="text-sm text-white/80">Controle total dos processos</p>
            </div>
            <div className="bg-[#a16535]/20 backdrop-blur-sm rounded-lg p-6 border border-[#e8b882]/30">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-8 h-8 text-[#e8b882]" />
                <span className="text-3xl text-[#e8b882]">Prazos</span>
              </div>
              <p className="text-sm text-white/80">Nunca perca um prazo</p>
            </div>
          </div>
        </div>
      </div>


      {/* Quick Access Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {/* Helper array para criar botões de navegação */}
        {([
          // NOVO CARD: Página Inicial
          { view: 'home', Icon: HomeIcon, title: 'Página Inicial', subtitle: 'Voltar para a tela principal' },
          // ATUALIZADO: Ícone de Clientes
          { view: 'clientes', Icon: UserSquare2, title: 'Clientes', subtitle: 'Gerencie sua carteira de clientes' },
          { view: 'processos', Icon: FileText, title: 'Processos', subtitle: 'Acompanhe todos os processos' },
          { view: 'prazos', Icon: Calendar, title: 'Prazos', subtitle: 'Controle prazos e audiências' },
          { view: 'contratos', Icon: FileSignature, title: 'Contratos', subtitle: 'Gerencie contratos de honorários' },
          { view: 'relatorios', Icon: FileBarChart, title: 'Relatórios', subtitle: 'Exporte relatórios completos' },
          { view: 'dashboard', Icon: BarChart3, title: 'Dashboard', subtitle: 'Visão geral e métricas' },
        ] as const).map(({ view, Icon, title, subtitle }) => (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            className="group bg-white border-2 border-[#d4c4b0] rounded-xl p-6 hover:border-[#a16535] hover:shadow-xl hover:shadow-[#a16535]/20 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-[#f6f3ee] group-hover:bg-[#a16535] p-4 rounded-full transition-all duration-300">
                <Icon className="w-8 h-8 text-[#a16535] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-[#2d1f16] group-hover:text-[#a16535] transition-colors">{title}</h3>
              <p className="text-sm text-[#6b5544]">{subtitle}</p>
            </div>
          </button>
        ))}

        {/* Card de Usuários (condicional) */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => onNavigate('usuarios')}
            className="group bg-white border-2 border-[#d4c4b0] rounded-xl p-6 hover:border-[#a16535] hover:shadow-xl hover:shadow-[#a16535]/20 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-[#f6f3ee] group-hover:bg-[#a16535] p-4 rounded-full transition-all duration-300">
                {/* ATUALIZADO: Ícone de Usuários */}
                <Users className="w-8 h-8 text-[#a16535] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-[#2d1f16] group-hover:text-[#a16535] transition-colors">Usuários</h3>
              <p className="text-sm text-[#6b5544]">Gerencie acessos ao sistema</p>
            </div>
          </button>
        )}

        {/* NOVO CARD: Suporte */}
        <button
          onClick={() => onNavigate('suporte')}
          className="group bg-white border-2 border-[#d4c4b0] rounded-xl p-6 hover:border-[#a16535] hover:shadow-xl hover:shadow-[#a16535]/20 transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-[#f6f3ee] group-hover:bg-[#a16535] p-4 rounded-full transition-all duration-300">
              <LifeBuoy className="w-8 h-8 text-[#a16535] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-[#2d1f16] group-hover:text-[#a16535] transition-colors">Suporte</h3>
            <p className="text-sm text-[#6b5544]">Precisa de ajuda? Entre em contato</p>
          </div>
        </button>
      </div>

      {/* Informações Adicionais (Rodapé da Home) */}
      <div className="bg-gradient-to-br from-[#a16535] to-[#8b5329] rounded-2xl p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-[#e8b882]" />
            </div>
            <h4 className="text-xl">Organização</h4>
            <p className="text-sm text-white/80">Todos os dados organizados e acessíveis</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Gavel className="w-10 h-10 text-[#e8b882]" />
            </div>
            <h4 className="text-xl">Eficiência</h4>
            <p className="text-sm text-white/80">Aumente sua produtividade jurídica</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Award className="w-10 h-10 text-[#e8b882]" />
            </div>
            <h4 className="text-xl">Profissionalismo</h4>
            <p className="text-sm text-white/80">Gestão moderna e profissional</p>
          </div>
        </div>
      </div>
    </div>
  );
}
