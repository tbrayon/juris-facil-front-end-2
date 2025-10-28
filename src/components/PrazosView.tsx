import React, { useState, useMemo } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// ... (outros imports simulados) ...
// import { formatDateBR } from '../utils/formatters';

// --- INÍCIO DAS SIMULAÇÕES (MOCKS) ---
// Como não temos acesso aos arquivos ./ui/*, ../contexts/*, etc.,
// vamos criar componentes e hooks simulados para fazer o código funcionar.

// Mock para icones lucide-react
const LucideMock = ({ className = '', children, ...props }: React.SVGProps<SVGSVGElement> & { children?: React.ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide ${className}`}
    {...props}
  >
    {children || <circle cx="12" cy="12" r="10" />}
  </svg>
);

// --- CORREÇÃO: Adicionadas tipagens React.SVGProps<SVGSVGElement> ---
const Calendar = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></LucideMock>;
const Clock = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></LucideMock>;
const AlertCircle = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></LucideMock>;
const Search = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></LucideMock>;
const Eye = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></LucideMock>;
const Filter = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></LucideMock>;
const ArrowLeft = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></LucideMock>;


// Mock para ./ui/card
// --- CORREÇÃO: Adicionada tipagem React.HTMLAttributes<HTMLDivElement> ---
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={`border rounded-lg shadow-sm bg-white ${className}`} {...props} />;
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props} />;
const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className={`text-sm text-gray-500 ${className}`} {...props} />;
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={`p-6 ${className}`} {...props} />; // Removido pt-0

// Mock para ./ui/input
// --- CORREÇÃO: Adicionada tipagem ao forwardRef e props ---
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input'; // Adicionado displayName

// Mock para ./ui/label
// --- CORREÇÃO: Adicionada tipagem ao forwardRef e props ---
const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    ref={ref}
    {...props}
  />
));
Label.displayName = 'Label'; // Adicionado displayName

// Mock para ./ui/button
// --- CORREÇÃO: Adicionada interface de props e tipagem ao forwardRef ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'ghost' | 'default';
  size?: 'sm' | 'default';
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
      ${variant === 'outline' ? 'border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900' : (variant === 'ghost' ? 'hover:bg-gray-100 hover:text-gray-900' : 'bg-blue-600 text-white hover:bg-blue-700')}
      ${size === 'sm' ? 'h-9 px-3' : 'h-10 px-4 py-2'}
      ${className}`}
    ref={ref}
    {...props}
  />
));
Button.displayName = 'Button'; // Adicionado displayName

// Mock para ./ui/badge
// --- CORREÇÃO: Adicionada tipagem React.HTMLAttributes<HTMLSpanElement> ---
const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    {...props}
  />
);

// Mock para ./ui/select (Mock aprimorado para transformar em <select> nativo)
// --- CORREÇÃO: Adicionadas tipagens para props ---
const SelectItem = ({ value, children, className }: React.OptionHTMLAttributes<HTMLOptionElement>) => <option value={value} className={className}>{children}</option>;
const SelectTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const SelectValue = ({ placeholder }: { placeholder?: string }) => null; // Lógica movida para o mock 'Select'
const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// --- CORREÇÃO: Adicionada interface de props e tipagem React.ReactElement ---
interface SelectProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string; // Adicionada className para o select
}

const Select = ({ children, value, onValueChange, className }: SelectProps) => {
    const options = React.Children.toArray(children).flatMap(child => {
        if (!React.isValidElement(child)) return [];
        // Look inside SelectContent
        if (child.type === SelectContent) {
            return React.Children.toArray((child.props as { children: React.ReactNode }).children);
        }
        // Look inside SelectTrigger
        if (child.type === SelectTrigger) {
            return React.Children.toArray((child.props as { children: React.ReactNode }).children);
        }
        return [];
    })
    .filter(option => React.isValidElement(option))
    .map((option, index) => {
        if (option.type === SelectValue) {
            // Render the placeholder option
            // Usando "todos" como valor do placeholder, pois parece ser o padrão
            return <option key="placeholder" value="todos">{(option.props as { placeholder?: string }).placeholder}</option>;
        }
        if (option.type === SelectItem) {
            // Render the SelectItem, which is an <option>
            return React.cloneElement(option as React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>>, { key: option.key || index });
        }
        return null; // Ignorar outros elementos
    });

    return (
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onValueChange(e.target.value)}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        {options}
      </select>
    );
};


