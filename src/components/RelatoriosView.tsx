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
import { formatDateBR, getLocalDateString, formatCPF, formatCNPJ } from '../utils/formatters';

// Estados brasileiros
const estadosBrasileiros = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
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
  
  // Filtros para clientes
  const [filtroTipoCliente, setFiltroTipoCliente] = useState<string>('todos');
  const [filtroCidade, setFiltroCidade] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  
  // Filtros adicionais para processos
  const [filtroFase, setFiltroFase] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('todos');
  const [filtroTipoAcao, setFiltroTipoAcao] = useState<string>('todos');
  
  // Estados para dialogs de clientes
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [modoCliente, setModoCliente] = useState<'visualizar' | 'editar'>('visualizar');
  const [dialogClienteAberto, setDialogClienteAberto] = useState(false);
  
  // Estados para dialogs de processos
  const [processoSelecionado, setProcessoSelecionado] = useState<Processo | null>(null);
  const [modoProcesso, setModoProcesso] = useState<'visualizar' | 'editar'>('visualizar');
  const [dialogProcessoAberto, setDialogProcessoAberto] = useState(false);

  // Filtrar clientes com todos os filtros
  const clientesFiltrados = clientes.filter(cliente => {
    const matchBusca = cliente.nome.toLowerCase().includes(buscaClientes.toLowerCase());
    const matchTipo = filtroTipoCliente === 'todos' || cliente.tipo === filtroTipoCliente;
    const matchCidade = filtroCidade === 'todos' || cliente.municipio === filtroCidade;
    const matchEstado = filtroEstado === 'todos' || cliente.uf === filtroEstado;
    
    return matchBusca && matchTipo && matchCidade && matchEstado;
  });

  // Obter listas únicas para os filtros de clientes
  const cidadesUnicas = Array.from(new Set(clientes.map(c => c.municipio))).filter(Boolean).map(String).sort();

  // Filtrar processos com todos os filtros
  const processosFiltrados = processos.filter(processo => {
    const matchBusca = 
      (processo.numeroProcesso && processo.numeroProcesso.includes(buscaProcessos)) ||
      processo.clienteNome.toLowerCase().includes(buscaProcessos.toLowerCase()) ||
      processo.tipoAcao.toLowerCase().includes(buscaProcessos.toLowerCase());
    
    const matchFase = filtroFase === 'todos' || processo.faseProcessual === filtroFase;
    const matchStatus = filtroStatus === 'todos' || processo.status === filtroStatus;
    const matchPrioridade = filtroPrioridade === 'todos' || processo.prioridade === filtroPrioridade;
    const matchTipoAcao = filtroTipoAcao === 'todos' || processo.tipoAcao === filtroTipoAcao;
    
    return matchBusca && matchFase && matchStatus && matchPrioridade && matchTipoAcao;
  });

  const getTipoCliente = (tipo: 'cpf' | 'cnpj') => {
    return tipo === 'cpf' ? 'Pessoa Física' : 'Pessoa Jurídica';
  };

  const handleVisualizarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setModoCliente('visualizar');
    setDialogClienteAberto(true);
  };

  const handleEditarClienteInterno = (cliente: Cliente) => {
    onEditarCliente(cliente.id);
  };

  const handleVisualizarProcesso = (processo: Processo) => {
    setProcessoSelecionado(processo);
    setModoProcesso('visualizar');
    setDialogProcessoAberto(true);
  };

  const handleEditarProcessoInterno = (processo: Processo) => {
    onEditarProcesso(processo.id);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; label: string } } = {
      // Novos formatos sem traços
      'Em elaboração': { color: 'bg-purple-500/30 text-purple-700 border-purple-600', label: 'Em elaboração' },
      'Pendente de distribuição': { color: 'bg-indigo-500/30 text-indigo-700 border-indigo-600', label: 'Pendente de distribuição' },
      'Ativo': { color: 'bg-green-500/30 text-green-700 border-green-600', label: 'Ativo' },
      'Suspenso': { color: 'bg-yellow-500/30 text-yellow-700 border-yellow-600', label: 'Suspenso' },
      'Finalizado acordo': { color: 'bg-[#6b5544]/30 text-[#4a3629] border-[#6b5544]', label: 'Finalizado Acordo' },
      'Finalizado procedente': { color: 'bg-green-600/30 text-green-800 border-green-700', label: 'Finalizado Procedente' },
      'Finalizado parcialmente procedente': { color: 'bg-blue-600/30 text-blue-800 border-blue-700', label: 'Finalizado Parcialmente Procedente' },
      'Finalizado improcedente': { color: 'bg-red-600/30 text-red-800 border-red-700', label: 'Finalizado Improcedente' },
      // Formatos antigos com traços (para retrocompatibilidade com dados já salvos)
      'em-elaboracao': { color: 'bg-purple-500/30 text-purple-700 border-purple-600', label: 'Em elaboração' },
      'pendente-de-distribuicao': { color: 'bg-indigo-500/30 text-indigo-700 border-indigo-600', label: 'Pendente de distribuição' },
      'ativo': { color: 'bg-green-500/30 text-green-700 border-green-600', label: 'Ativo' },
      'suspenso': { color: 'bg-yellow-500/30 text-yellow-700 border-yellow-600', label: 'Suspenso' },
      'finalizado-acordo': { color: 'bg-[#6b5544]/30 text-[#4a3629] border-[#6b5544]', label: 'Finalizado Acordo' },
      'finalizado-procedente': { color: 'bg-green-600/30 text-green-800 border-green-700', label: 'Finalizado Procedente' },
      'finalizado-parcialmente-procedente': { color: 'bg-blue-600/30 text-blue-800 border-blue-700', label: 'Finalizado Parcialmente Procedente' },
      'finalizado-improcedente': { color: 'bg-red-600/30 text-red-800 border-red-700', label: 'Finalizado Improcedente' },
      'em-andamento': { color: 'bg-blue-500/30 text-blue-700 border-blue-600', label: 'Em Andamento' },
      'arquivado': { color: 'bg-[#8b5329]/30 text-[#6b5544] border-[#8b5329]', label: 'Arquivado' },
    };
    const s = statusMap[status] || { color: 'bg-gray-500/30 text-gray-700 border-gray-600', label: status };
    return <Badge className={s.color}>{s.label}</Badge>;
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente':
        return <Badge className="bg-red-500/30 text-red-700 border-red-600">🔴 Urgente</Badge>;
      case 'alta':
        return <Badge className="bg-orange-500/30 text-orange-700 border-orange-600">🟠 Alta</Badge>;
      case 'normal':
        return <Badge className="bg-yellow-500/30 text-yellow-700 border-yellow-600">🟡 Normal</Badge>;
      case 'baixa':
        return <Badge className="bg-green-500/30 text-green-700 border-green-600">🟢 Baixa</Badge>;
      default:
        return <Badge>{prioridade}</Badge>;
    }
  };

  // Obter listas únicas para os filtros
  const fasesUnicas = Array.from(new Set(processos.map(p => p.faseProcessual))).filter(Boolean).map(String).sort();
  const statusUnicos = Array.from(new Set(processos.map(p => p.status))).filter(Boolean).map(String).sort();
  const prioridadesUnicas = Array.from(new Set(processos.map(p => p.prioridade))).filter(Boolean).map(String).sort();
  const tiposAcaoUnicos = Array.from(new Set(processos.map(p => p.tipoAcao))).filter(Boolean).map(String).sort();

  const exportarRelatorioClientes = () => {
    const csvContent = [
      ['Nome', 'Tipo', 'Cidade', 'Estado'].join(';'),
      ...clientesFiltrados.map(c => [
        c.nome,
        getTipoCliente(c.tipo),
        c.municipio || '',
        c.uf || '',
      ].join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_clientes_${getLocalDateString()}.csv`;
    link.click();
  };

  const exportarRelatorioProcessos = () => {
    const csvContent = [
      ['Número', 'Cliente', 'Tipo de Ação', 'Fase', 'Status', 'Prioridade', 'Tribunal', 'Valor da Causa'].join(';'),
      ...processosFiltrados.map(p => [
        p.numeroProcesso || '(Sem número)',
        p.clienteNome,
        p.tipoAcao,
        p.faseProcessual,
        p.status,
        p.prioridade,
        p.tribunal,
        p.valorCausa,
      ].join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_processos_${getLocalDateString()}.csv`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#2d1f16] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#a16535]" />
              Relatórios
            </h2>
            <p className="text-[#6b5544]">Visualize e exporte relatórios de clientes e processos</p>
          </div>
          <Button
            variant="outline"
            onClick={onVoltar}
            className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Página Inicial
          </Button>
        </div>
      </div>

      <Tabs defaultValue="clientes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-[#f6f3ee] border-2 border-[#d4c4b0] p-1 rounded-full h-14">
          <TabsTrigger 
            value="clientes"
            className="data-[state=open]:bg-[#a16535] data-[state=open]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full h-full transition-all"
          >
            <Users className="w-4 h-4 mr-2" />
            Relatório de Clientes
          </TabsTrigger>
          <TabsTrigger 
            value="processos"
            className="data-[state=open]:bg-[#a16535] data-[state=open]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full h-full transition-all"
          >
            <FileText className="w-4 h-4 mr-2" />
            Relatório de Processos
          </TabsTrigger>
        </TabsList>

        {/* Relatório de Clientes */}
        <TabsContent value="clientes">
          <Card className="bg-white border-[#d4c4b0]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-[#2d1f16]">Clientes Cadastrados</CardTitle>
                  <CardDescription className="text-[#6b5544]">
                    Total de {clientesFiltrados.length} cliente(s) encontrado(s)
                  </CardDescription>
                  <p className="text-xs text-[#a16535] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    Dados pessoais sensíveis ocultos em conformidade com a LGPD
                  </p>
                </div>
                <Button
                  onClick={exportarRelatorioClientes}
                  className="bg-[#a16535] hover:bg-[#8b5329] text-white"
                  disabled={clientesFiltrados.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b5544] w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome do cliente..."
                    value={buscaClientes}
                    onChange={(e) => setBuscaClientes(e.target.value)}
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                  />
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#4a3629]">Tipo de Cliente</Label>
                    <Select value={filtroTipoCliente} onValueChange={setFiltroTipoCliente}>
                      <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#d4c4b0]">
                        <SelectItem value="todos" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Todos</SelectItem>
                        <SelectItem value="cpf" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Pessoa Física</SelectItem>
                        <SelectItem value="cnpj" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#4a3629]">Cidade</Label>
                    <Select value={filtroCidade} onValueChange={setFiltroCidade}>
                      <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#d4c4b0]">
                        <SelectItem value="todos" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Todas</SelectItem>
                        {cidadesUnicas.map((cidade) => (
                          <SelectItem key={cidade} value={cidade} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                            {cidade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#4a3629]">Estado</Label>
                    <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                      <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#d4c4b0]">
                        <SelectItem value="todos" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Todos</SelectItem>
                        {estadosBrasileiros.map((estado) => (
                          <SelectItem key={estado.sigla} value={estado.sigla} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                            {estado.sigla} - {estado.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Botão para limpar filtros */}
                {(filtroTipoCliente !== 'todos' || filtroCidade !== 'todos' || filtroEstado !== 'todos') && (
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFiltroTipoCliente('todos');
                        setFiltroCidade('todos');
                        setFiltroEstado('todos');
                      }}
                      className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </div>

              <div className="border border-[#d4c4b0] rounded-lg overflow-x-auto">
                <Table className="min-w-[500px]"> {/* Adicionado min-width para mobile */}
                  <TableHeader>
                    <TableRow className="bg-[#f6f3ee] hover:bg-[#f6f3ee]">
                      <TableHead className="text-[#4a3629]">Nome</TableHead>
                      <TableHead className="text-[#4a3629]">Tipo</TableHead>
                      <TableHead className="text-[#4a3629]">Cidade/UF</TableHead>
                      <TableHead className="text-[#4a3629] text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-[#6b5544] py-8">
                          Nenhum cliente encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      clientesFiltrados.map((cliente) => (
                        <TableRow key={cliente.id} className="hover:bg-[#f6f3ee]/50">
                          <TableCell className="text-[#2d1f16]">{cliente.nome}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-[#a16535] text-[#a16535]">
                              {getTipoCliente(cliente.tipo)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[#6b5544]">{cliente.municipio}/{cliente.uf}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVisualizarCliente(cliente)}
                                className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditarClienteInterno(cliente)}
                                className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                              >
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

        {/* Relatório de Processos */}
        <TabsContent value="processos">
          <Card className="bg-white border-[#d4c4b0]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#2d1f16]">Processos Cadastrados</CardTitle>
                  <CardDescription className="text-[#6b5544]">
                    Total de {processosFiltrados.length} processo(s) encontrado(s)
                  </CardDescription>
                </div>
                <Button
                  onClick={exportarRelatorioProcessos}
                  className="bg-[#a16535] hover:bg-[#8b5329] text-white"
                  disabled={processosFiltrados.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-4">
                {/* Campo de busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b5544] w-4 h-4" />
                  <Input
                    placeholder="Buscar por número, cliente ou tipo de ação..."
                    value={buscaProcessos}
                    onChange={(e) => setBuscaProcessos(e.target.value)}
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                  />
                </div>

                {/* Filtros adicionais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Filtro Fase */}
                  <div className="space-y-2">
                    <Label className="text-[#6b5544] text-sm">Fase</Label>
                    <select
                      value={filtroFase}
                      onChange={(e) => setFiltroFase(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-[#d4c4b0] bg-[#f6f3ee] text-[#2d1f16] focus:border-[#a16535] focus:ring-2 focus:ring-[#a16535]/20 outline-none transition-colors"
                    >
                      <option value="todos">Todas as fases</option>
                      {fasesUnicas.map(fase => (
                        <option key={fase} value={fase}>{fase}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro Status */}
                  <div className="space-y-2">
                    <Label className="text-[#6b5544] text-sm">Status</Label>
                    <select
                      value={filtroStatus}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-[#d4c4b0] bg-[#f6f3ee] text-[#2d1f16] focus:border-[#a16535] focus:ring-2 focus:ring-[#a16535]/20 outline-none transition-colors"
                    >
                      <option value="todos">Todos os status</option>
                      {statusUnicos.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro Prioridade */}
                  <div className="space-y-2">
                    <Label className="text-[#6b5544] text-sm">Prioridade</Label>
                    <select
                      value={filtroPrioridade}
                      onChange={(e) => setFiltroPrioridade(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-[#d4c4b0] bg-[#f6f3ee] text-[#2d1f16] focus:border-[#a16535] focus:ring-2 focus:ring-[#a16535]/20 outline-none transition-colors"
                    >
                      <option value="todos">Todas as prioridades</option>
                      {prioridadesUnicas.map(prioridade => (
                        <option key={prioridade} value={prioridade}>{prioridade}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro Tipo de Ação */}
                  <div className="space-y-2">
                    <Label className="text-[#6b5544] text-sm">Tipo de Ação</Label>
                    <select
                      value={filtroTipoAcao}
                      onChange={(e) => setFiltroTipoAcao(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-[#d4c4b0] bg-[#f6f3ee] text-[#2d1f16] focus:border-[#a16535] focus:ring-2 focus:ring-[#a16535]/20 outline-none transition-colors"
                    >
                      <option value="todos">Todos os tipos</option>
                      {tiposAcaoUnicos.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Botão para limpar filtros */}
                {(filtroFase !== 'todos' || filtroStatus !== 'todos' || filtroPrioridade !== 'todos' || filtroTipoAcao !== 'todos') && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFiltroFase('todos');
                        setFiltroStatus('todos');
                        setFiltroPrioridade('todos');
                        setFiltroTipoAcao('todos');
                      }}
                      className="text-[#a16535] border-[#a16535] hover:bg-[#a16535] hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </div>

              <div className="border border-[#d4c4b0] rounded-lg overflow-x-auto">
                <Table className="min-w-[800px]"> {/* Adicionado min-width para mobile */}
                  <TableHeader>
                    <TableRow className="bg-[#f6f3ee] hover:bg-[#f6f3ee]">
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
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-[#6b5544] py-8">
                          Nenhum processo encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      processosFiltrados.map((processo) => (
                        <TableRow key={processo.id} className="hover:bg-[#f6f3ee]/50">
                          <TableCell className="text-[#2d1f16]">
                            {processo.numeroProcesso || <span className="text-[#6b5544] italic">(Sem número)</span>}
                          </TableCell>
                          <TableCell className="text-[#6b5544]">{processo.clienteNome}</TableCell>
                          <TableCell className="text-[#6b5544]">{processo.tipoAcao}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-[#a16535] text-[#a16535]">
                              {processo.faseProcessual}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(processo.status)}</TableCell>
                          <TableCell>{getPrioridadeBadge(processo.prioridade)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVisualizarProcesso(processo)}
                                className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditarProcessoInterno(processo)}
                                className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                              >
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

      {/* Dialog de Visualização/Edição de Cliente */}
      <Dialog open={dialogClienteAberto} onOpenChange={setDialogClienteAberto}>
        <DialogContent className="bg-white border-2 border-[#d4c4b0] max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#a16535]" />
              {modoCliente === 'visualizar' ? 'Detalhes do Cliente' : 'Editar Cliente'}
            </DialogTitle>
            <DialogDescription className="text-[#6b5544]">
              {modoCliente === 'visualizar' 
                ? 'Visualização completa dos dados cadastrais do cliente' 
                : 'Edite as informações do cliente'}
            </DialogDescription>
          </DialogHeader>

          {clienteSelecionado && (
            <ScrollArea className="max-h-[calc(80vh-120px)] pr-4">
              <div className="space-y-6">
                {/* Dados Pessoais */}
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#a16535]" />
                    Dados Pessoais
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Grid responsivo */}
                    <div>
                      <Label className="text-[#6b5544] text-sm">Nome</Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.nome}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Tipo</Label>
                      <Badge variant="outline" className="border-[#a16535] text-[#a16535]">
                        {getTipoCliente(clienteSelecionado.tipo)}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">
                        {clienteSelecionado.tipo === 'cpf' ? 'CPF' : 'CNPJ'}
                      </Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.documento}</p>
                    </div>
                    {clienteSelecionado.tipo === 'cpf' && clienteSelecionado.rg && (
                      <div>
                        <Label className="text-[#6b5544] text-sm">RG</Label>
                        <p className="text-[#2d1f16]">{clienteSelecionado.rg}</p>
                      </div>
                    )}
                    {clienteSelecionado.tipo === 'cpf' && clienteSelecionado.dataNascimento && (
                      <div>
                        <Label className="text-[#6b5544] text-sm">Data de Nascimento</Label>
                        <p className="text-[#2d1f16]">
                          {formatDateBR(clienteSelecionado.dataNascimento)}
                        </p>
                      </div>
                    )}
                    {clienteSelecionado.tipo === 'cpf' && clienteSelecionado.estadoCivil && (
                      <div>
                        <Label className="text-[#6b5544] text-sm">Estado Civil</Label>
                        <p className="text-[#2d1f16]">{clienteSelecionado.estadoCivil}</p>
                      </div>
                    )}
                    {clienteSelecionado.tipo === 'cpf' && clienteSelecionado.nacionalidade && (
                      <div>
                        <Label className="text-[#6b5544] text-sm">Nacionalidade</Label>
                        <p className="text-[#2d1f16]">{clienteSelecionado.nacionalidade}</p>
                      </div>
                    )}
                    {clienteSelecionado.tipo === 'cnpj' && clienteSelecionado.nomeFantasia && (
                      <div>
                        <Label className="text-[#6b5544] text-sm">Nome Fantasia</Label>
                        <p className="text-[#2d1f16]">{clienteSelecionado.nomeFantasia}</p>
                      </div>
                    )}
                    {clienteSelecionado.tipo === 'cnpj' && clienteSelecionado.nomeResponsavel && (
                      <div>
                        <Label className="text-[#6b5544] text-sm">Responsável</Label>
                        <p className="text-[#2d1f16]">{clienteSelecionado.nomeResponsavel}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dados Profissionais - Apenas para CPF */}
                {clienteSelecionado.tipo === 'cpf' && (clienteSelecionado.profissao || clienteSelecionado.empresa || clienteSelecionado.cargo) && (
                  <>
                    <Separator className="bg-[#d4c4b0]" />
                    <div>
                      <h3 className="text-[#4a3629] mb-3 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-[#a16535]" />
                        Dados Profissionais
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Grid responsivo */}
                        {clienteSelecionado.profissao && (
                          <div>
                            <Label className="text-[#6b5544] text-sm">Profissão</Label>
                            <p className="text-[#2d1f16]">{clienteSelecionado.profissao}</p>
                          </div>
                        )}
                        {clienteSelecionado.empresa && (
                          <div>
                            <Label className="text-[#6b5544] text-sm">Empresa / Local de Trabalho</Label>
                            <p className="text-[#2d1f16]">{clienteSelecionado.empresa}</p>
                          </div>
                        )}
                        {clienteSelecionado.cargo && (
                          <div>
                            <Label className="text-[#6b5544] text-sm">Cargo</Label>
                            <p className="text-[#2d1f16]">{clienteSelecionado.cargo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Separator className="bg-[#d4c4b0]" />

                {/* Contatos */}
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#a16535]" />
                    Contatos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Grid responsivo */}
                    <div className="col-span-2 sm:col-span-1">
                      <Label className="text-[#6b5544] text-sm flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        Email
                      </Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.email || '-'}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label className="text-[#6b5544] text-sm flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        Telefones
                      </Label>
                      {clienteSelecionado.telefones && clienteSelecionado.telefones.length > 0 ? (
                        <div className="space-y-1">
                          {clienteSelecionado.telefones.map((tel, idx) => (
                            <p key={idx} className="text-[#2d1f16]">{tel}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#6b5544]">-</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* Endereço */}
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#a16535]" />
                    Endereço
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Grid responsivo */}
                    <div>
                      <Label className="text-[#6b5544] text-sm">CEP</Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.cep || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">UF</Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.uf || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-[#6b5544] text-sm">Município</Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.municipio || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-[#6b5544] text-sm">Bairro</Label>
                      <p className="text-[#2d1f16]">{clienteSelecionado.bairro || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-[#6b5544] text-sm">Logradouro</Label>
                      <p className="text-[#2d1f16]">
                        {clienteSelecionado.logradouro ? 
                          `${clienteSelecionado.logradouro}, ${clienteSelecionado.numero || 's/n'}` : '-'}
                      </p>
                    </div>
                    {clienteSelecionado.complemento && (
                      <div className="col-span-2">
                        <Label className="text-[#6b5544] text-sm">Complemento</Label>
                        <p className="text-[#2d1f16]">{clienteSelecionado.complemento}</p>
                      </div>
                    )}
                  </div>
                </div>

                {clienteSelecionado.observacoes && (
                  <>
                    <Separator className="bg-[#d4c4b0]" />
                    <div>
                      <h3 className="text-[#4a3629] mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-[#a16535]" />
                        Observações
                      </h3>
                      <p className="text-[#6b5544] text-sm leading-relaxed">
                        {clienteSelecionado.observacoes}
                      </p>
                    </div>
                  </>
                )}

                <Separator className="bg-[#d4c4b0]" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#6b5544] text-sm flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Data de Cadastro
                    </Label>
                    <p className="text-[#2d1f16]">
                      {formatDateBR(clienteSelecionado.dataCadastro)}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          <div className="flex gap-2 justify-end pt-4 border-t border-[#d4c4b0]">
            <Button
              variant="outline"
              onClick={() => setDialogClienteAberto(false)}
              className="border-[#d4c4b0] text-[#4a3629] hover:bg-[#f6f3ee]"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização/Edição de Processo */}
      <Dialog open={dialogProcessoAberto} onOpenChange={setDialogProcessoAberto}>
        <DialogContent className="bg-white border-2 border-[#d4c4b0] max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#a16535]" />
              {modoProcesso === 'visualizar' ? 'Detalhes do Processo' : 'Editar Processo'}
            </DialogTitle>
            <DialogDescription className="text-[#6b5544]">
              {modoProcesso === 'visualizar' 
                ? 'Visualização completa dos dados do processo' 
                : 'Edite as informações do processo'}
            </DialogDescription>
          </DialogHeader>

          {processoSelecionado && (
            <ScrollArea className="max-h-[calc(80vh-120px)] pr-4">
              <div className="space-y-6">
                {/* Dados Básicos */}
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#a16535]" />
                    Dados Básicos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Grid responsivo */}
                    <div className="col-span-2">
                      <Label className="text-[#6b5544] text-sm">Número do Processo</Label>
                      <p className="text-[#2d1f16]">
                        {processoSelecionado.numeroProcesso || <span className="text-[#6b5544] italic">(Processo sem número - pré-processual)</span>}
                      </p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Cliente</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.clienteNome}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Documento Cliente</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.clienteDocumento}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Data de Distribuição</Label>
                      <p className="text-[#2d1f16]">
                        {formatDateBR(processoSelecionado.dataDistribuicao)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Polo</Label>
                      <Badge variant="outline" className="border-[#a16535] text-[#a16535]">
                        {processoSelecionado.polo}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* Informações Processuais */}
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#a16535]" />
                    Informações Processuais
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Grid responsivo */}
                    <div className="col-span-2">
                      <Label className="text-[#6b5544] text-sm">Tipo de Ação</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.tipoAcao}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-[#6b5544] text-sm">Objeto da Ação</Label>
                      <p className="text-[#6b5544] text-sm leading-relaxed">
                        {processoSelecionado.objetoAcao}
                      </p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Parte Contrária</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.parteContraria}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Valor da Causa</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.valorCausa}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Fase Processual</Label>
                      <Badge variant="outline" className="border-[#a16535] text-[#a16535]">
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
                      <p className="text-[#2d1f16]">{processoSelecionado.tribunal}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Vara</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.vara}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Comarca</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.comarca}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Estado</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.estado}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Tipo de Jurisdição</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.tipoJurisdicao}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Advogado Responsável</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.advogadoResponsavel}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Próximo Prazo</Label>
                      <p className="text-[#2d1f16]">
                        {processoSelecionado.proximoPrazo 
                          ? formatDateBR(processoSelecionado.proximoPrazo)
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* Dados Financeiros */}
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#a16535]" />
                    Dados Financeiros
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Grid responsivo */}
                    <div>
                      <Label className="text-[#6b5544] text-sm">Valor do Contrato</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.valorContrato}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Percentual</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.percentualContrato}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Honorários Advocatícios</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.honorariosAdvocaticios}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Forma de Pagamento</Label>
                      <p className="text-[#2d1f16]">{processoSelecionado.formaPagamento}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Status Financeiro</Label>
                      <Badge variant="outline" className="border-[#a16535] text-[#a16535]">
                        {processoSelecionado.statusFinanceiro}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm">Data de Vencimento</Label>
                      <p className="text-[#2d1f16]">
                        {processoSelecionado.dataVencimento
                          ? formatDateBR(processoSelecionado.dataVencimento)
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {processoSelecionado.observacoesProcesso && (
                  <>
                    <Separator className="bg-[#d4c4b0]" />
                    <div>
                      <h3 className="text-[#4a3629] mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-[#a16535]" />
                        Observações do Processo
                      </h3>
                      <p className="text-[#6b5544] text-sm leading-relaxed">
                        {processoSelecionado.observacoesProcesso}
                      </p>
                    </div>
                  </>
                )}

                {processoSelecionado.linkProcesso && (
                  <>
                    <Separator className="bg-[#d4c4b0]" />
                    <div>
                      <Label className="text-[#6b5544] text-sm">Link do Processo</Label>
                      <a 
                        href={processoSelecionado.linkProcesso} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#a16535] hover:text-[#8b5329] hover:underline text-sm"
                      >
                        {processoSelecionado.linkProcesso}
                      </a>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          )}

          <div className="flex gap-2 justify-end pt-4 border-t border-[#d4c4b0]">
            <Button
              variant="outline"
              onClick={() => setDialogProcessoAberto(false)}
              className="border-[#d4c4b0] text-[#4a3629] hover:bg-[#f6f3ee]"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
