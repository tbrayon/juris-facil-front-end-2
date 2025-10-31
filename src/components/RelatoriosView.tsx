import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useClientes, Cliente } from '../contexts/ClientesContext';
import { useProcessos, Processo } from '../contexts/ProcessosContext';
import { FileText, Users, Search, Eye, Edit, Download, X, Mail, Phone, MapPin, Calendar, FileCheck, Scale, AlertCircle, ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { formatDateBR, getLocalDateString, formatCPF, formatCNPJ } from '../others/formatters';

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

  // === FILTROS ÚNICOS (com type guard) ===
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
      'Em elaboração': { color: 'bg-purple-500/30 text-purple-700 border-purple-600', label: 'Em elaboração' },
      'Pendente de distribuição': { color: 'bg-indigo-500/30 text-indigo-700 border-indigo-600', label: 'Pendente de distribuição' },
      'Ativo': { color: 'bg-green-500/30 text-green-700 border-green-600', label: 'Ativo' },
      'Suspenso': { color: 'bg-yellow-500/30 text-yellow-700 border-yellow-600', label: 'Suspenso' },
      'Finalizado acordo': { color: 'bg-[#6b5544]/30 text-[#4a3629] border-[#6b5544]', label: 'Finalizado Acordo' },
      'Finalizado procedente': { color: 'bg-green-600/30 text-green-800 border-green-700', label: 'Finalizado Procedente' },
      'Finalizado parcialmente procedente': { color: 'bg-blue-600/30 text-blue-800 border-blue-700', label: 'Finalizado Parcialmente Procedente' },
      'Finalizado improcedente': { color: 'bg-red-600/30 text-red-800 border-red-700', label: 'Finalizado Improcedente' },
      'em-elaboracao': { color: 'bg-purple-500/30 text-purple-700 border-purple-600', label: 'Em elaboração' },
      'pendente-de-distribuicao': { color: 'bg-indigo-500/30 text-indigo-700 border-indigo-600', label: 'Pendente de distribuição' },
      'ativo': { color: 'bg-green-500/30 text-green-700 border-green-600', label: 'Ativo' },
      'suspenso': { color: 'bg-yellow-500/30 text-yellow-700 border-yellow-600', label: 'Suspenso' },
      'finalizado-acordo': { color: 'bg-[#6b5544]/30 text-[#4a3629] border-[#6b5544]', label: 'Finalizado Acordo' },
      'finalizado-procedente': { color: 'bg-green-600/30 text-green-800 border-green-700', label: 'Finalizado Procedente' },
      'finalizado-parcialmente-procedente': { color: 'bg-blue-600/30 text-blue-800 border-blue-700', label: 'Finalizado Parcialmente Procedente' },
      'finalizado-improcedente': { color: 'bg-red-600/30 text-red-800 border-red-700', label: 'Finalizado Improcedente' },
    };
    const s = map[status] || { color: 'bg-gray-500/30 text-gray-700 border-gray-600', label: status };
    return <Badge className={`${s.color} text-xs px-2 py-0.5`}>{s.label}</Badge>;
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return <Badge className="bg-red-500/30 text-red-700 border-red-600 text-xs px-2 py-0.5">Urgente</Badge>;
      case 'alta': return <Badge className="bg-orange-500/30 text-orange-700 border-orange-600 text-xs px-2 py-0.5">Alta</Badge>;
      case 'normal': return <Badge className="bg-yellow-500/30 text-yellow-700 border-yellow-600 text-xs px-2 py-0.5">Normal</Badge>;
      case 'baixa': return <Badge className="bg-green-500/30 text-green-700 border-green-600 text-xs px-2 py-0.5">Baixa</Badge>;
      default: return <Badge className="text-xs px-2 py-0.5">{prioridade}</Badge>;
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
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-[#2d1f16] flex items-center gap-2 text-2xl font-bold">
              <FileText className="w-6 h-6 text-[#a16535]" />
              Relatórios
            </h2>
            <p className="text-[#6b5544]">Visualize e exporte relatórios de clientes e processos</p>
          </div>
          <Button
            variant="outline"
            onClick={onVoltar}
            className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Página Inicial
          </Button>
        </div>
      </div>

      <Tabs defaultValue="clientes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-[#f6f3ee] border-2 border-[#d4c4b0] p-1 rounded-full h-auto md:h-14">
          <TabsTrigger value="clientes" className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full py-2 md:py-0 text-sm">
            <Users className="w-4 h-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Relatório de </span>Clientes
          </TabsTrigger>
          <TabsTrigger value="processos" className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full py-2 md:py-0 text-sm">
            <FileText className="w-4 h-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Relatório de </span>Processos
          </TabsTrigger>
        </TabsList>

        {/* === CLIENTES === */}
        <TabsContent value="clientes">
          <Card className="bg-white border-[#d4c4b0]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-[#2d1f16]">Clientes Cadastrados</CardTitle>
                  <CardDescription className="text-[#6b5544]">
                    Total de {clientesFiltrados.length} cliente(s)
                  </CardDescription>
                  <p className="text-xs text-[#a16535] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Dados sensíveis ocultos (LGPD)
                  </p>
                </div>
                <Button onClick={exportarRelatorioClientes} disabled={clientesFiltrados.length === 0}
                  className="bg-[#a16535] hover:bg-[#8b5329] text-white w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="mb-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5544] w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome..."
                    value={buscaClientes}
                    onChange={e => setBuscaClientes(e.target.value)}
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] focus:border-[#a16535]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={filtroTipoCliente} onValueChange={setFiltroTipoCliente}>
                    <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="cpf">Pessoa Física</SelectItem>
                      <SelectItem value="cnpj">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroCidade} onValueChange={setFiltroCidade}>
                    <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0]">
                      <SelectValue placeholder="Cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      {cidadesUnicas.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {estadosBrasileiros.map(e => (
                        <SelectItem key={e.sigla} value={e.sigla}>{e.sigla} - {e.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(filtroTipoCliente !== 'todos' || filtroCidade !== 'todos' || filtroEstado !== 'todos') && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    setFiltroTipoCliente('todos'); setFiltroCidade('todos'); setFiltroEstado('todos');
                  }} className="text-[#a16535]">
                    <X className="w-4 h-4 mr-2" /> Limpar
                  </Button>
                )}
              </div>

              {/* Mobile: Cartões */}
              <div className="md:hidden space-y-3">
                {clientesFiltrados.length === 0 ? (
                  <p className="text-center py-12 text-[#6b5544] bg-white rounded-lg border border-[#d4c4b0]/50">
                    Nenhum cliente encontrado
                  </p>
                ) : (
                  clientesFiltrados.map((cliente: Cliente) => (
                    <div key={cliente.id} className="bg-white border border-[#d4c4b0]/50 rounded-lg p-4 shadow-sm hover:shadow-md">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-[#2d1f16] text-base">{cliente.nome}</h4>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleVisualizarCliente(cliente)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee]">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditarCliente(cliente)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee]">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#6b5544]">Tipo:</span>
                          <Badge variant="outline" className="text-xs border-[#a16535] text-[#a16535]">
                            {getTipoCliente(cliente.tipo)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6b5544]">Local:</span>
                          <span className="font-medium text-[#2d1f16]">{cliente.municipio}/{cliente.uf}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop: Tabela */}
              <div className="hidden md:block border border-[#d4c4b0] rounded-lg overflow-hidden">
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
                          <TableCell className="text-[#2d1f16] font-medium">{cliente.nome}</TableCell>
                          <TableCell><Badge variant="outline" className="border-[#a16535] text-[#a16535] text-xs">{getTipoCliente(cliente.tipo)}</Badge></TableCell>
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
          <Card className="bg-white border-[#d4c4b0]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-[#2d1f16]">Processos Cadastrados</CardTitle>
                  <CardDescription className="text-[#6b5544]">
                    Total de {processosFiltrados.length} processo(s)
                  </CardDescription>
                </div>
                <Button onClick={exportarRelatorioProcessos} disabled={processosFiltrados.length === 0}
                  className="bg-[#a16535] hover:bg-[#8b5329] text-white w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="mb-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5544] w-4 h-4" />
                  <Input
                    placeholder="Buscar por número, cliente ou ação..."
                    value={buscaProcessos}
                    onChange={e => setBuscaProcessos(e.target.value)}
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] focus:border-[#a16535]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[#6b5544] text-sm">Fase</Label>
                    <Select value={filtroFase} onValueChange={setFiltroFase}>
                      <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0]"><SelectValue placeholder="Todas" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas</SelectItem>
                        {fasesUnicas.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#6b5544] text-sm">Status</Label>
                    <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                      <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0]"><SelectValue placeholder="Todos" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        {statusUnicos.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#6b5544] text-sm">Prioridade</Label>
                    <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
                      <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0]"><SelectValue placeholder="Todas" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas</SelectItem>
                        {prioridadesUnicas.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#6b5544] text-sm">Tipo de Ação</Label>
                    <Select value={filtroTipoAcao} onValueChange={setFiltroTipoAcao}>
                      <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0]"><SelectValue placeholder="Todos" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        {tiposAcaoUnicos.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {(filtroFase !== 'todos' || filtroStatus !== 'todos' || filtroPrioridade !== 'todos' || filtroTipoAcao !== 'todos') && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    setFiltroFase('todos'); setFiltroStatus('todos'); setFiltroPrioridade('todos'); setFiltroTipoAcao('todos');
                  }} className="text-[#a16535]">
                    <X className="w-4 h-4 mr-2" /> Limpar
                  </Button>
                )}
              </div>

              {/* Mobile: Cartões */}
              <div className="md:hidden space-y-3">
                {processosFiltrados.length === 0 ? (
                  <div className="text-center py-12 text-[#6b5544] bg-white rounded-lg border border-[#d4c4b0]/50">
                    Nenhum processo encontrado
                  </div>
                ) : (
                  processosFiltrados.map((processo: Processo) => (
                    <div key={processo.id} className="bg-white border border-[#d4c4b0]/50 rounded-lg p-4 shadow-sm hover:shadow-md">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#2d1f16] text-base truncate">
                            {processo.numeroProcesso || '(Sem número)'}
                          </p>
                          <p className="text-sm text-[#6b5544] truncate">{processo.clienteNome}</p>
                        </div>
                        <div className="flex gap-1 ml-3">
                          <Button variant="ghost" size="icon" onClick={() => handleVisualizarProcesso(processo)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee]">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditarProcesso(processo)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee]">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[#6b5544] font-medium">Ação:</span>
                          <p className="text-[#2d1f16] truncate">{processo.tipoAcao}</p>
                        </div>
                        <div>
                          <span className="text-[#6b5544] font-medium">Fase:</span>
                          <Badge variant="outline" className="text-xs border-[#a16535] text-[#a16535] mt-1 inline-block">
                            {processo.faseProcessual}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-[#6b5544] font-medium">Status:</span>
                          <div className="mt-1">{getStatusBadge(processo.status)}</div>
                        </div>
                        <div>
                          <span className="text-[#6b5544] font-medium">Prioridade:</span>
                          <div className="mt-1">{getPrioridadeBadge(processo.prioridade)}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop: Tabela */}
              <div className="hidden md:block border border-[#d4c4b0] rounded-lg overflow-hidden">
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
                          <TableCell className="text-[#2d1f16] font-medium font-mono">
                            {processo.numeroProcesso || <span className="text-[#6b5544] italic">(Sem número)</span>}
                          </TableCell>
                          <TableCell className="text-[#6b5544]">{processo.clienteNome}</TableCell>
                          <TableCell className="text-[#6b5544]">{processo.tipoAcao}</TableCell>
                          <TableCell><Badge variant="outline" className="border-[#a16535] text-[#a16535] text-xs">{processo.faseProcessual}</Badge></TableCell>
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
        <DialogContent className="bg-white border-2 border-[#d4c4b0] max-w-3xl w-[95vw] max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#a16535]" />
              Detalhes do Cliente
            </DialogTitle>
            <DialogDescription className="text-[#6b5544]">
              Visualização completa dos dados cadastrais do cliente
            </DialogDescription>
          </DialogHeader>
          {clienteSelecionado && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold">
                    <Users className="w-4 h-4 text-[#a16535]" />
                    Dados Pessoais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label className="text-[#6b5544] text-sm">Nome</Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.nome}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Tipo</Label>
                      <p className="text-[#2d1f16]">{getTipoCliente(clienteSelecionado.tipo)}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">{clienteSelecionado.tipo === 'cpf' ? 'CPF' : 'CNPJ'}</Label>
                      <p className="text-[#2d1f16]">
                        {clienteSelecionado.tipo === 'cpf' ? formatCPF(clienteSelecionado.documento) : formatCNPJ(clienteSelecionado.documento)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Email</Label>
                      <p className="text-[#2d1f16] flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#a16535]" />
                        {clienteSelecionado.email || '—'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Telefone</Label>
                      <p className="text-[#2d1f16] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#a16535]" />
                        {clienteSelecionado.telefones || '—'}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold">
                    <MapPin className="w-4 h-4 text-[#a16535]" />
                    Endereço
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#6b5544] text-sm">Logradouro</Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.logradouro || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Número</Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.numero || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Bairro</Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.bairro || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Cidade/UF</Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.municipio}/{clienteSelecionado.uf}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogClienteAberto(false)}>Fechar</Button>
            <Button onClick={() => clienteSelecionado && handleEditarCliente(clienteSelecionado)}>Editar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* === DIALOG PROCESSO === */}
      <Dialog open={dialogProcessoAberto} onOpenChange={setDialogProcessoAberto}>
        <DialogContent className="bg-white border-2 border-[#d4c4b0] max-w-4xl w-[95vw] max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#a16535]" />
              Detalhes do Processo
            </DialogTitle>
            <DialogDescription className="text-[#6b5544]">
              Visualização completa dos dados do processo
            </DialogDescription>
          </DialogHeader>
          {processoSelecionado && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold">
                    <FileCheck className="w-4 h-4 text-[#a16535]" />
                    Dados Básicos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label className="text-[#6b5544] text-sm">Número do Processo</Label>
                      <p className="text-[#2d1f16] font-mono">{processoSelecionado.numeroProcesso || '(Sem número)'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Cliente</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.clienteNome}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Tipo de Ação</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.tipoAcao}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Fase Processual</Label>
                      <Badge variant="outline" className="border-[#a16535] text-[#a16535] text-xs">
                        {processoSelecionado.faseProcessual}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Status</Label>
                      {getStatusBadge(processoSelecionado.status)}
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Prioridade</Label>
                      {getPrioridadeBadge(processoSelecionado.prioridade)}
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Tribunal</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.tribunal || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Valor da Causa</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.valorCausa || '—'}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold">
                    <Calendar className="w-4 h-4 text-[#a16535]" />
                    Datas Importantes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#6b5544] text-sm">Distribuição</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.dataDistribuicao ? formatDateBR(processoSelecionado.dataDistribuicao) : '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Última Movimentação</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.ultimaMovimentacao ? formatDateBR(processoSelecionado.ultimaMovimentacao) : '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogProcessoAberto(false)}>Fechar</Button>
            <Button onClick={() => processoSelecionado && handleEditarProcesso(processoSelecionado)}>Editar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}