// Mock para ../utils/formatters
// --- CORREÇÃO: Adicionada tipagem para dateString ---
const formatDateBR = (dateString: string | null | undefined) => {
  if (!dateString) return '';
  try {
    // Usando uma data de referência "hoje" que seja consistente para os mocks
    const today = new Date('2025-10-27T12:00:00.000Z');
    const date = new Date(dateString);
    
    // Corrigindo o cálculo de 'hoje' para o fuso horário local
    const dataPrazo = new Date(dateString);
    dataPrazo.setUTCHours(0, 0, 0, 0); // Zera hora na data do prazo
    
    today.setUTCHours(0, 0, 0, 0); // Zera hora no "hoje"

    const diffTime = dataPrazo.getTime() - today.getTime();
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Lógica para 'HOJE'
    if (diasRestantes === 0) {
       // return `HOJE (${date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })})`;
       return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }

    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  } catch (e) {
    console.error("Erro formatando data:", e);
    return dateString;
  }
};

// Mock para ../contexts/ProcessosContext
// Data de referência: 2025-10-27
const mockProcessosData = [
  {
    id: '1',
    proximoPrazo: '2025-10-27T12:00:00.000Z', // Hoje
    numeroProcesso: '0001234-56.2025.8.26.0001',
    clienteNome: 'Empresa A',
    clienteDocumento: '12.345.678/0001-99',
    advogadoResponsavel: 'Dr. João Silva'
  },
  {
    id: '2',
    proximoPrazo: '2025-10-20T12:00:00.000Z', // Vencido (7 dias atrás)
    numeroProcesso: '0005678-12.2024.8.26.0002',
    clienteNome: 'Maria Oliveira',
    clienteDocumento: '123.456.789-00',
    advogadoResponsavel: 'Dra. Ana Costa'
  },
  {
    id: '3',
    proximoPrazo: '2025-10-30T12:00:00.000Z', // Próximos 7 dias (3 dias)
    numeroProcesso: '0009876-54.2025.8.26.0003',
    clienteNome: 'Carlos Pereira',
    clienteDocumento: '987.654.321-11',
    advogadoResponsavel: 'Dr. João Silva'
  },
    {
    id: '4',
    proximoPrazo: '2025-11-20T12:00:00.000Z', // Futuro
    numeroProcesso: '0004321-98.2025.8.26.0004',
    clienteNome: 'Empresa B',
    clienteDocumento: '98.765.432/0001-00',
    advogadoResponsavel: 'Dra. Beatriz Lima'
  },
  {
    id: '5',
    proximoPrazo: null, // Sem prazo
    numeroProcesso: '0001111-22.2025.8.26.0005',
    clienteNome: 'Pedro Martins',
    clienteDocumento: '111.222.333-44',
    advogadoResponsavel: 'Dr. João Silva'
  }
];

const useProcessos = () => {
  return { processos: mockProcessosData };
};
// --- FIM DAS SIMULAÇÕES (MOCKS) ---


interface PrazoInfo {
  id: string;
  data: string; // --- NOTA: data é string, mas mockProcessosData pode ter null ---
  numeroProcesso: string;
  cliente: string;
  clienteDocumento: string;
  tipo: string;
  advogado: string;
  diasRestantes: number;
  urgencia: 'vencido' | 'hoje' | 'proximos7' | 'futuro';
  processo: any;
}

interface PrazosViewProps {
  onVoltar: () => void;
}

