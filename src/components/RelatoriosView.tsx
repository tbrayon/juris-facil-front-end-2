import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useClientes, Cliente } from '../contexts/ClientesContext';
import { useProcessos, Processo } from '../contexts/ProcessosContext';
import { FileText, Users, Search, Eye, Edit, Download, X, Mail, Phone, MapPin, Calendar, FileCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { formatDateBR, getLocalDateString, formatCPF, formatCNPJ } from '../utils/formatters';

const estadosBrasileiros = [
  { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' },
];

interface RelatoriosViewProps {
  onEditarCliente: (clienteId: string) => void;
  onEditarProcesso: (processoId: string) => void;
  onVoltar: () => void;
}

export function RelatoriosView({ onEditarCliente, onEditarProcesso, onVoltar }: RelatoriosViewProps) {
  const { clientes } = useClientes();
  const { processos } = useProcessos();

  const [buscaClientes, setBuscaClientes] = useState('');
  const [buscaProcessos, setBuscaProcessos] = useState('');

  // Filtros
  const [filtroTipoCliente, setFiltroTipoCliente] = useState<string>('todos');
  const [filtroCidade, setFiltroCidade] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroFase, setFiltroFase] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('todos');
  const [filtroTipoAcao, setFiltroTipoAcao] = useState<string>('todos');

  // Dialogs
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [processoSelecionado, setProcessoSelecionado] = useState<Processo | null>(null);
  const [dialogClienteAberto, setDialogClienteAberto] = useState(false);
  const [dialogProcessoAberto, setDialogProcessoAberto] = useState(false);

  // === FILTROS ÚNICOS ===
  const cidadesUnicas = Array.from(new Set(clientes.map(c => c.municipio)))
    .filter((s): s is string => Boolean(s))
    .sort();

  const fasesUnicas = Array.from(new Set(processos.map(p => p.faseProcessual)))
    .filter((s): s is string => Boolean(s))
    .sort();

  const statusUnicos = Array.from(new Set(processos.map(p => p.status)))
    .filter((s): s is string => Boolean(s))
    .sort();

  const prioridadesUnicas = Array.from(new Set(processos.map(p => p.prioridade)))
    .filter((s): s is string => Boolean(s))
    .sort();

  const tiposAcaoUnicos = Array.from(new Set(processos.map(p => p.tipoAcao)))
    .filter((s): s is string => Boolean(s))
    .sort();

  // === FILTRAGEM ===
  const clientesFiltrados = clientes.filter((cliente: Cliente) => {
    const matchBusca = cliente.nome.toLowerCase().includes(buscaClientes.toLowerCase());
    const matchTipo = filtroTipoCliente === 'todos' || cliente.tipo === filtroTipoCliente;
    const matchCidade = filtroCidade === 'todos' || cliente.municipio === filtroCidade;
    const matchEstado = filtroEstado === 'todos' || cliente.uf === filtroEstado;
    return matchBusca && matchTipo && matchCidade && matchEstado;
  });

  const processosFiltrados = processos.filter((processo: Processo) => {
    const matchBusca =
      (processo.numeroProcesso?.includes(buscaProcessos)) ||
      processo.clienteNome.toLowerCase().includes(buscaProcessos.toLowerCase()) ||
      processo.tipoAcao.toLowerCase().includes(buscaProcessos.toLowerCase());

    const matchFase = filtroFase === 'todos' || processo.faseProcessual === filtroFase;
    const matchStatus = filtroStatus === 'todos' || processo.status === filtroStatus;
    const matchPrioridade = filtroPrioridade === 'todos' || processo.prioridade === filtroPrioridade;
    const matchTipoAcao = filtroTipoAcao === 'todos' || processo.tipoAcao === filtroTipoAcao;

    return matchBusca && matchFase && matchStatus && matchPrioridade && matchTipoAcao;
  });

  // === FUNÇÕES AUXILIARES ===
  const getTipoCliente = (tipo: 'cpf' | 'cnpj') => tipo === 'cpf' ? 'Pessoa Física' : 'Pessoa Jurídica';

  const handleVisualizarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setDialogClienteAberto(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    onEditarCliente(cliente.id);
  };

  const handleVisualizarProcesso = (processo: Processo) => {
    setProcessoSelecionado(processo);
    setDialogProcessoAberto(true);
  };

  const handleEditarProcesso = (processo: Processo) => {
    onEditarProcesso(processo.id);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { color: string; label: string }> = {
      'Em elaboração': { color: 'bg-purple-100 text-purple-800 border-purple-300', label: 'Em elaboração' },
      'Pendente de distribuição': { color: 'bg-indigo-100 text-indigo-800 border-indigo-300', label: 'Pendente' },
      'Ativo': { color: 'bg-green-100 text-green-800 border-green-300', label: 'Ativo' },
      'Suspenso': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Suspenso' },
      'Finalizado acordo': { color: 'bg-amber-100 text-amber-800 border-amber-300', label: 'Acordo' },
      'Finalizado procedente': { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', label: 'Procedente' },
      'Finalizado parcialmente procedente': { color: 'bg-blue-100 text-blue-800 border-blue-300', label: 'Parcial' },
      'Finalizado improcedente': { color: 'bg-red-100 text-red-800 border-red-300', label: 'Improcedente' },
      'em-elaboracao': { color: 'bg-purple-100 text-purple-800 border-purple-300', label: 'Em elaboração' },
      'pendente-de-distribuicao': { color: 'bg-indigo-100 text-indigo-800 border-indigo-300', label: 'Pendente' },
      'ativo': { color: 'bg-green-100 text-green-800 border-green-300', label: 'Ativo' },
      'suspenso': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Suspenso' },
      'finalizado-acordo': { color: 'bg-amber-100 text-amber-800 border-amber-300', label: 'Acordo' },
      'finalizado-procedente': { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', label: 'Procedente' },
      'finalizado-parcialmente-procedente': { color: 'bg-blue-100 text-blue-800 border-blue-300', label: 'Parcial' },
      'finalizado-improcedente': { color: 'bg-red-100 text-red-800 border-red-300', label: 'Improcedente' },
    };
    const s = map[status] || { color: 'bg-gray-100 text-gray-800 border-gray-300', label: status };
    return <Badge className={`${s.color} border text-xs font-medium px-3 py-1 rounded-full`}>{s.label}</Badge>;
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return <Badge className="bg-red-100 text-red-800 border-red-300 text-xs font-medium px-3 py-1 rounded-full">Urgente</Badge>;
      case 'alta': return <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs font-medium px-3 py-1 rounded-full">Alta</Badge>;
      case 'normal': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs font-medium px-3 py-1 rounded-full">Normal</Badge>;
      case 'baixa': return <Badge className="bg-green-100 text-green-800 border-green-300 text-xs font-medium px-3 py-1 rounded-full">Baixa</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800 border-gray-300 text-xs font-medium px-3 py-1 rounded-full">{prioridade}</Badge>;
    }
  };

  // === EXPORTAÇÃO CSV ===
  const exportarRelatorioClientes = () => {
    const csv = [
      ['Nome', 'Tipo', 'Cidade', 'Estado'].join(';'),
      ...clientesFiltrados.map(c => [c.nome, getTipoCliente(c.tipo), c.municipio || '', c.uf || ''].join(';'))
    ].join('\n');
    downloadCSV(csv, `relatorio_clientes_${getLocalDateString()}.csv`);
  };

  const exportarRelatorioProcessos = () => {
    const csv = [
      ['Número', 'Cliente', 'Tipo de Ação', 'Fase', 'Status', 'Prioridade', 'Tribunal', 'Valor da Causa'].join(';'),
      ...processosFiltrados.map(p => [
        p.numeroProcesso || '(Sem número)',
        p.clienteNome,
        p.tipoAcao,
        p.faseProcessual,
        p.status,
        p.prioridade,
        p.tribunal || '',
        p.valorCausa || ''
      ].join(';'))
    ].join('\n');
    downloadCSV(csv, `relatorio_processos_${getLocalDateString()}.csv`);
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[#2d1f16] flex items-center gap-2 text-xl sm:text-2xl font-bold">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#a16535]" />
              Relatórios
            </h2>
            <p className="text-[#6b5544] text-sm sm:text-base">Visualize e exporte relatórios de clientes e processos</p>
          </div>
          <Button
            variant="outline"
            onClick={onVoltar}
            className="!bg-white !text-[#a16535] border-2 border-[#955d30] hover:!bg-[#a16535] hover:!text-white transition-all duration-200 w-full sm:w-auto text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Página Inicial
          </Button>
        </div>
      </div>

      <Tabs defaultValue="clientes" className="space-y-5">
        <TabsList className="grid w-full grid-cols-2 bg-[#f6f3ee] border-2 border-[#d4c4b0] p-1 rounded-full h-12">
          <TabsTrigger value="clientes" className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full text-xs sm:text-sm">
            <Users className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Relatório de </span>Clientes
          </TabsTrigger>
          <TabsTrigger value="processos" className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full text-xs sm:text-sm">
            <FileText className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Relatório de </span>Processos
          </TabsTrigger>
        </TabsList>

        {/* === CLIENTES === */}
        <TabsContent value="clientes">
          <Card className="bg-white border-[#d4c4b0] shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-[#2d1f16] text-lg sm:text-xl">Clientes Cadastrados</CardTitle>
                  <CardDescription className="text-[#6b5544] text-sm">
                    Total de {clientesFiltrados.length} cliente(s)
                  </CardDescription>
                  <p className="text-xs text-[#a16535] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Dados sensíveis ocultos (LGPD)
                  </p>
                </div>
                <Button onClick={exportarRelatorioClientes} disabled={clientesFiltrados.length === 0}
                  className="bg-[#a16535] hover:bg-[#8b5329] text-white w-full sm:w-auto text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="mb-5 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5544] w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome do cliente"
                    value={buscaClientes}
                    onChange={e => setBuscaClientes(e.target.value)}
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] focus:border-[#2567f7] text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Filtro Tipo Cliente */}
                  <Select value={filtroTipoCliente} onValueChange={setFiltroTipoCliente}>
                    <SelectTrigger className={`
                      bg-[#f6f3ee] border-[#d4c4b0] text-sm transition-all duration-200
                      focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                      ${filtroTipoCliente !== 'todos'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'hover:bg-blue-500/10 hover:text-blue-600'
                      }
                    `}>
                      <SelectValue placeholder="Tipo de Cliente" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                      <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                        Todos
                      </SelectItem>
                      <SelectItem value="cpf" className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                        Pessoa Física
                      </SelectItem>
                      <SelectItem value="cnpj" className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                        Pessoa Jurídica
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filtro Cidade */}
                  <Select value={filtroCidade} onValueChange={setFiltroCidade}>
                    <SelectTrigger className={`
                      bg-[#f6f3ee] border-[#d4c4b0] text-sm transition-all duration-200
                      focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                      ${filtroCidade !== 'todos'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'hover:bg-blue-500/10 hover:text-blue-600'
                      }
                    `}>
                      <SelectValue placeholder="Cidade" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                      <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                        Todas as Cidades
                      </SelectItem>
                      {cidadesUnicas.map(c => (
                        <SelectItem
                          key={c}
                          value={c}
                          className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                        >
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Filtro Estado */}
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className={`
                      bg-[#f6f3ee] border-[#d4c4b0] text-sm transition-all duration-200
                      focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                      ${filtroEstado !== 'todos'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'hover:bg-blue-500/10 hover:text-blue-600'
                      }
                    `}>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#d4c4b0] shadow-lg max-h-60">
                      <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                        Todos
                      </SelectItem>
                      {estadosBrasileiros.map(e => (
                        <SelectItem
                          key={e.sigla}
                          value={e.sigla}
                          className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                        >
                          {e.sigla} - {e.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(filtroTipoCliente !== 'todos' || filtroCidade !== 'todos' || filtroEstado !== 'todos') && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    setFiltroTipoCliente('todos'); setFiltroCidade('todos'); setFiltroEstado('todos');
                  }} className="text-[#a16535] text-sm">
                    <X className="w-4 h-4 mr-1" /> Limpar
                  </Button>
                )}
              </div>

              {/* Mobile: Cards */}
              <div className="sm:hidden space-y-4">
                {clientesFiltrados.length === 0 ? (
                  <div className="text-center py-16 text-[#6b5544] bg-white rounded-xl border border-[#d4c4b0]/30">
                    <Users className="w-10 h-10 mx-auto mb-3 text-[#a16535]/50" />
                    <p className="font-medium">Nenhum cliente encontrado</p>
                  </div>
                ) : (
                  clientesFiltrados.map((cliente: Cliente) => (
                    <div key={cliente.id} className="bg-white border border-[#d4c4b0]/40 rounded-2xl p-5 shadow-sm hover:shadow transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#2d1f16] text-base truncate">{cliente.nome}</h4>
                          <p className="text-sm text-[#6b5544] mt-0.5 truncate">{cliente.municipio}/{cliente.uf}</p>
                        </div>
                        <div className="flex gap-1.5 ml-3">
                          <Button variant="ghost" size="icon" onClick={() => handleVisualizarCliente(cliente)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee] rounded-lg">
                            <Eye className="w-4.5 h-4.5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditarCliente(cliente)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee] rounded-lg">
                            <Edit className="w-4.5 h-4.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-[#6b5544] mr-2">Tipo:</span>
                          <Badge variant="outline" className="text-xs px-3 py-1 border-[#a16535] text-[#a16535] font-medium rounded-full">
                            {getTipoCliente(cliente.tipo)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop: Tabela */}
              <div className="hidden sm:block border border-[#d4c4b0] rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f6f3ee]">
                      <TableHead className="text-[#4a3629]">Nome</TableHead>
                      <TableHead className="text-[#4a3629]">Tipo</TableHead>
                      <TableHead className="text-[#4a3629]">Cidade/UF</TableHead>
                      <TableHead className="text-[#4a3629] text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesFiltrados.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center text-[#6b5544] py-8">Nenhum cliente</TableCell></TableRow>
                    ) : (
                      clientesFiltrados.map((cliente: Cliente) => (
                        <TableRow key={cliente.id} className="hover:bg-[#f6f3ee]/50">
                          <TableCell className="text-[#2d1f16] font-medium max-w-[200px] truncate">{cliente.nome}</TableCell>
                          <TableCell><Badge variant="outline" className="border-[#a16535] text-[#a16535] text-xs px-3 py-1 rounded-full">{getTipoCliente(cliente.tipo)}</Badge></TableCell>
                          <TableCell className="text-[#6b5544]">{cliente.municipio}/{cliente.uf}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleVisualizarCliente(cliente)} className="text-[#a16535] hover:bg-[#f6f3ee] h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditarCliente(cliente)} className="text-[#a16535] hover:bg-[#f6f3ee] h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === PROCESSOS === */}
        <TabsContent value="processos">
          <Card className="bg-white border-[#d4c4b0] shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-[#2d1f16] text-lg sm:text-xl">Processos Cadastrados</CardTitle>
                  <CardDescription className="text-[#6b5544] text-sm">
                    Total de {processosFiltrados.length} processo(s)
                  </CardDescription>
                </div>
                <Button onClick={exportarRelatorioProcessos} disabled={processosFiltrados.length === 0}
                  className="bg-[#a16535] hover:bg-[#8b5329] text-white w-full sm:w-auto text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="mb-5 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5544] w-4 h-4" />
                  <Input
                    placeholder="Buscar por número, cliente ou ação..."
                    value={buscaProcessos}
                    onChange={e => setBuscaProcessos(e.target.value)}
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] focus:border-[#2567f7] text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Fase */}
                  <div className="space-y-1">
                    <Label className="text-[#6b5544] text-xs">Fase</Label>
                    <Select value={filtroFase} onValueChange={setFiltroFase}>
                      <SelectTrigger className={`
                        bg-[#f6f3ee] border-[#d4c4b0] text-sm h-9 transition-all duration-200
                        focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                        ${filtroFase !== 'todos'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'hover:bg-blue-500/10 hover:text-blue-600'
                        }
                      `}>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                        <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                          Todas
                        </SelectItem>
                        {fasesUnicas.map(f => (
                          <SelectItem key={f} value={f} className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <Label className="text-[#6b5544] text-xs">Status</Label>
                    <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                      <SelectTrigger className={`
                        bg-[#f6f3ee] border-[#d4c4b0] text-sm h-9 transition-all duration-200
                        focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                        ${filtroStatus !== 'todos'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'hover:bg-blue-500/10 hover:text-blue-600'
                        }
                      `}>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                        <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                          Todos
                        </SelectItem>
                        {statusUnicos.map(s => (
                          <SelectItem key={s} value={s} className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Prioridade */}
                  <div className="space-y-1">
                    <Label className="text-[#6b5544] text-xs">Prioridade</Label>
                    <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
                      <SelectTrigger className={`
                        bg-[#f6f3ee] border-[#d4c4b0] text-sm h-9 transition-all duration-200
                        focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                        ${filtroPrioridade !== 'todos'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'hover:bg-blue-500/10 hover:text-blue-600'
                        }
                      `}>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                        <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                          Todas
                        </SelectItem>
                        {prioridadesUnicas.map(p => (
                          <SelectItem key={p} value={p} className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tipo de Ação */}
                  <div className="space-y-1">
                    <Label className="text-[#6b5544] text-xs">Tipo de Ação</Label>
                    <Select value={filtroTipoAcao} onValueChange={setFiltroTipoAcao}>
                      <SelectTrigger className={`
                        bg-[#f6f3ee] border-[#d4c4b0] text-sm h-9 transition-all duration-200
                        focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                        ${filtroTipoAcao !== 'todos'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'hover:bg-blue-500/10 hover:text-blue-600'
                        }
                      `}>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                        <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                          Todos
                        </SelectItem>
                        {tiposAcaoUnicos.map(t => (
                          <SelectItem key={t} value={t} className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {(filtroFase !== 'todos' || filtroStatus !== 'todos' || filtroPrioridade !== 'todos' || filtroTipoAcao !== 'todos') && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    setFiltroFase('todos'); setFiltroStatus('todos'); setFiltroPrioridade('todos'); setFiltroTipoAcao('todos');
                  }} className="text-[#a16535] text-sm">
                    <X className="w-4 h-4 mr-1" /> Limpar
                  </Button>
                )}
              </div>

              {/* Mobile: Cards - PROCESSOS */}
              <div className="sm:hidden space-y-4">
                {processosFiltrados.length === 0 ? (
                  <div className="text-center py-16 text-[#6b5544] bg-white rounded-xl border border-[#d4c4b0]/30">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-[#a16535]/50" />
                    <p className="font-medium">Nenhum processo encontrado</p>
                  </div>
                ) : (
                  processosFiltrados.map((processo: Processo) => (
                    <div key={processo.id} className="bg-white border border-[#d4c4b0]/40 rounded-2xl p-5 shadow-sm hover:shadow transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-lg font-bold text-[#2d1f16] tracking-tight truncate">
                            {processo.numeroProcesso || '(Sem número)'}
                          </p>
                          <p className="text-sm text-[#6b5544] mt-0.5 truncate">{processo.clienteNome}</p>
                        </div>
                        <div className="flex gap-1.5 ml-3">
                          <Button variant="ghost" size="icon" onClick={() => handleVisualizarProcesso(processo)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee] rounded-lg">
                            <Eye className="w-4.5 h-4.5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditarProcesso(processo)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee] rounded-lg">
                            <Edit className="w-4.5 h-4.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-[#6b5544]">Ação:</span>
                          <p className="text-sm font-medium text-[#2d1f16] truncate mt-0.5">{processo.tipoAcao}</p>
                        </div>
                        <div className="flex items-center ml-4">
                          <span className="text-xs font-medium text-[#6b5544] mr-2">Fase:</span>
                          <Badge variant="outline" className="text-xs px-3 py-1 border-[#a16535] text-[#a16535] font-medium rounded-full">
                            {processo.faseProcessual}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-[#6b5544] mr-2">Status:</span>
                          {getStatusBadge(processo.status)}
                        </div>
                        <div className="flex items-center ml-4">
                          <span className="text-xs font-medium text-[#6b5544] mr-2">Prioridade:</span>
                          {getPrioridadeBadge(processo.prioridade)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop: Tabela */}
              <div className="hidden sm:block border border-[#d4c4b0] rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f6f3ee]">
                      <TableHead className="text-[#4a3629]">Número</TableHead>
                      <TableHead className="text-[#4a3629]">Cliente</TableHead>
                      <TableHead className="text-[#4a3629]">Tipo de Ação</TableHead>
                      <TableHead className="text-[#4a3629]">Fase</TableHead>
                      <TableHead className="text-[#4a3629]">Status</TableHead>
                      <TableHead className="text-[#4a3629]">Prioridade</TableHead>
                      <TableHead className="text-[#4a3629] text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processosFiltrados.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center text-[#6b5544] py-8">Nenhum processo</TableCell></TableRow>
                    ) : (
                      processosFiltrados.map((processo: Processo) => (
                        <TableRow key={processo.id} className="hover:bg-[#f6f3ee]/50">
                          <TableCell className="text-[#2d1f16] font-medium font-mono max-w-[120px] truncate">
                            {processo.numeroProcesso || <span className="text-[#6b5544] italic">(Sem número)</span>}
                          </TableCell>
                          <TableCell className="text-[#6b5544] max-w-[200px] truncate">{processo.clienteNome}</TableCell>
                          <TableCell className="text-[#6b5544] max-w-[150px] truncate">{processo.tipoAcao}</TableCell>
                          <TableCell><Badge variant="outline" className="border-[#a16535] text-[#a16535] text-xs px-3 py-1 rounded-full">{processo.faseProcessual}</Badge></TableCell>
                          <TableCell>{getStatusBadge(processo.status)}</TableCell>
                          <TableCell>{getPrioridadeBadge(processo.prioridade)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleVisualizarProcesso(processo)} className="text-[#a16535] hover:bg-[#f6f3ee] h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditarProcesso(processo)} className="text-[#a16535] hover:bg-[#f6f3ee] h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* === DIALOG CLIENTE === */}
      <Dialog open={dialogClienteAberto} onOpenChange={setDialogClienteAberto}>
        <DialogContent className="bg-white border-2 border-[#d4c4b0] max-w-3xl w-[95vw] max-h-[85vh] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16] flex items-center gap-2 text-lg sm:text-xl">
              <Users className="w-5 h-5 text-[#a16535]" />
              Detalhes do Cliente
            </DialogTitle>
            <DialogDescription className="text-[#6b5544] text-sm">
              Visualização completa dos dados cadastrais
            </DialogDescription>
          </DialogHeader>
          {clienteSelecionado && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold text-base sm:text-lg">
                    <Users className="w-4 h-4 text-[#a16535]" />
                    Dados Pessoais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="md:col-span-2">
                      <Label className="text-[#6b5544] text-sm font-medium">Nome</Label>
                      <p className="text-[#2d1f16] font-medium text-base">{clienteSelecionado.nome}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Tipo</Label>
                      <p className="text-[#2d1f16] text-sm">{getTipoCliente(clienteSelecionado.tipo)}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">{clienteSelecionado.tipo === 'cpf' ? 'CPF' : 'CNPJ'}</Label>
                      <p className="text-[#2d1f16] font-mono text-sm">
                        {clienteSelecionado.tipo === 'cpf'
                          ? formatCPF(clienteSelecionado.documento)
                          : formatCNPJ(clienteSelecionado.documento)}
                      </p>
                    </div>
                    <div className="break-words">
                      <Label className="text-[#6b5544] text-sm font-medium">Email</Label>
                      <p className="text-[#2d1f16] flex items-center gap-1 break-all text-sm">
                        <Mail className="w-3 h-3 text-[#a16535] flex-shrink-0" />
                        {clienteSelecionado.email || '—'}
                      </p>
                    </div>
                    <div className="break-words">
                      <Label className="text-[#6b5544] text-sm font-medium">Telefone</Label>
                      <p className="text-[#2d1f16] flex items-center gap-1 break-all text-sm">
                        <Phone className="w-3 h-3 text-[#a16535] flex-shrink-0" />
                        {clienteSelecionado.telefones || '—'}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold text-base sm:text-lg">
                    <MapPin className="w-4 h-4 text-[#a16535]" />
                    Endereço
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Logradouro</Label>
                      <p className="text-[#2d1f16] text-sm break-words">{clienteSelecionado.logradouro || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Número</Label>
                      <p className="text-[#2d1f16] text-sm">{clienteSelecionado.numero || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Bairro</Label>
                      <p className="text-[#2d1f16] text-sm break-words">{clienteSelecionado.bairro || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Cidade/UF</Label>
                      <p className="text-[#2d1f16] text-sm">{clienteSelecionado.municipio}/{clienteSelecionado.uf}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <div className="flex flex-row gap-2">
            <Button variant="outline" onClick={() => setDialogClienteAberto(false)} className="text-sm">
              Fechar
            </Button>
            <Button onClick={() => clienteSelecionado && handleEditarCliente(clienteSelecionado)} className="text-sm bg-[#a16535] hover:bg-[#8b5329]">
              Editar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* === DIALOG PROCESSO === */}
      <Dialog open={dialogProcessoAberto} onOpenChange={setDialogProcessoAberto}>
        <DialogContent className="bg-white border-2 border-[#d4c4b0] max-w-4xl w-[95vw] max-h-[85vh] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16] flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="w-5 h-5 text-[#a16535]" />
              Detalhes do Processo
            </DialogTitle>
            <DialogDescription className="text-[#6b5544] text-sm">
              Visualização completa dos dados do processo
            </DialogDescription>
          </DialogHeader>
          {processoSelecionado && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold text-base sm:text-lg">
                    <FileCheck className="w-4 h-4 text-[#a16535]" />
                    Dados Básicos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="md:col-span-2">
                      <Label className="text-[#6b5544] text-sm font-medium">Número do Processo</Label>
                      <p className="text-[#2d1f16] font-mono text-base">{processoSelecionado.numeroProcesso || '(Sem número)'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Cliente</Label>
                      <p className="text-[#2d1f16] text-sm break-words">{processoSelecionado.clienteNome}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Tipo de Ação</Label>
                      <p className="text-[#2d1f16] text-sm break-words">{processoSelecionado.tipoAcao}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Fase Processual</Label>
                      <Badge variant="outline" className="border-[#a16535] text-[#a16535] text-xs px-3 py-1 rounded-full mt-1">
                        {processoSelecionado.faseProcessual}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Status</Label>
                      <div className="mt-1">{getStatusBadge(processoSelecionado.status)}</div>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Prioridade</Label>
                      <div className="mt-1">{getPrioridadeBadge(processoSelecionado.prioridade)}</div>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Tribunal</Label>
                      <p className="text-[#2d1f16] text-sm break-words">{processoSelecionado.tribunal || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Valor da Causa</Label>
                      <p className="text-[#2d1f16] text-sm">{processoSelecionado.valorCausa || '—'}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold text-base sm:text-lg">
                    <Calendar className="w-4 h-4 text-[#a16535]" />
                    Datas Importantes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Distribuição</Label>
                      <p className="text-[#2d1f16] text-sm">{processoSelecionado.dataDistribuicao ? formatDateBR(processoSelecionado.dataDistribuicao) : '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <div className="flex flex-row gap-2">
            <Button variant="outline" onClick={() => setDialogClienteAberto(false)} className="text-sm">
              Fechar
            </Button>
            <Button onClick={() => clienteSelecionado && handleEditarCliente(clienteSelecionado)} className="text-sm bg-[#a16535] hover:bg-[#8b5329]">
              Editar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
