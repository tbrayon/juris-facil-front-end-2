import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useClientes } from '../contexts/ClientesContext';
import { useProcessos } from '../contexts/ProcessosContext';
import { useContratos } from '../contexts/ContratosContext';
import {
  FileText,
  Users,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Scale,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Target,
  Briefcase,
  RefreshCw,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface DashboardViewProps {
  onVoltar: () => void;
  usuarioTipo?: string;
}

export function DashboardView({ onVoltar, usuarioTipo }: DashboardViewProps) {
  const { clientes, resetarDados: resetarClientes } = useClientes();
  const { processos, resetarDados: resetarProcessos } = useProcessos();
  const { resetarDados: resetarContratos } = useContratos();

  const handleResetarDados = () => {
    resetarClientes();
    resetarProcessos();
    resetarContratos();
    toast.success('Dados resetados com sucesso!', {
      description: 'Todos os dados foram restaurados para os exemplos padrão.',
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  // ---------- Métricas básicas ----------
  const totalClientes = clientes.length;
  const totalProcessos = processos.length;
  const clientesPJ = clientes.filter((c) => c.documento.includes('/')).length;
  const clientesPF = totalClientes - clientesPJ;

  // ---------- Taxa de Sucesso ----------
  const processosPorStatus = processos.reduce((acc, p) => {
    const status = p.status || 'Não definido';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dadosStatus = [
    {
      name: 'Finalizado Procedente',
      value:
        (processosPorStatus['Finalizado procedente'] || 0) +
        (processosPorStatus['finalizado---procedente'] || 0) +
        (processosPorStatus['finalizado-procedente'] || 0),
      fill: '#a16535',
    },
    {
      name: 'Finalizado Improcedente',
      value:
        (processosPorStatus['Finalizado improcedente'] || 0) +
        (processosPorStatus['finalizado---improcedente'] || 0) +
        (processosPorStatus['finalizado-improcedente'] || 0),
      fill: '#6b5544',
    },
  ].filter((item) => item.value > 0);

  // ---------- Processos por fase ----------
  const processosPorFase = processos.reduce((acc, p) => {
    const fase = p.faseProcessual || 'Não definido';
    acc[fase] = (acc[fase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dadosFase = Object.entries(processosPorFase).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // ---------- Valor total em contratos ----------
  const valorTotalContratos = processos.reduce((acc, p) => {
    const valor = parseFloat(p.valorContrato.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    return acc + valor;
  }, 0);

  // ---------- Processos urgentes ----------
  const processosUrgentes = processos.filter(
    (p) => p.prioridade === 'urgente' || p.prioridade === 'alta'
  ).length;

  // ---------- Prazos próximos ----------
  const hoje = new Date();
  const proximosDias = new Date();
  proximosDias.setDate(hoje.getDate() + 7);

  const prazosProximos = processos.filter((p) => {
    if (!p.proximoPrazo) return false;
    const dataPrazo = new Date(p.proximoPrazo);
    return dataPrazo >= hoje && dataPrazo <= proximosDias;
  }).length;

  // ---------- Análise de sucesso ----------
  const processosProcedentes = processos.filter(
    (p) =>
      p.status === 'Finalizado procedente' ||
      p.status === 'finalizado-procedente' ||
      p.status === 'finalizado---procedente'
  ).length;

  const processosImprocedentes = processos.filter(
    (p) =>
      p.status === 'Finalizado improcedente' ||
      p.status === 'finalizado-improcedente' ||
      p.status === 'finalizado---improcedente'
  ).length;

  const processosParcialmenteProcedentes = processos.filter(
    (p) =>
      p.status === 'Finalizado parcialmente procedente' ||
      p.status === 'finalizado-parcialmente-procedente' ||
      p.status === 'finalizado---parcialmente-procedente'
  ).length;

  const processosAcordo = processos.filter(
    (p) =>
      p.status === 'Finalizado acordo' ||
      p.status === 'finalizado-acordo' ||
      p.status === 'finalizado---acordo'
  ).length;

  const totalFinalizados =
    processosProcedentes +
    processosImprocedentes +
    processosParcialmenteProcedentes +
    processosAcordo;

  const taxaSucesso =
    totalFinalizados > 0
      ? (
          ((processosProcedentes + processosParcialmenteProcedentes + processosAcordo) /
            totalFinalizados) *
          100
        ).toFixed(1)
      : 0;

  // ---------- Áreas prioritárias ----------
  const areasPrioritarias = {
    'Ação Trabalhista': 0,
    'Ação de Indenização': 0,
    'Ação de Alimentos': 0,
    'Ação de Divórcio': 0,
    'Ação de Cobrança': 0,
    'Ação de Despejo': 0,
    Outros: 0,
  };

  processos.forEach((p) => {
    const tipo = p.tipoAcao || 'Outros';
    if (tipo in areasPrioritarias) {
      areasPrioritarias[tipo as keyof typeof areasPrioritarias]++;
    } else {
      areasPrioritarias['Outros']++;
    }
  });

  const processosPrincipais =
    areasPrioritarias['Ação Trabalhista'] +
    areasPrioritarias['Ação de Indenização'] +
    areasPrioritarias['Ação de Alimentos'] +
    areasPrioritarias['Ação de Divórcio'] +
    areasPrioritarias['Ação de Cobrança'];

  const totalParaAnalise = processos.length;
  const percentualFoco = totalParaAnalise > 0 ? ((processosPrincipais / totalParaAnalise) * 100).toFixed(1) : 0;

  const dadosDistribuicao = [
    { name: 'Ação Trabalhista', value: areasPrioritarias['Ação Trabalhista'], fill: '#a16535', prioridade: 1 },
    { name: 'Ação de Indenização', value: areasPrioritarias['Ação de Indenização'], fill: '#d4a574', prioridade: 2 },
    { name: 'Ação de Alimentos', value: areasPrioritarias['Ação de Alimentos'], fill: '#e8b882', prioridade: 3 },
    { name: 'Ação de Divórcio', value: areasPrioritarias['Ação de Divórcio'], fill: '#8b5329', prioridade: 4 },
    { name: 'Ação de Cobrança', value: areasPrioritarias['Ação de Cobrança'], fill: '#6b5544', prioridade: 5 },
    { name: 'Ação de Despejo', value: areasPrioritarias['Ação de Despejo'], fill: '#9d7f66', prioridade: 6 },
    { name: 'Outros', value: areasPrioritarias['Outros'], fill: '#d4c4b0', prioridade: 7 },
  ]
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // ---------- Label personalizado (pizza) ----------
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, index } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const entry = dadosStatus[index];
    const lines = entry.name.split(' ');

    return (
      <g>
        <text x={x} y={y - 18} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fill="#4a3629" fontSize="13px" fontWeight="500">
          {lines[0]}
        </text>
        <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fill="#4a3629" fontSize="13px" fontWeight="500">
          {lines[1]}
        </text>
        <text x={x} y={y + 18} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fill="#a16535" fontSize="14px" fontWeight="600">
          {`${entry.value} processo${entry.value > 1 ? 's' : ''} (${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  // ---------- TOOLTIP CUSTOMIZADO (SEM value:) ----------
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-[#d4c4b0] rounded-lg shadow-lg">
          <p className="text-[#2d1f16] font-semibold text-sm">{label}</p>
          <p className="text-[#a16535] font-medium text-sm">
            {payload[0].value} processo{payload[0].value > 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ---------- Cabeçalho ---------- */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl text-[#2d1f16] flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#a16535]" />
              Dashboard - Visão Geral
            </h2>
            <p className="text-[#6b5544]">Métricas e indicadores para tomada de decisão</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {usuarioTipo === 'administrador' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-[#d4a574] text-[#a16535] hover:bg-[#d4a574] hover:text-white transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resetar Dados
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#f6f3ee]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#2d1f16]">Confirmar Reset de Dados</AlertDialogTitle>
                    <AlertDialogDescription className="text-[#6b5544]">
                      Esta ação irá apagar TODOS os dados atuais e restaurar os dados de exemplo padrão. <br />
                      <br />
                      <strong>Esta ação não pode ser desfeita!</strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-[#a16535] text-[#a16535] hover:bg-[#f6f3ee]">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetarDados}
                      className="bg-[#a16535] hover:bg-[#8b5329] text-white"
                    >
                      Confirmar Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button
              variant="outline"
              onClick={onVoltar}
              className="w-full sm:w-auto !bg-white !text-[#a16535] border-2 border-[#955d30] hover:!bg-[#a16535] hover:!text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Página Inicial
            </Button>
          </div>
        </div>
      </div>

      {/* ---------- Cards de métricas ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-[#d4c4b0]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[#6b5544]">Total de Clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl text-[#a16535]">{totalClientes}</div>
                <div className="text-sm text-[#6b5544] mt-1">
                  {clientesPF} PF • {clientesPJ} PJ
                </div>
              </div>
              <Users className="w-10 h-10 text-[#a16535] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#d4c4b0]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[#6b5544]">Total de Processos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl text-[#a16535]">{totalProcessos}</div>
                <div className="text-sm text-[#6b5544] mt-1">{processosUrgentes} urgentes</div>
              </div>
              <FileText className="w-10 h-10 text-[#a16535] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#d4c4b0]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[#6b5544]">Valor em Contratos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl text-[#a16535]">{formatCurrency(valorTotalContratos)}</div>
                <div className="text-sm text-[#6b5544] mt-1">Total de honorários</div>
              </div>
              <DollarSign className="w-10 h-10 text-[#a16535] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#d4c4b0]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[#6b5544]">Prazos Próximos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl text-[#a16535]">{prazosProximos}</div>
                <div className="text-sm text-[#6b5544] mt-1">Próximos 7 dias</div>
              </div>
              <Calendar className="w-10 h-10 text-[#a16535] opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------- Análise de Sucesso ---------- */}
      {totalFinalizados > 0 && (
        <div className="bg-gradient-to-r from-[#f6f3ee] to-white border-2 border-[#a16535] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#a16535] p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-[#2d1f16] text-xl">Análise de Desempenho Processual</h3>
              <p className="text-[#6b5544] text-sm">Resultados dos processos finalizados</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-white border-[#d4c4b0]">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-3xl text-[#a16535] mb-1">{totalFinalizados}</div>
                  <div className="text-xs text-[#6b5544]">Total Finalizados</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-300">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-3xl text-green-700 mb-1">{processosProcedentes}</div>
                  <div className="text-xs text-green-600">Procedentes</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-300">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-3xl text-yellow-700 mb-1">{processosParcialmenteProcedentes}</div>
                  <div className="text-xs text-yellow-600">Parcial</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-300">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-3xl text-blue-700 mb-1">{processosAcordo}</div>
                  <div className="text-xs text-blue-600">Acordos</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-300">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-3xl text-red-700 mb-1">{processosImprocedentes}</div>
                  <div className="text-xs text-red-600">Improcedentes</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 p-4 bg-[#a16535]/10 rounded-lg border border-[#a16535]/30">
            <div className="flex items-center justify-between">
              <span className="text-[#4a3629]">Taxa de Sucesso do Escritório:</span>
              <div className="flex items-center gap-2">
                <div className="text-2xl text-[#a16535]">{taxaSucesso}%</div>
                <Badge className="bg-[#a16535] text-white hover:bg-[#8b5329]">
                  {processosProcedentes + processosParcialmenteProcedentes + processosAcordo} casos favoráveis
                </Badge>
              </div>
            </div>
            <p className="text-xs text-[#6b5544] mt-2">
              * Considera procedentes, parcialmente procedentes e acordos como resultados favoráveis
            </p>
          </div>
        </div>
      )}

      {/* ---------- Gráficos: Taxa de Sucesso + Processos por Fase ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Taxa de Sucesso (Pizza) */}
        {dadosStatus.length > 0 && (
          <Card className="bg-white border-[#d4c4b0]">
            <CardHeader>
              <CardTitle className="text-[#2d1f16] flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#a16535]" />
                Taxa de Sucesso do Escritório
              </CardTitle>
              <CardDescription className="text-[#6b5544]">
                Procedentes vs Improcedentes (processos finalizados)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={dadosStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomizedLabel}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {dadosStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Processos por Fase (Barra) */}
        <Card className="bg-white border-[#d4c4b0]">
          <CardHeader>
            <CardTitle className="text-[#2d1f16] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#a16535]" />
              Processos por Fase Processual
            </CardTitle>
            <CardDescription className="text-[#6b5544]">Distribuição por fase do processo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosFase}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4c4b0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b5544', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#6b5544' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#a16535" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ---------- Foco nas Áreas ---------- */}
      {totalParaAnalise > 0 && (
        <div className="bg-gradient-to-r from-white to-[#f6f3ee] border-2 border-[#a16535] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#a16535] p-3 rounded-full">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-[#2d1f16] text-xl">Foco nas Áreas de Especialização</h3>
              <p className="text-[#6b5544] text-sm">Distribuição de todos os processos por tipo de ação</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <Card className="bg-[#a16535]/10 border-[#a16535]">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl text-[#a16535] mb-1">{areasPrioritarias['Ação Trabalhista']}</div>
                  <div className="text-xs text-[#4a3629]">⚖️Trabalhista</div>
                  <Badge className="mt-1 bg-[#a16535] text-white text-[10px] px-2 py-0">Prioridade 1</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#d4a574]/20 border-[#d4a574]">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl text-[#8b5329] mb-1">{areasPrioritarias['Ação de Indenização']}</div>
                  <div className="text-xs text-[#4a3629]">💰Indenização</div>
                  <Badge className="mt-1 bg-[#d4a574] text-white text-[10px] px-2 py-0">Prioridade 2</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#e8b882]/20 border-[#e8b882]">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl text-[#8b5329] mb-1">{areasPrioritarias['Ação de Alimentos']}</div>
                  <div className="text-xs text-[#4a3629]">🍽️Alimentos</div>
                  <Badge className="mt-1 bg-[#e8b882] text-white text-[10px] px-2 py-0">Prioridade 3</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#8b5329]/20 border-[#8b5329]">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl text-[#6b5544] mb-1">{areasPrioritarias['Ação de Divórcio']}</div>
                  <div className="text-xs text-[#4a3629]">💔Divórcio</div>
                  <Badge className="mt-1 bg-[#8b5329] text-white text-[10px] px-2 py-0">Prioridade 4</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#6b5544]/20 border-[#6b5544]">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl text-[#4a3629] mb-1">{areasPrioritarias['Ação de Cobrança']}</div>
                  <div className="text-xs text-[#4a3629]"> 💵 Cobrança</div>
                  <Badge className="mt-1 bg-[#6b5544] text-white text-[10px] px-2 py-0">Prioridade 5</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 p-4 bg-[#a16535]/10 rounded-lg border border-[#a16535]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#4a3629]">Processos nas 5 Áreas Prioritárias:</span>
              <div className="flex items-center gap-2">
                <div className="text-2xl text-[#a16535]">{percentualFoco}%</div>
                <Badge
                  className={`${
                    Number(percentualFoco) >= 70
                      ? 'bg-green-600'
                      : Number(percentualFoco) >= 50
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  } text-white hover:opacity-90`}
                >
                  {processosPrincipais} de {totalParaAnalise} processos
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-2">
              <Briefcase className="w-4 h-4 text-[#a16535] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#6b5544]">
                {Number(percentualFoco) >= 70
                  ? 'Excelente! O escritório está altamente focado nas suas áreas de especialização.'
                  : Number(percentualFoco) >= 50
                  ? 'Atenção! Considere redirecionar esforços para as áreas prioritárias.'
                  : 'Alerta! Muitos processos fora das áreas de especialização. Revise a estratégia.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Distribuição por Tipo de Ação (Barra vertical) ---------- */}
      {dadosDistribuicao.length > 0 && (
        <Card className="bg-white border-[#d4c4b0]">
          <CardHeader>
            <CardTitle className="text-[#2d1f16] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#a16535]" />
              Distribuição de Processos por Tipo de Ação
            </CardTitle>
            <CardDescription className="text-[#6b5544]">
              5 áreas prioritárias: Trabalhista, Indenização, Alimentos, Divórcio e Cobrança ({totalParaAnalise}{' '}
              processos)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dadosDistribuicao} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#d4c4b0" />
                <XAxis type="number" tick={{ fill: '#6b5544' }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#6b5544', fontSize: 13 }} width={180} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {dadosDistribuicao.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-[#f6f3ee] rounded-lg border border-[#d4c4b0]">
              <p className="text-xs text-[#6b5544]">
                <strong className="text-[#a16535]">Insight:</strong> As 5 primeiras categorias representam as
                áreas prioritárias do escritório.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ---------- Alertas ---------- */}
      {(processosUrgentes > 0 || prazosProximos > 0) && (
        <Card className="bg-[#a16535]/10 border-[#a16535]">
          <CardHeader>
            <CardTitle className="text-[#2d1f16] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#a16535]" />
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {processosUrgentes > 0 && (
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500/30 text-red-700 border-red-600">Atenção</Badge>
                <p className="text-[#4a3629]">
                  Você possui <strong>{processosUrgentes}</strong> processo(s) com prioridade urgente ou alta
                </p>
              </div>
            )}
            {prazosProximos > 0 && (
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500/30 text-yellow-700 border-yellow-600">Prazo</Badge>
                <p className="text-[#4a3629]">
                  <strong>{prazosProximos}</strong> prazo(s) vencendo nos próximos 7 dias
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}