// Garantir que PrazosView seja exportado como default ou App
function PrazosView({ onVoltar }: PrazosViewProps) {
  const { processos } = useProcessos();
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroUrgencia, setFiltroUrgencia] = useState<string>('todos');
  const [filtroAdvogado, setFiltroAdvogado] = useState<string>('todos');

  // Extrair e processar prazos dos processos
  const prazos = useMemo<PrazoInfo[]>(() => {
    // Definir "hoje" de forma consistente com os mocks
    const hoje = new Date('2025-10-27T12:00:00.000Z');
    hoje.setUTCHours(0, 0, 0, 0); // Usar UTC para consistência

    return processos
      .filter(p => p.proximoPrazo) // Isso filtra os nulos
      .map(processo => {
        // --- CORREÇÃO: processo.proximoPrazo não é nulo aqui devido ao filtro ---
        const dataPrazo = new Date(processo.proximoPrazo as string); 
        dataPrazo.setUTCHours(0, 0, 0, 0); // Usar UTC para consistência
        
        const diffTime = dataPrazo.getTime() - hoje.getTime();
        const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let urgencia: PrazoInfo['urgencia'];
        if (diasRestantes < 0) {
          urgencia = 'vencido';
        } else if (diasRestantes === 0) {
          urgencia = 'hoje';
        } else if (diasRestantes <= 7) {
          urgencia = 'proximos7';
        } else {
          urgencia = 'futuro';
        }

        return {
          id: processo.id,
          // --- CORREÇÃO: Cast para string, pois nulos foram filtrados ---
          data: processo.proximoPrazo as string, 
          numeroProcesso: processo.numeroProcesso,
          cliente: processo.clienteNome,
          clienteDocumento: processo.clienteDocumento,
          tipo: 'Audiência/Prazo',
          advogado: processo.advogadoResponsavel,
          diasRestantes,
          urgencia,
          processo,
        };
      })
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }, [processos]);

  // Aplicar filtros
  const prazosFiltrados = useMemo(() => {
    return prazos.filter(prazo => {
      const matchBusca = 
        prazo.numeroProcesso.toLowerCase().includes(termoBusca.toLowerCase()) ||
        prazo.cliente.toLowerCase().includes(termoBusca.toLowerCase()) ||
        prazo.clienteDocumento.includes(termoBusca);

      const matchUrgencia = 
        filtroUrgencia === 'todos' || prazo.urgencia === filtroUrgencia;

      const matchAdvogado = 
        filtroAdvogado === 'todos' || prazo.advogado === filtroAdvogado;

      return matchBusca && matchUrgencia && matchAdvogado;
    });
  }, [prazos, termoBusca, filtroUrgencia, filtroAdvogado]);

  // Estatísticas
  const stats = useMemo(() => {
    return {
      vencidos: prazos.filter(p => p.urgencia === 'vencido').length,
      hoje: prazos.filter(p => p.urgencia === 'hoje').length,
      proximos7: prazos.filter(p => p.urgencia === 'proximos7').length,
      futuros: prazos.filter(p => p.urgencia === 'futuro').length,
    };
  }, [prazos]);

  // Advogados únicos para filtro
  const advogados = useMemo(() => {
    const uniqueAdvogados = [...new Set(processos.map(p => p.advogadoResponsavel))];
    return uniqueAdvogados.filter(Boolean);
  }, [processos]);

  const getUrgenciaBadge = (urgencia: PrazoInfo['urgencia'], diasRestantes: number) => {
    switch (urgencia) {
      case 'vencido':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300 hover:bg-red-100">
            🔴 Vencido ({Math.abs(diasRestantes)} dias atrás)
          </Badge>
        );
      case 'hoje':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100">
            🟡 HOJE
          </Badge>
        );
      case 'proximos7':
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-100">
            🟠 {diasRestantes} {diasRestantes === 1 ? 'dia' : 'dias'}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300 hover:bg-green-100">
            🟢 {diasRestantes} dias
          </Badge>
        );
    }
  };

  const handleVerProcesso = (prazo: PrazoInfo) => {
    // Implementar navegação para o processo (pode adicionar modal ou navegação)
    console.log('Ver processo:', prazo.processo);
  };

  return (
    // {/* ALTERAÇÃO: Adicionado 'p-4' para dar espaçamento em telas pequenas */}
    <div className="max-w-7xl mx-auto p-4">
      {/* ALTERAÇÃO: 
        - 'flex-col sm:flex-row' empilha o header em telas pequenas
        - 'sm:items-center sm:justify-between' alinha os itens no layout de linha
        - 'gap-4' adiciona espaço quando empilhado
      */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[#2d1f16] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#a16535]" />
            Prazos e Audiências
          </h2>
          <p className="text-[#6b5544]">Acompanhe todos os prazos processuais e audiências</p>
        </div>
        <Button
          variant="outline"
          onClick={onVoltar}
          className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200 self-start sm:self-auto"
        >
          {/* ALTERAÇÃO: 'mr-0 sm:mr-2' remove a margem do ícone em telas pequenas */}
          <ArrowLeft className="w-4 h-4 mr-0 sm:mr-2" />
          {/* ALTERAÇÃO: 'hidden sm:inline' esconde o texto em telas pequenas, criando um botão de ícone */}
          <span className="hidden sm:inline">Página Inicial</span>
        </Button>
      </div>

      {/* Cards de Resumo */}
      {/* ALTERAÇÃO: Adicionado 'sm:grid-cols-2' para criar uma grade 2x2 em tablets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
        {/* --- INÍCIO DA CORREÇÃO DOS CARDS --- */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 hover:border-red-500 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => setFiltroUrgencia('vencido')}>
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
              <div className="text-center sm:text-left">
                <p className="text-red-700 text-sm mb-1">Vencidos</p>
                <p className="text-red-800 text-4xl">{stats.vencidos}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 hover:border-amber-500 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => setFiltroUrgencia('hoje')}>
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
              <div className="text-center sm:text-left">
                <p className="text-amber-700 text-sm mb-1">Hoje</p>
                <p className="text-amber-800 text-4xl">{stats.hoje}</p>
              </div>
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 hover:border-orange-500 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => setFiltroUrgencia('proximos7')}>
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
              <div className="text-center sm:text-left">
                <p className="text-orange-700 text-sm mb-1">Próximos 7 dias</p>
                <p className="text-orange-800 text-4xl">{stats.proximos7}</p>
              </div>
              <Calendar className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 hover:border-green-500 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => setFiltroUrgencia('futuro')}>
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
              <div className="text-center sm:text-left">
                <p className="text-green-700 text-sm mb-1">Futuros</p>
                <p className="text-green-800 text-4xl">{stats.futuros}</p>
              </div>
              <Calendar className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        {/* --- FIM DA CORREÇÃO DOS CARDS --- */}

      </div>

      {/* Filtros e Busca */}
      <Card className="bg-white border-2 border-[#d4c4b0] shadow-sm mb-6">
        {/* ... (Conteúdo dos filtros permanece o mesmo) ... */}
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-[#4a3629]">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b5544]" />
                <Input
                  type="text"
                  placeholder="Processo, cliente ou documento..."
                  value={termoBusca}
                  // --- CORREÇÃO: Tipagem do evento 'e' ---
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTermoBusca(e.target.value)}
                  className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#4a3629]">Urgência</Label>
              <Select value={filtroUrgencia} onValueChange={setFiltroUrgencia} className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Todos</SelectItem>
                  <SelectItem value="vencido" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🔴 Vencidos</SelectItem>
                  <SelectItem value="hoje" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🟡 Hoje</SelectItem>
                  <SelectItem value="proximos7" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🟠 Próximos 7 dias</SelectItem>
                  <SelectItem value="futuro" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🟢 Futuros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#4a3629]">Advogado</Label>
              <Select value={filtroAdvogado} onValueChange={setFiltroAdvogado} className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Todos</SelectItem>
                  {advogados.map(adv => (
                    <SelectItem key={adv} value={adv} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                      {adv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(filtroUrgencia !== 'todos' || filtroAdvogado !== 'todos' || termoBusca) && (
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFiltroUrgencia('todos');
                  setFiltroAdvogado('todos');
                  setTermoBusca('');
                }}
                /* ALTERAÇÃO: 'w-full sm:w-auto' torna o botão full-width em telas pequenas */
                className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200 w-full sm:w-auto"
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Prazos */}
      <Card className="bg-white border-2 border-[#d4c4b0] shadow-sm">
        <CardHeader className="border-b-2 border-[#d4c4b0] bg-gradient-to-r from-[#f6f3ee] to-white p-4 sm:p-6"> {/* Ajuste de padding responsivo */}
          <CardTitle className="text-[#2d1f16]">Lista de Prazos</CardTitle>
          <CardDescription className="text-[#6b5544]">
            {prazosFiltrados.length} prazo(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        
        {/* --- INÍCIO DA CORREÇÃO DA TABELA --- */}
        <CardContent className="p-0 sm:p-6">
          {prazosFiltrados.length > 0 ? (
            <>
              {/* Tabela para Desktop (Visível a partir de sm) */}
              <div className="overflow-x-auto hidden sm:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#d4c4b0]">
                      <th className="text-left p-2 sm:p-3 text-[#4a3629]">Data</th>
                      <th className="text-left p-2 sm:p-3 text-[#4a3629]">Processo</th>
                      <th className="text-left p-2 sm:p-3 text-[#4a3629]">Cliente</th>
                      <th className="text-left p-2 sm:p-3 text-[#4a3629]">Advogado</th>
                      <th className="text-left p-2 sm:p-3 text-[#4a3629]">Status</th>
                      <th className="text-right p-2 sm:p-3 text-[#4a3629]">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prazosFiltrados.map((prazo) => (
                      <tr 
                        key={prazo.id} 
                        className="border-b border-[#d4c4b0] hover:bg-[#f6f3ee] transition-colors"
                      >
                        <td className="p-2 sm:p-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#a16535]" />
                            <span className="text-[#2d1f16] text-sm">
                              {formatDateBR(prazo.data)}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 sm:p-3">
                          <span className="text-[#2d1f16] font-mono text-xs sm:text-sm">
                            {prazo.numeroProcesso}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3">
                          <div>
                            <p className="text-[#2d1f16] text-sm sm:text-base">{prazo.cliente}</p>
                            <p className="text-[#6b5544] text-xs sm:text-sm">{prazo.clienteDocumento}</p>
                          </div>
                        </td>
                        <td className="p-2 sm:p-3">
                          <span className="text-[#4a3629] text-sm sm:text-base">{prazo.advogado}</span>
                        </td>
                        <td className="p-2 sm:p-3">
                          {getUrgenciaBadge(prazo.urgencia, prazo.diasRestantes)}
                        </td>
                        <td className="p-2 sm:p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerProcesso(prazo)}
                            className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Lista de Cards para Mobile (Visível apenas em 'xs') */}
              <div className="block sm:hidden space-y-4 p-4">
                {prazosFiltrados.map((prazo) => (
                  <Card key={prazo.id} className="bg-[#f6f3ee] border-[#d4c4b0]">
                    <CardContent className="p-4">
                      {/* Linha 1: Processo e Ação */}
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[#2d1f16] font-mono text-sm font-semibold break-all pr-2">
                          {prazo.numeroProcesso}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerProcesso(prazo)}
                          className="text-[#a16535] hover:text-[#8b5329] hover:bg-white/50 p-1 h-auto flex-shrink-0"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Linha 2: Cliente */}
                      <div className="mb-3">
                        <p className="text-[#2d1f16] text-base">{prazo.cliente}</p>
                        <p className="text-[#6b5544] text-sm">{prazo.clienteDocumento}</p>
                      </div>

                      {/* Linha 3: Advogado e Data */}
                      <div className="flex flex-wrap justify-between items-center text-sm mb-3 gap-2">
                        <span className="text-[#4a3629]">
                          {prazo.advogado}
                        </span>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#a16535]" />
                          <span className="text-[#2d1f16] font-medium">
                            {formatDateBR(prazo.data)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Linha 4: Status Badge */}
                      <div>
                        {getUrgenciaBadge(prazo.urgencia, prazo.diasRestantes)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 px-4"> {/* Adicionado px-4 */}
              <Calendar className="w-12 h-12 text-[#d4c4b0] mx-auto mb-4" />
              <p className="text-[#6b5544]">
                {termoBusca || filtroUrgencia !== 'todos' || filtroAdvogado !== 'todos'
                  ? 'Nenhum prazo encontrado com os filtros aplicados.'
                  : 'Nenhum prazo cadastrado ainda.'}
              </p>
            </div>
          )}
        </CardContent>
        {/* --- FIM DA CORREÇÃO DA TABELA --- */}
      </Card>
    </div>
  );
}

// Adicionar exportação default para o ambiente de preview
export default PrazosView;

