import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { FileText, Search, Plus, DollarSign, AlertCircle, Edit, Eye, X, PlusCircle, Settings, Trash2, Bell, ArrowLeft, Check, ChevronsUpDown } from 'lucide-react';
import { useProcessos, Processo } from '../contexts/ProcessosContext';
import { useClientes } from '../contexts/ClientesContext';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { formatDateBR, formatCurrency, formatPercentage, formatNumeroContrato, formatNumeroProcesso, formatCPF, formatCNPJ } from '../utils/formatters';

interface ProcessosViewProps {
  processoIdParaEditar?: string | null;
  onClearProcessoIdParaEditar?: () => void;
  onVoltar: () => void;
}

export function ProcessosView({ processoIdParaEditar, onClearProcessoIdParaEditar, onVoltar }: ProcessosViewProps) {
  const { processos, adicionarProcesso, atualizarProcesso, buscarProcessos } = useProcessos();
  const { buscarClientes } = useClientes();

  const [activeTab, setActiveTab] = useState<'cadastrar' | 'consultar'>('consultar');
  const [processoEmEdicao, setProcessoEmEdicao] = useState<Processo | null>(null);
  const [processoVisualizacao, setProcessoVisualizacao] = useState<Processo | null>(null);

  // Pesquisa
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [resultadosPesquisa, setResultadosPesquisa] = useState<Processo[]>(processos);

  // Atualiza resultados quando a lista de processos muda
  useEffect(() => {
    setResultadosPesquisa(processos);
  }, [processos]);

  // Pesquisa de cliente
  const [tipoDocumento, setTipoDocumento] = useState<'cpf' | 'cnpj'>('cpf');
  const [documentoPesquisa, setDocumentoPesquisa] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);

  // Opções customizáveis (ordenadas alfabeticamente)
  const [opcoesPoloProcessual, setOpcoesPoloProcessual] = useState([
    'Autor / Requerente / Reclamante',
    'Réu / Requerido / Reclamado',
    'Terceiro Interessado',
  ].sort((a, b) => a.localeCompare(b, 'pt-BR')));
  const [opcoesFaseProcessual, setOpcoesFaseProcessual] = useState([
    'Distribuição',
    'Petição Inicial Recebida',
    'Citação do Réu',
    'Contestação',
    'Réplica',
    'Saneamento',
    'Instrução',
    'Audiência de Instrução e Julgamento',
    'Memoriais',
    'Sentença',
    'Recurso',
    'Execução',
    'Atos de constrição',
    'Arquivamento',
    'Inquérito Policial',
    'Denúncia ou Queixa',
    'Recebimento da Denúncia',
    'Resposta à Acusação',
    'Distribuição da Reclamação',
    'Notificação do Réu',
    'Audiência Inicial',
    'Audiência de Julgamento',
    'Recurso Ordinário',
    'Execução Trabalhista',
    'Execução Penal',
  ].sort((a, b) => a.localeCompare(b, 'pt-BR')));
  const [opcoesTipoAcao, setOpcoesTipoAcao] = useState([
    'Ação Civil Pública',
    'Ação de Alimentos',
    'Ação de Cobrança',
    'Ação de Despejo',
    'Ação de Divórcio',
    'Ação de Indenização',
    'Ação Trabalhista',
    'Execução Fiscal',
    'Habeas Corpus',
    'Mandado de Segurança',
  ].sort((a, b) => a.localeCompare(b, 'pt-BR')));
  // Estrutura de tribunais hierárquica
  const tribunaisData = {
    'Tribunais Superiores': [
      'Supremo Tribunal Federal (STF)',
      'Superior Tribunal de Justiça (STJ)',
      'Superior Tribunal Militar (STM)',
      'Tribunal Superior do Trabalho (TST)',
      'Tribunal Superior Eleitoral (TSE)',
    ].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    'Tribunais Regionais Federais': [
      'Tribunal Regional Federal da 1ª Região (TRF1) (AC, AM, AP, BA, DF, GO, MA, MT, PA, PI, RO, RR e TO)',
      'Tribunal Regional Federal da 2ª Região (TRF2) (ES e RJ)',
      'Tribunal Regional Federal da 3ª Região (TRF3) (MS e SP)',
      'Tribunal Regional Federal da 4ª Região (TRF4) (PR, RS e SC)',
      'Tribunal Regional Federal da 5ª Região (TRF5) (AL, CE, PB, PE, RN e SE)',
      'Tribunal Regional Federal da 6ª Região (TRF6) (MG)',
    ].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    'Tribunais de Justiça': [
      'Tribunal de Justiça do Acre (TJAC)',
      'Tribunal de Justiça de Alagoas (TJAL)',
      'Tribunal de Justiça do Amapá (TJAP)',
      'Tribunal de Justiça do Amazonas (TJAM)',
      'Tribunal de Justiça da Bahia (TJBA)',
      'Tribunal de Justiça do Ceará (TJCE)',
      'Tribunal de Justiça do Distrito Federal e Territórios (TJDFT)',
      'Tribunal de Justiça do Espírito Santo (TJES)',
      'Tribunal de Justiça de Goiás (TJGO)',
      'Tribunal de Justiça do Maranhão (TJMA)',
      'Tribunal de Justiça de Mato Grosso (TJMT)',
      'Tribunal de Justiça de Mato Grosso do Sul (TJMS)',
      'Tribunal de Justiça de Minas Gerais (TJMG)',
      'Tribunal de Justiça do Pará (TJPA)',
      'Tribunal de Justiça da Paraíba (TJPB)',
      'Tribunal de Justiça do Paraná (TJPR)',
      'Tribunal de Justiça de Pernambuco (TJPE)',
      'Tribunal de Justiça do Piauí (TJPI)',
      'Tribunal de Justiça do Rio de Janeiro (TJRJ)',
      'Tribunal de Justiça do Rio Grande do Norte (TJRN)',
      'Tribunal de Justiça do Rio Grande do Sul (TJRS)',
      'Tribunal de Justiça de Rondônia (TJRO)',
      'Tribunal de Justiça de Roraima (TJRR)',
      'Tribunal de Justiça de Santa Catarina (TJSC)',
      'Tribunal de Justiça de São Paulo (TJSP)',
      'Tribunal de Justiça de Sergipe (TJSE)',
      'Tribunal de Justiça do Tocantins (TJTO)',
    ].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    'Tribunais Regionais Eleitorais': [
      'Tribunal Regional Eleitoral do Acre',
      'Tribunal Regional Eleitoral de Alagoas',
      'Tribunal Regional Eleitoral do Amapá',
      'Tribunal Regional Eleitoral do Amazonas',
      'Tribunal Regional Eleitoral da Bahia',
      'Tribunal Regional Eleitoral do Ceará',
      'Tribunal Regional Eleitoral do Distrito Federal',
      'Tribunal Regional Eleitoral do Espírito Santo',
      'Tribunal Regional Eleitoral de Goiás',
      'Tribunal Regional Eleitoral do Maranhão',
      'Tribunal Regional Eleitoral do Mato Grosso',
      'Tribunal Regional Eleitoral do Mato Grosso do Sul',
      'Tribunal Regional Eleitoral de Minas Gerais',
      'Tribunal Regional Eleitoral do Pará',
      'Tribunal Regional Eleitoral da Paraíba',
      'Tribunal Regional Eleitoral do Paraná',
      'Tribunal Regional Eleitoral de Pernambuco',
      'Tribunal Regional Eleitoral do Piauí',
      'Tribunal Regional Eleitoral do Rio de Janeiro',
      'Tribunal Regional Eleitoral do Rio Grande do Norte',
      'Tribunal Regional Eleitoral do Rio Grande do Sul',
      'Tribunal Regional Eleitoral de Rondônia',
      'Tribunal Regional Eleitoral de Roraima',
      'Tribunal Regional Eleitoral de Santa Catarina',
      'Tribunal Regional Eleitoral de São Paulo',
      'Tribunal Regional Eleitoral de Sergipe',
      'Tribunal Regional Eleitoral de Tocantins',
    ].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    'Tribunais Regionais do Trabalho': [
      'Tribunal Regional do Trabalho da 1ª Região (TRT1) (RJ)',
      'Tribunal Regional do Trabalho da 2ª Região (TRT2) (SP / Grande São Paulo e Baixada Santista)',
      'Tribunal Regional do Trabalho da 3ª Região (TRT3) (MG)',
      'Tribunal Regional do Trabalho da 4ª Região (TRT4) (RS)',
      'Tribunal Regional do Trabalho da 5ª Região (TRT5) (BA)',
      'Tribunal Regional do Trabalho da 6ª Região (TRT6) (PE)',
      'Tribunal Regional do Trabalho da 7ª Região (TRT7) (CE)',
      'Tribunal Regional do Trabalho da 8ª Região (TRT8) (AP e PA)',
      'Tribunal Regional do Trabalho da 9ª Região (TRT9) (PR)',
      'Tribunal Regional do Trabalho da 10ª Região (TRT10) (DF e TO)',
      'Tribunal Regional do Trabalho da 11ª Região (TRT11) (AM e RR)',
      'Tribunal Regional do Trabalho da 12ª Região (TRT12) (SC)',
      'Tribunal Regional do Trabalho da 13ª Região (TRT13) (PB)',
      'Tribunal Regional do Trabalho da 14ª Região (TRT14) (AC e RO)',
      'Tribunal Regional do Trabalho da 15ª Região (TRT15) (SP / Interior e Litoral Norte e Sul)',
      'Tribunal Regional do Trabalho da 16ª Região (TRT16) (MA)',
      'Tribunal Regional do Trabalho da 17ª Região (TRT17) (ES)',
      'Tribunal Regional do Trabalho da 18ª Região (TRT18) (GO)',
      'Tribunal Regional do Trabalho da 19ª Região (TRT19) (AL)',
      'Tribunal Regional do Trabalho da 20ª Região (TRT20) (SE)',
      'Tribunal Regional do Trabalho da 21ª Região (TRT21) (RN)',
      'Tribunal Regional do Trabalho da 22ª Região (TRT22) (PI)',
      'Tribunal Regional do Trabalho da 23ª Região (TRT23) (MT)',
      'Tribunal Regional do Trabalho da 24ª Região (TRT24) (MS)',
    ].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    'Tribunais de Justiça Militar': [
      'Tribunal de Justiça Militar de Minas Gerais (TJMMG)',
      'Tribunal de Justiça Militar do Rio Grande do Sul (TJMRS)',
      'Tribunal de Justiça Militar de São Paulo (TJMSP)',
    ].sort((a, b) => a.localeCompare(b, 'pt-BR')),
  };

  const tiposTribunal = Object.keys(tribunaisData).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const [opcoesJurisdicao, setOpcoesJurisdicao] = useState([
    'Justiça Federal',
    'Justiça Estadual',
    'Justiça do Trabalho',
    'Justiça Eleitoral',
    'Justiça Militar',
  ].sort((a, b) => a.localeCompare(b, 'pt-BR')));
  const [opcoesCompetencia, setOpcoesCompetencia] = useState([
    'Cível',
    'Criminal',
    'Fazenda Pública',
    'Juizado Especial Cível',
    'Juizado Especial Criminal',
  ].sort((a, b) => a.localeCompare(b, 'pt-BR')));
  const [opcoesStatusProcesso, setOpcoesStatusProcesso] = useState([
    'Em elaboração',
    'Pendente de distribuição',
    'Ativo',
    'Suspenso',
    'Finalizado acordo',
    'Finalizado procedente',
    'Finalizado parcialmente procedente',
    'Finalizado improcedente',
  ].sort((a, b) => a.localeCompare(b, 'pt-BR')));
  const [opcoesFormaPagamento, setOpcoesFormaPagamento] = useState([
    'À vista',
    'Boleto',
    'Cartão de Crédito',
    'Parcelado',
    'Pix',
    'Transferência Bancária',
  ].sort((a, b) => a.localeCompare(b, 'pt-BR')));

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

  // Dialog para adicionar opção customizada
  const [dialogAberto, setDialogAberto] = useState(false);
  const [campoPersonalizar, setCampoPersonalizar] = useState<string>('');
  const [novaOpcao, setNovaOpcao] = useState('');

  // Dialog para gerenciar opções existentes
  const [dialogGerenciarAberto, setDialogGerenciarAberto] = useState(false);
  const [campoGerenciar, setCampoGerenciar] = useState<string>('');
  const [opcaoParaExcluir, setOpcaoParaExcluir] = useState<string>('');
  const [alertExcluirAberto, setAlertExcluirAberto] = useState(false);

  // Estado para o popover da fase processual
  const [fasePopoverAberto, setFasePopoverAberto] = useState(false);

  // Dados do processo
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [dataDistribuicao, setDataDistribuicao] = useState('');
  const [polo, setPolo] = useState('');
  const [parteContraria, setParteContraria] = useState('');
  const [tipoAcao, setTipoAcao] = useState('');
  const [objetoAcao, setObjetoAcao] = useState('');
  const [valorCausa, setValorCausa] = useState('');
  const [faseProcessual, setFaseProcessual] = useState('');
  const [tipoTribunal, setTipoTribunal] = useState('');
  const [tribunal, setTribunal] = useState('');
  const [estado, setEstado] = useState('');
  const [numeroContratoHonorarios, setNumeroContratoHonorarios] = useState('');
  const [tipoJurisdicao, setTipoJurisdicao] = useState('');
  const [vara, setVara] = useState('');
  const [competencia, setCompetencia] = useState('');
  const [comarca, setComarca] = useState('');
  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [advogadoResponsavel, setAdvogadoResponsavel] = useState('');
  const [proximoPrazo, setProximoPrazo] = useState('');
  const [linkProcesso, setLinkProcesso] = useState('');
  const [observacoesProcesso, setObservacoesProcesso] = useState('');

  // Dados Financeiros
  const [valorContrato, setValorContrato] = useState('');
  const [percentualContrato, setPercentualContrato] = useState('');
  const [honorariosAdvocaticios, setHonorariosAdvocaticios] = useState('');
  const [honorariosSucumbencia, setHonorariosSucumbencia] = useState('');
  const [despesas, setDespesas] = useState<Array<{ id: string; valor: string; finalidade: string }>>([]);
  const [valorReceber, setValorReceber] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [statusFinanceiro, setStatusFinanceiro] = useState('');
  const [numeroParcelas, setNumeroParcelas] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [observacoesFinanceiras, setObservacoesFinanceiras] = useState('');

  // Notificações
  const [notificacoes, setNotificacoes] = useState<Array<{ id: string; tipo: string; dataEnvio: string; dataRecebimento: string }>>([]);
  const [observacoesNotificacoes, setObservacoesNotificacoes] = useState('');
  const [tiposNotificacao, setTiposNotificacao] = useState(['Email', 'Carta com AR', 'WhatsApp']);

  // Funções para gerenciar despesas processuais
  const adicionarDespesa = () => {
    const novaDespesa = {
      id: Date.now().toString(),
      valor: '',
      finalidade: ''
    };
    setDespesas([...despesas, novaDespesa]);
  };

  const removerDespesa = (id: string) => {
    setDespesas(despesas.filter(despesa => despesa.id !== id));
  };

  const atualizarDespesa = (id: string, campo: 'valor' | 'finalidade', valor: string) => {
    setDespesas(despesas.map(despesa =>
      despesa.id === id ? { ...despesa, [campo]: valor } : despesa
    ));
  };

  const abrirDialogPersonalizacao = (campo: string) => {
    setCampoPersonalizar(campo);
    setNovaOpcao('');
    setDialogAberto(true);
  };

  const adicionarOpcaoCustomizada = () => {
    if (!novaOpcao.trim()) {
      toast.error('Campo vazio', {
        description: 'Digite uma opção para adicionar.',
      });
      return;
    }

    switch (campoPersonalizar) {
      case 'polo':
        if (!opcoesPoloProcessual.includes(novaOpcao)) {
          const novaLista = [...opcoesPoloProcessual, novaOpcao].sort((a, b) => a.localeCompare(b, 'pt-BR'));
          setOpcoesPoloProcessual(novaLista);
          setPolo(novaOpcao);
        }
        break;
      case 'fase':
        if (!opcoesFaseProcessual.includes(novaOpcao)) {
          const novaLista = [...opcoesFaseProcessual, novaOpcao].sort((a, b) => a.localeCompare(b, 'pt-BR'));
          setOpcoesFaseProcessual(novaLista);
          setFaseProcessual(novaOpcao);
        }
        break;
      case 'tipoAcao':
        if (!opcoesTipoAcao.includes(novaOpcao)) {
          const novaLista = [...opcoesTipoAcao, novaOpcao].sort((a, b) => a.localeCompare(b, 'pt-BR'));
          setOpcoesTipoAcao(novaLista);
          setTipoAcao(novaOpcao);
        }
        break;
      case 'jurisdicao':
        if (!opcoesJurisdicao.includes(novaOpcao)) {
          const novaLista = [...opcoesJurisdicao, novaOpcao].sort((a, b) => a.localeCompare(b, 'pt-BR'));
          setOpcoesJurisdicao(novaLista);
          setTipoJurisdicao(novaOpcao.toLowerCase());
        }
        break;
      case 'competencia':
        if (!opcoesCompetencia.includes(novaOpcao)) {
          const novaLista = [...opcoesCompetencia, novaOpcao].sort((a, b) => a.localeCompare(b, 'pt-BR'));
          setOpcoesCompetencia(novaLista);
          setCompetencia(novaOpcao.toLowerCase());
        }
        break;
      case 'statusProcesso':
        if (!opcoesStatusProcesso.includes(novaOpcao)) {
          const novaLista = [...opcoesStatusProcesso, novaOpcao].sort((a, b) => a.localeCompare(b, 'pt-BR'));
          setOpcoesStatusProcesso(novaLista);
          setStatus(novaOpcao);
        }
        break;
      case 'formaPagamento':
        if (!opcoesFormaPagamento.includes(novaOpcao)) {
          const novaLista = [...opcoesFormaPagamento, novaOpcao].sort((a, b) => a.localeCompare(b, 'pt-BR'));
          setOpcoesFormaPagamento(novaLista);
          setFormaPagamento(novaOpcao);
        }
        break;
    }

    toast.success('Opção adicionada!', {
      description: `"${novaOpcao}" foi adicionado às opções.`,
    });

    setDialogAberto(false);
    setNovaOpcao('');
  };

  const abrirDialogGerenciar = (campo: string) => {
    setCampoGerenciar(campo);
    setDialogGerenciarAberto(true);
  };

  const confirmarExclusao = (opcao: string) => {
    setOpcaoParaExcluir(opcao);
    setAlertExcluirAberto(true);
  };

  const excluirOpcao = () => {
    switch (campoGerenciar) {
      case 'polo':
        setOpcoesPoloProcessual(opcoesPoloProcessual.filter(op => op !== opcaoParaExcluir));
        if (polo === opcaoParaExcluir) setPolo('');
        break;
      case 'fase':
        setOpcoesFaseProcessual(opcoesFaseProcessual.filter(op => op !== opcaoParaExcluir));
        if (faseProcessual === opcaoParaExcluir) setFaseProcessual('');
        break;
      case 'tipoAcao':
        setOpcoesTipoAcao(opcoesTipoAcao.filter(op => op !== opcaoParaExcluir));
        if (tipoAcao === opcaoParaExcluir) setTipoAcao('');
        break;
      case 'jurisdicao':
        setOpcoesJurisdicao(opcoesJurisdicao.filter(op => op !== opcaoParaExcluir));
        if (tipoJurisdicao === opcaoParaExcluir.toLowerCase()) setTipoJurisdicao('');
        break;
      case 'competencia':
        setOpcoesCompetencia(opcoesCompetencia.filter(op => op !== opcaoParaExcluir));
        if (competencia === opcaoParaExcluir.toLowerCase()) setCompetencia('');
        break;
      case 'statusProcesso':
        setOpcoesStatusProcesso(opcoesStatusProcesso.filter(op => op !== opcaoParaExcluir));
        if (status === opcaoParaExcluir) setStatus('');
        break;
      case 'formaPagamento':
        setOpcoesFormaPagamento(opcoesFormaPagamento.filter(op => op !== opcaoParaExcluir));
        if (formaPagamento === opcaoParaExcluir) setFormaPagamento('');
        break;
    }

    toast.success('Opção excluída!', {
      description: `"${opcaoParaExcluir}" foi removido das opções.`,
    });

    setAlertExcluirAberto(false);
    setOpcaoParaExcluir('');
  };

  const getOpcoesLista = (campo: string): string[] => {
    switch (campo) {
      case 'polo': return opcoesPoloProcessual;
      case 'fase': return opcoesFaseProcessual;
      case 'tipoAcao': return opcoesTipoAcao;
      case 'jurisdicao': return opcoesJurisdicao;
      case 'competencia': return opcoesCompetencia;
      case 'statusProcesso': return opcoesStatusProcesso;
      case 'formaPagamento': return opcoesFormaPagamento;
      default: return [];
    }
  };

  const getNomeCampo = (campo: string): string => {
    switch (campo) {
      case 'polo': return 'Polo Processual';
      case 'fase': return 'Fase Processual';
      case 'tipoAcao': return 'Tipo de Ação';
      case 'jurisdicao': return 'Tipo de Jurisdição';
      case 'competencia': return 'Competência';
      case 'statusProcesso': return 'Status do Processo';
      case 'formaPagamento': return 'Forma de Pagamento';
      default: return '';
    }
  };

  const handlePesquisarCliente = () => {
    const resultados = buscarClientes({
      cpf: tipoDocumento === 'cpf' ? documentoPesquisa : '',
      cnpj: tipoDocumento === 'cnpj' ? documentoPesquisa : '',
    });

    if (resultados.length > 0) {
      setClienteSelecionado(resultados[0]);
      toast.success('Cliente encontrado!', {
        description: `${resultados[0].nome} - ${resultados[0].documento}`,
      });
    } else {
      setClienteSelecionado(null);
      toast.error('Cliente não encontrado', {
        description: 'Verifique o documento informado ou cadastre o cliente primeiro.',
      });
    }
  };

  const handlePesquisarProcessos = () => {
    const resultados = buscarProcessos({
      numeroProcesso: termoPesquisa,
      clienteDocumento: termoPesquisa,
      clienteNome: termoPesquisa,
    });
    setResultadosPesquisa(resultados);
  };

  const handleEditarProcesso = (processo: Processo) => {
    setProcessoEmEdicao(processo);

    // Buscar e selecionar o cliente
    const cliente = buscarClientes({
      cpf: processo.clienteDocumento.includes('/') ? '' : processo.clienteDocumento,
      cnpj: processo.clienteDocumento.includes('/') ? processo.clienteDocumento : '',
    });

    if (cliente.length > 0) {
      setClienteSelecionado(cliente[0]);
      setTipoDocumento(processo.clienteDocumento.includes('/') ? 'cnpj' : 'cpf');
      setDocumentoPesquisa(processo.clienteDocumento);
    }

    // Preencher todos os campos
    setNumeroProcesso(processo.numeroProcesso);
    setDataDistribuicao(processo.dataDistribuicao);
    setPolo(processo.polo);
    setParteContraria(processo.parteContraria);
    setTipoAcao(processo.tipoAcao);
    setObjetoAcao(processo.objetoAcao);
    setValorCausa(processo.valorCausa);
    setFaseProcessual(processo.faseProcessual);
    // Detectar tipo de tribunal baseado no tribunal salvo
    let tipoDetectado = '';
    for (const [tipo, tribunais] of Object.entries(tribunaisData)) {
      if (tribunais.includes(processo.tribunal)) {
        tipoDetectado = tipo;
        break;
      }
    }
    setTipoTribunal(tipoDetectado);
    setTribunal(processo.tribunal);
    setEstado(processo.estado);
    setNumeroContratoHonorarios(processo.numeroContratoHonorarios);
    setTipoJurisdicao(processo.tipoJurisdicao);
    setVara(processo.vara);
    setCompetencia(processo.competencia);
    setComarca(processo.comarca);
    setStatus(processo.status);
    setPrioridade(processo.prioridade);
    setAdvogadoResponsavel(processo.advogadoResponsavel);
    setProximoPrazo(processo.proximoPrazo);
    setLinkProcesso(processo.linkProcesso);
    setObservacoesProcesso(processo.observacoesProcesso);
    setValorContrato(processo.valorContrato);
    setPercentualContrato(processo.percentualContrato);
    setHonorariosAdvocaticios(processo.honorariosAdvocaticios);
    setHonorariosSucumbencia(processo.honorariosSucumbencia);
    setDespesas(processo.despesas);
    setValorReceber(processo.valorReceber);
    setDataVencimento(processo.dataVencimento);
    setFormaPagamento(processo.formaPagamento);
    setStatusFinanceiro(processo.statusFinanceiro);
    setNumeroParcelas(processo.numeroParcelas);
    setDataPagamento(processo.dataPagamento);
    setObservacoesFinanceiras(processo.observacoesFinanceiras);
    setNotificacoes(processo.notificacoes || []);
    setObservacoesNotificacoes(processo.observacoesNotificacoes || '');

    setActiveTab('cadastrar');
  };

  const handleCadastrarProcesso = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteSelecionado) {
      toast.error('Selecione um cliente', {
        description: 'É necessário vincular o processo a um cliente.',
      });
      return;
    }

    const dadosProcesso = {
      clienteId: clienteSelecionado.id,
      clienteNome: clienteSelecionado.nome,
      clienteDocumento: clienteSelecionado.documento,
      numeroProcesso,
      dataDistribuicao,
      polo,
      parteContraria,
      tipoAcao,
      objetoAcao,
      valorCausa,
      faseProcessual,
      tribunal,
      estado,
      numeroContratoHonorarios,
      tipoJurisdicao,
      vara,
      competencia,
      comarca,
      status,
      prioridade,
      advogadoResponsavel,
      proximoPrazo,
      linkProcesso,
      observacoesProcesso,
      valorContrato,
      percentualContrato,
      honorariosAdvocaticios,
      honorariosSucumbencia,
      despesas,
      valorReceber,
      dataVencimento,
      formaPagamento,
      statusFinanceiro,
      numeroParcelas,
      dataPagamento,
      observacoesFinanceiras,
      notificacoes,
      observacoesNotificacoes,
    };

    if (processoEmEdicao) {
      atualizarProcesso(processoEmEdicao.id, dadosProcesso);
      toast.success('Processo atualizado com sucesso!', {
        description: numeroProcesso ? `Processo ${numeroProcesso} foi atualizado.` : 'Processo foi atualizado com sucesso.',
        duration: 4000,
      });
      setProcessoEmEdicao(null);
    } else {
      adicionarProcesso(dadosProcesso);
      toast.success('Processo cadastrado com sucesso!', {
        description: numeroProcesso
          ? `Processo ${numeroProcesso} vinculado a ${clienteSelecionado.nome}`
          : `Processo pré-processual vinculado a ${clienteSelecionado.nome}`,
        duration: 4000,
      });
    }

    limparFormulario();

    setTimeout(() => {
      setActiveTab('consultar');
    }, 1500);
  };

  const limparFormulario = () => {
    setDocumentoPesquisa('');
    setClienteSelecionado(null);
    setNumeroProcesso('');
    setDataDistribuicao('');
    setPolo('');
    setParteContraria('');
    setTipoAcao('');
    setObjetoAcao('');
    setValorCausa('');
    setFaseProcessual('');
    setTipoTribunal('');
    setTribunal('');
    setEstado('');
    setNumeroContratoHonorarios('');
    setTipoJurisdicao('');
    setVara('');
    setCompetencia('');
    setComarca('');
    setStatus('');
    setPrioridade('');
    setAdvogadoResponsavel('');
    setProximoPrazo('');
    setLinkProcesso('');
    setObservacoesProcesso('');
    setValorContrato('');
    setPercentualContrato('');
    setHonorariosAdvocaticios('');
    setHonorariosSucumbencia('');
    setDespesas([]);
    setValorReceber('');
    setDataVencimento('');
    setFormaPagamento('');
    setStatusFinanceiro('');
    setNumeroParcelas('');
    setDataPagamento('');
    setObservacoesFinanceiras('');
    setNotificacoes([]);
    setObservacoesNotificacoes('');
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente':
        return <Badge className="bg-red-500/30 text-red-700 border-red-600 font-medium">🔴 Urgente</Badge>;
      case 'alta':
        return <Badge className="bg-orange-500/30 text-orange-700 border-orange-600 font-medium">🟠 Alta</Badge>;
      case 'normal':
        return <Badge className="bg-yellow-500/30 text-yellow-700 border-yellow-600 font-medium">🟡 Normal</Badge>;
      case 'baixa':
        return <Badge className="bg-green-500/30 text-green-700 border-green-600 font-medium">🟢 Baixa</Badge>;
      default:
        return <Badge>{prioridade}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; label: string } } = {
      // Novos formatos sem traços
      'Em elaboração': { color: 'bg-purple-500/30 text-purple-700 border-purple-600 font-medium', label: 'Em elaboração' },
      'Pendente de distribuição': { color: 'bg-indigo-500/30 text-indigo-700 border-indigo-600 font-medium', label: 'Pendente de distribuição' },
      'Ativo': { color: 'bg-green-500/30 text-green-700 border-green-600 font-medium', label: 'Ativo' },
      'Suspenso': { color: 'bg-yellow-500/30 text-yellow-700 border-yellow-600 font-medium', label: 'Suspenso' },
      'Finalizado acordo': { color: 'bg-[#6b5544]/30 text-[#4a3629] border-[#6b5544] font-medium', label: 'Finalizado Acordo' },
      'Finalizado procedente': { color: 'bg-green-600/30 text-green-800 border-green-700 font-medium', label: 'Finalizado Procedente' },
      'Finalizado parcialmente procedente': { color: 'bg-blue-600/30 text-blue-800 border-blue-700 font-medium', label: 'Finalizado Parcialmente Procedente' },
      'Finalizado improcedente': { color: 'bg-red-600/30 text-red-800 border-red-700 font-medium', label: 'Finalizado Improcedente' },
      // Formatos antigos com traços (para retrocompatibilidade com dados já salvos)
      'em-elaboracao': { color: 'bg-purple-500/30 text-purple-700 border-purple-600 font-medium', label: 'Em elaboração' },
      'pendente-de-distribuicao': { color: 'bg-indigo-500/30 text-indigo-700 border-indigo-600 font-medium', label: 'Pendente de distribuição' },
      'ativo': { color: 'bg-green-500/30 text-green-700 border-green-600 font-medium', label: 'Ativo' },
      'suspenso': { color: 'bg-yellow-500/30 text-yellow-700 border-yellow-600 font-medium', label: 'Suspenso' },
      'finalizado-acordo': { color: 'bg-[#6b5544]/30 text-[#4a3629] border-[#6b5544] font-medium', label: 'Finalizado Acordo' },
      'finalizado-procedente': { color: 'bg-green-600/30 text-green-800 border-green-700 font-medium', label: 'Finalizado Procedente' },
      'finalizado-parcialmente-procedente': { color: 'bg-blue-600/30 text-blue-800 border-blue-700 font-medium', label: 'Finalizado Parcialmente Procedente' },
      'finalizado-improcedente': { color: 'bg-red-600/30 text-red-800 border-red-700 font-medium', label: 'Finalizado Improcedente' },
      'em-andamento': { color: 'bg-blue-500/30 text-blue-700 border-blue-600 font-medium', label: 'Em Andamento' },
      'arquivado': { color: 'bg-[#8b5329]/30 text-[#6b5544] border-[#8b5329] font-medium', label: 'Arquivado' },
    };
    const s = statusMap[status] || { color: '', label: status };
    return <Badge className={s.color}>{s.label}</Badge>;
  };

  const getLabelPolo = (polo: string) => {
    const labelMap: { [key: string]: string } = {
      'autor': 'Autor / Requerente',
      'reu': 'Réu / Requerido',
      'terceiro': 'Terceiro Interessado',
    };
    return labelMap[polo] || polo;
  };

  const getLabelFase = (fase: string) => {
    const labelMap: { [key: string]: string } = {
      'inicial': 'Inicial',
      'instrucao': 'Instrução',
      'sentenca': 'Sentença',
      'recursal': 'Recursal',
      'execucao': 'Execução',
      'arquivado': 'Arquivado',
    };
    return labelMap[fase] || fase;
  };

  // Effect para carregar processo para edição quando vindo do relatório
  useEffect(() => {
    if (processoIdParaEditar) {
      const processo = processos.find(p => p.id === processoIdParaEditar);
      if (processo) {
        handleEditarProcesso(processo);
        setActiveTab('cadastrar');
        toast.info('Processo carregado para edição');
      }
      // Limpar o ID após carregar
      onClearProcessoIdParaEditar?.();
    }
  }, [processoIdParaEditar]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl text-[#2d1f16] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#a16535]" />
              Gestão de Processos
            </h2>
            <p className="text-[#6b5544]">Cadastre, consulte e gerencie os processos jurídicos</p>
          </div>
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

      {/* Dialog para adicionar opção customizada */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="bg-white border-[#d4c4b0]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16]">Adicionar Nova Opção</DialogTitle>
            <DialogDescription className="text-[#6b5544]">
              Digite o nome da nova opção que deseja adicionar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#4a3629]">Nova Opção</Label>
              <Input
                value={novaOpcao}
                onChange={(e) => setNovaOpcao(e.target.value)}
                placeholder="Digite a nova opção..."
                className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    adicionarOpcaoCustomizada();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogAberto(false)}
              className="border-[#d4c4b0] text-[#2d1f16] hover:bg-[#f6f3ee] hover:text-[#2d1f16]"
            >
              Cancelar
            </Button>
            <Button
              onClick={adicionarOpcaoCustomizada}
              className="bg-[#a16535] hover:bg-[#8b5329] text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para gerenciar opções existentes */}
      <Dialog open={dialogGerenciarAberto} onOpenChange={setDialogGerenciarAberto}>
        <DialogContent className="bg-white border-[#d4c4b0] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16]">
              Gerenciar Opções - {getNomeCampo(campoGerenciar)}
            </DialogTitle>
            <DialogDescription className="text-[#6b5544]">
              Clique no ícone de lixeira para excluir uma opção.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {getOpcoesLista(campoGerenciar).map((opcao) => (
                <div
                  key={opcao}
                  className="flex items-center justify-between p-3 bg-[#f6f3ee] border border-[#d4c4b0] rounded-lg hover:bg-[#e8b882]/20 transition-colors"
                >
                  <span className="text-[#2d1f16]">{opcao}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmarExclusao(opcao)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {getOpcoesLista(campoGerenciar).length === 0 && (
                <p className="text-center text-[#6b5544] py-8">
                  Nenhuma opção cadastrada.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setDialogGerenciarAberto(false)}
              className="bg-[#a16535] hover:bg-[#8b5329] text-white"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para confirmar exclusão */}
      <AlertDialog open={alertExcluirAberto} onOpenChange={setAlertExcluirAberto}>
        <AlertDialogContent className="bg-white border-[#d4c4b0]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#2d1f16]">
              Tem certeza que deseja excluir?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#6b5544]">
              Você está prestes a excluir a opção "<strong className="text-[#a16535]">{opcaoParaExcluir}</strong>".
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#d4c4b0] text-[#2d1f16] hover:bg-[#f6f3ee] hover:text-[#2d1f16]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={excluirOpcao}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'cadastrar' | 'consultar')}>
        <TabsList className="grid w-full grid-cols-2 bg-[#f6f3ee] border-2 border-[#d4c4b0] p-1 rounded-full h-14">
          <TabsTrigger
            value="consultar"
            className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full h-full transition-all"
          >
            <Search className="w-4 h-4 mr-2" />
            Consultar Processos
          </TabsTrigger>
          <TabsTrigger
            value="cadastrar"
            className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full h-full transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Processo
          </TabsTrigger>
        </TabsList>

        {/* ABA CADASTRAR */}
        <TabsContent value="cadastrar">
          <Card className="bg-white border-[#d4c4b0]">
            <CardHeader>
              <CardTitle className="text-[#2d1f16]">
                {processoEmEdicao ? 'Editar Processo' : 'Novo Processo'}
              </CardTitle>
              <CardDescription className="text-[#6b5544]">
                {processoEmEdicao
                  ? 'Atualize as informações do processo'
                  : 'Primeiro, pesquise o cliente pelo CPF ou CNPJ para vincular ao processo'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processoEmEdicao && (
                <Alert className="mb-6 bg-[#a16535]/10 border-[#a16535]/50">
                  <AlertCircle className="w-4 h-4 text-[#a16535]" />
                  <AlertDescription className="text-[#a16535] flex items-center justify-between">
                    <span>Você está editando o processo: <strong>{processoEmEdicao.numeroProcesso}</strong></span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setProcessoEmEdicao(null);
                        limparFormulario();
                      }}
                      className="text-[#a16535] hover:text-[#8b5329]"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancelar Edição
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Pesquisa de Cliente */}
              <div className="space-y-4 mb-6 pb-6 border-b border-[#d4c4b0]">
                <h3 className="text-[#a16535]">Vincular Cliente</h3>

                <div className="space-y-2">
                  <Label className="text-[#4a3629]">Tipo de Documento</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={() => setTipoDocumento('cpf')}
                      className={`h-10 px-6 transition-all duration-200 ${tipoDocumento === 'cpf'
                        ? 'bg-[#a16535] hover:bg-[#8b5329] text-white border-2 border-[#a16535] shadow-md'
                        : 'bg-white hover:bg-[#f6f3ee] text-[#a16535] border-2 border-[#a16535]'
                        }`}
                    >
                      <span className={tipoDocumento === 'cpf' ? 'font-semibold' : 'font-medium'}>
                        CPF
                      </span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setTipoDocumento('cnpj')}
                      className={`h-10 px-6 transition-all duration-200 ${tipoDocumento === 'cnpj'
                        ? 'bg-[#a16535] hover:bg-[#8b5329] text-white border-2 border-[#a16535] shadow-md'
                        : 'bg-white hover:bg-[#f6f3ee] text-[#a16535] border-2 border-[#a16535]'
                        }`}
                    >
                      <span className={tipoDocumento === 'cnpj' ? 'font-semibold' : 'font-medium'}>
                        CNPJ
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documento-pesquisa" className="text-[#4a3629]">
                    {tipoDocumento === 'cpf' ? 'CPF' : 'CNPJ'}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="documento-pesquisa"
                      type="text"
                      placeholder={tipoDocumento === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                      value={documentoPesquisa}
                      onChange={(e) => {
                        const formatted = tipoDocumento === 'cpf'
                          ? formatCPF(e.target.value)
                          : formatCNPJ(e.target.value);
                        setDocumentoPesquisa(formatted);
                      }}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                    <Button
                      type="button"
                      onClick={handlePesquisarCliente}
                      className="bg-[#a16535] hover:bg-[#8b5329] text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Pesquisar
                    </Button>
                  </div>
                </div>

                {clienteSelecionado && (
                  <Alert className="bg-green-500/10 border-green-500/50">
                    <AlertDescription className="text-green-500">
                      <strong>Cliente selecionado:</strong> {clienteSelecionado.nome} - {clienteSelecionado.documento}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Formulário do Processo */}
              <form onSubmit={handleCadastrarProcesso} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[#a16535]">Dados do Processo</h3>

                  {/* Informações Básicas */}
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      <strong>Processo Pré-processual:</strong> O número do processo é opcional. Para processos ainda não ajuizados, deixe o campo vazio e selecione o status "Em elaboração" ou "Pendente de distribuição". Após ajuizar, edite o processo para adicionar o número.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="numero-processo" className="text-[#4a3629]">
                          Número do Processo <span className="text-[#6b5544] text-sm">(opcional)</span>
                        </Label>
                      </div>
                      <Input
                        id="numero-processo"
                        type="text"
                        placeholder="0000000-00.0000.0.00.0000 (deixe vazio se ainda não ajuizado)"
                        value={numeroProcesso}
                        onChange={(e) => setNumeroProcesso(formatNumeroProcesso(e.target.value))}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="data-distribuicao" className="text-[#4a3629]">
                          Data de Distribuição/Ajuizamento <span className="text-[#6b5544] text-sm">(opcional)</span>
                        </Label>
                      </div>
                      <Input
                        id="data-distribuicao"
                        type="date"
                        value={dataDistribuicao}
                        onChange={(e) => setDataDistribuicao(e.target.value)}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-6 flex items-center">
                      <Label htmlFor="advogado-responsavel" className="text-[#4a3629]">
                        Advogado Responsável
                      </Label>
                    </div>
                    <Input
                      id="advogado-responsavel"
                      type="text"
                      placeholder="Nome do advogado"
                      value={advogadoResponsavel}
                      onChange={(e) => setAdvogadoResponsavel(e.target.value)}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* PARTES E TIPO DE AÇÃO */}
                <div className="space-y-4">
                  <h3 className="text-[#a16535]">Partes e Tipo de Ação</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between h-6">
                        <Label htmlFor="polo" className="text-[#4a3629]">
                          Polo Processual
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirDialogGerenciar('polo')}
                          className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Gerenciar
                        </Button>
                      </div>
                      <Select
                        value={polo}
                        onValueChange={(value) => {
                          if (value === '__adicionar_novo__') {
                            abrirDialogPersonalizacao('polo');
                          } else {
                            setPolo(value);
                          }
                        }}
                      >
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                          <SelectValue placeholder="Selecione o polo" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0]">
                          {opcoesPoloProcessual.map((opcao) => (
                            <SelectItem key={opcao} value={opcao} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                              {opcao}
                            </SelectItem>
                          ))}
                          <Separator className="my-1 bg-[#d4c4b0]" />
                          <SelectItem
                            value="__adicionar_novo__"
                            className="text-[#a16535] hover:bg-[#f6f3ee] hover:text-[#8b5329]"
                          >
                            <div className="flex items-center gap-2">
                              <PlusCircle className="w-4 h-4" />
                              ✏️ Adicionar outro polo...
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="parte-contraria" className="text-[#4a3629]">
                          Parte Contrária
                        </Label>
                      </div>
                      <Input
                        id="parte-contraria"
                        type="text"
                        placeholder="Nome da parte adversa"
                        value={parteContraria}
                        onChange={(e) => setParteContraria(e.target.value)}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between h-6">
                        <Label htmlFor="tipo-acao" className="text-[#4a3629]">
                          Tipo de Ação
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirDialogGerenciar('tipoAcao')}
                          className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Gerenciar
                        </Button>
                      </div>
                      <Select
                        value={tipoAcao}
                        onValueChange={(value) => {
                          if (value === '__adicionar_novo__') {
                            abrirDialogPersonalizacao('tipoAcao');
                          } else {
                            setTipoAcao(value);
                          }
                        }}
                      >
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                          <SelectValue placeholder="Selecione o tipo de ação" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0]">
                          {opcoesTipoAcao.map((opcao) => (
                            <SelectItem key={opcao} value={opcao} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                              {opcao}
                            </SelectItem>
                          ))}
                          <Separator className="my-1 bg-[#d4c4b0]" />
                          <SelectItem
                            value="__adicionar_novo__"
                            className="text-[#a16535] hover:bg-[#f6f3ee] hover:text-[#8b5329]"
                          >
                            <div className="flex items-center gap-2">
                              <PlusCircle className="w-4 h-4" />
                              ✏️ Adicionar outro tipo...
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="valor-causa" className="text-[#4a3629]">
                          Valor da Causa
                        </Label>
                      </div>
                      <Input
                        id="valor-causa"
                        type="text"
                        placeholder="R$ 0,00"
                        value={valorCausa}
                        onChange={(e) => setValorCausa(formatCurrency(e.target.value))}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objeto-acao" className="text-[#4a3629]">
                      Objeto da Ação / Pedido Principal
                    </Label>
                    <Textarea
                      id="objeto-acao"
                      placeholder="Descreva resumidamente o objeto da ação e o pedido principal..."
                      value={objetoAcao}
                      onChange={(e) => setObjetoAcao(e.target.value)}
                      rows={2}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 resize-none"
                    />
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* LOCALIZAÇÃO E COMPETÊNCIA */}
                <div className="space-y-4">
                  <h3 className="text-[#a16535]">Localização e Competência</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="tipo-tribunal" className="text-[#4a3629]">
                          Tipo de Tribunal
                        </Label>
                      </div>
                      <Select
                        value={tipoTribunal}
                        onValueChange={(value) => {
                          setTipoTribunal(value);
                          setTribunal(''); // Limpa o tribunal específico ao mudar o tipo
                        }}
                      >
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                          <SelectValue placeholder="Selecione o tipo de tribunal" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0] max-h-[300px]">
                          {tiposTribunal.map((tipo) => (
                            <SelectItem key={tipo} value={tipo} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="tribunal" className="text-[#4a3629]">
                          Tribunal Específico
                        </Label>
                      </div>
                      <Select
                        value={tribunal}
                        onValueChange={setTribunal}
                        disabled={!tipoTribunal}
                      >
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                          <SelectValue placeholder={tipoTribunal ? "Selecione o tribunal" : "Primeiro selecione o tipo"} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0] max-h-[300px]">
                          {tipoTribunal && tribunaisData[tipoTribunal as keyof typeof tribunaisData]?.map((trib) => (
                            <SelectItem key={trib} value={trib} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                              {trib}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="estado" className="text-[#4a3629]">
                          Estado
                        </Label>
                      </div>
                      <Select value={estado} onValueChange={setEstado}>
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0] max-h-[300px]">
                          {estadosBrasileiros.map((estado) => (
                            <SelectItem
                              key={estado.sigla}
                              value={estado.sigla}
                              className="text-[#2d1f16] hover:bg-[#f6f3ee]"
                            >
                              {estado.sigla} - {estado.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="comarca" className="text-[#4a3629]">
                          Comarca
                        </Label>
                      </div>
                      <Input
                        id="comarca"
                        type="text"
                        placeholder="Ex: São Paulo"
                        value={comarca}
                        onChange={(e) => setComarca(e.target.value)}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="vara" className="text-[#4a3629]">
                          Vara
                        </Label>
                      </div>
                      <Input
                        id="vara"
                        type="text"
                        placeholder="Ex: 1ª Vara Cível"
                        value={vara}
                        onChange={(e) => setVara(e.target.value)}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between h-6">
                        <Label htmlFor="tipo-jurisdicao" className="text-[#4a3629]">
                          Tipo de Jurisdição
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirDialogGerenciar('jurisdicao')}
                          className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Gerenciar
                        </Button>
                      </div>
                      <Select
                        value={tipoJurisdicao}
                        onValueChange={(value) => {
                          if (value === '__adicionar_novo__') {
                            abrirDialogPersonalizacao('jurisdicao');
                          } else {
                            setTipoJurisdicao(value);
                          }
                        }}
                      >
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0]">
                          {opcoesJurisdicao.map((opcao) => (
                            <SelectItem
                              key={opcao}
                              value={opcao.toLowerCase()}
                              className="text-[#2d1f16] hover:bg-[#f6f3ee]"
                            >
                              {opcao}
                            </SelectItem>
                          ))}
                          <Separator className="my-1 bg-[#d4c4b0]" />
                          <SelectItem
                            value="__adicionar_novo__"
                            className="text-[#a16535] hover:bg-[#f6f3ee] hover:text-[#8b5329]"
                          >
                            <div className="flex items-center gap-2">
                              <PlusCircle className="w-4 h-4" />
                              ✏️ Adicionar outra jurisdição...
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between h-6">
                        <Label htmlFor="competencia" className="text-[#4a3629]">
                          Competência
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirDialogGerenciar('competencia')}
                          className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Gerenciar
                        </Button>
                      </div>
                      <Select
                        value={competencia}
                        onValueChange={(value) => {
                          if (value === '__adicionar_novo__') {
                            abrirDialogPersonalizacao('competencia');
                          } else {
                            setCompetencia(value);
                          }
                        }}
                      >
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0]">
                          {opcoesCompetencia.map((opcao) => (
                            <SelectItem
                              key={opcao}
                              value={opcao.toLowerCase().replace(/\s+/g, '-')}
                              className="text-[#2d1f16] hover:bg-[#f6f3ee]"
                            >
                              {opcao}
                            </SelectItem>
                          ))}
                          <Separator className="my-1 bg-[#d4c4b0]" />
                          <SelectItem
                            value="__adicionar_novo__"
                            className="text-[#a16535] hover:bg-[#f6f3ee] hover:text-[#8b5329]"
                          >
                            <div className="flex items-center gap-2">
                              <PlusCircle className="w-4 h-4" />
                              ✏️ Adicionar outra competência...
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* STATUS E ACOMPANHAMENTO */}
                <div className="space-y-4">
                  <h3 className="text-[#a16535]">Status e Acompanhamento</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between h-6">
                        <Label htmlFor="status" className="text-[#4a3629]">
                          Status do Processo
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirDialogGerenciar('statusProcesso')}
                          className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Gerenciar
                        </Button>
                      </div>
                      <Select
                        value={status}
                        onValueChange={(value) => {
                          if (value === '__adicionar_novo__') {
                            abrirDialogPersonalizacao('statusProcesso');
                          } else {
                            setStatus(value);
                          }
                        }}
                      >
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0]">
                          {opcoesStatusProcesso.map((opcao) => (
                            <SelectItem
                              key={opcao}
                              value={opcao}
                              className="text-[#2d1f16] hover:bg-[#f6f3ee]"
                            >
                              {opcao}
                            </SelectItem>
                          ))}
                          <Separator className="my-1 bg-[#d4c4b0]" />
                          <SelectItem
                            value="__adicionar_novo__"
                            className="text-[#a16535] hover:bg-[#f6f3ee] hover:text-[#8b5329]"
                          >
                            <div className="flex items-center gap-2">
                              <PlusCircle className="w-4 h-4" />
                              ✏️ Adicionar outro status...
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between h-6">
                        <Label className="text-[#4a3629]">
                          Fase Processual
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirDialogGerenciar('fase')}
                          className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Gerenciar
                        </Button>
                      </div>
                      <Popover open={fasePopoverAberto} onOpenChange={setFasePopoverAberto}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={fasePopoverAberto}
                            className="w-full justify-between bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] hover:bg-[#f6f3ee] hover:text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          >
                            {faseProcessual || "Selecione ou busque a fase..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0 bg-white border-[#d4c4b0]">
                          <Command className="bg-white">
                            <CommandInput
                              placeholder="Buscar fase processual..."
                              className="border-0 focus:ring-0 text-[#2d1f16]"
                            />
                            <CommandList>
                              <CommandEmpty className="py-6 text-center text-[#6b5544]">
                                Nenhuma fase encontrada.
                              </CommandEmpty>
                              <CommandGroup>
                                {opcoesFaseProcessual.map((fase) => (
                                  <CommandItem
                                    key={fase}
                                    value={fase}
                                    onSelect={(currentValue) => {
                                      setFaseProcessual(currentValue === faseProcessual ? "" : currentValue);
                                      setFasePopoverAberto(false);
                                    }}
                                    className="text-[#2d1f16] hover:bg-[#f6f3ee] cursor-pointer"
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${faseProcessual === fase ? "opacity-100" : "opacity-0"
                                        }`}
                                    />
                                    {fase}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              <Separator className="my-1 bg-[#d4c4b0]" />
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => {
                                    setFasePopoverAberto(false);
                                    abrirDialogPersonalizacao('fase');
                                  }}
                                  className="text-[#a16535] hover:bg-[#f6f3ee] cursor-pointer"
                                >
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  ✏️ Adicionar outra fase...
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="prioridade" className="text-[#4a3629]">
                          Prioridade
                        </Label>
                      </div>
                      <Select value={prioridade} onValueChange={setPrioridade}>
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0]">
                          <SelectItem value="urgente" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🔴 Urgente</SelectItem>
                          <SelectItem value="alta" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🟠 Alta</SelectItem>
                          <SelectItem value="normal" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🟡 Normal</SelectItem>
                          <SelectItem value="baixa" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🟢 Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="proximo-prazo" className="text-[#4a3629]">
                          Próximo Prazo
                        </Label>
                      </div>
                      <Input
                        id="proximo-prazo"
                        type="date"
                        value={proximoPrazo}
                        onChange={(e) => setProximoPrazo(e.target.value)}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="link-processo" className="text-[#4a3629]">
                          Link do Processo
                        </Label>
                      </div>
                      <Input
                        id="link-processo"
                        type="url"
                        placeholder="https://..."
                        value={linkProcesso}
                        onChange={(e) => setLinkProcesso(e.target.value)}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes-processo" className="text-[#4a3629]">
                      Observações do Processo
                    </Label>
                    <Textarea
                      id="observacoes-processo"
                      placeholder="Observações adicionais sobre o processo..."
                      value={observacoesProcesso}
                      onChange={(e) => setObservacoesProcesso(e.target.value)}
                      rows={3}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 resize-none"
                    />
                  </div>
                </div>

                {/* DADOS FINANCEIROS */}
                <Separator className="bg-[#d4c4b0]" />

                <div className="space-y-4">
                  <h3 className="text-[#a16535] flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Dados Financeiros
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numero-contrato-honorarios" className="text-[#4a3629]">
                        Nº Contrato Honorários
                      </Label>
                      <Input
                        id="numero-contrato-honorarios"
                        type="text"
                        placeholder="000/2025"
                        value={numeroContratoHonorarios}
                        onChange={(e) => {
                          const formatted = formatNumeroContrato(e.target.value);
                          setNumeroContratoHonorarios(formatted);
                        }}
                        onBlur={(e) => {
                          const valor = e.target.value;
                          if (valor && valor !== processoEmEdicao?.numeroContratoHonorarios) {
                            const existe = processos.some(p =>
                              p.numeroContratoHonorarios === valor &&
                              p.id !== processoEmEdicao?.id
                            );
                            if (existe) {
                              toast.error('Número de contrato duplicado', {
                                description: `O número de contrato "${valor}" já existe no sistema.`,
                              });
                            }
                          }
                        }}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valor-contrato" className="text-[#4a3629]">
                        Valor do Contrato
                      </Label>
                      <Input
                        id="valor-contrato"
                        type="text"
                        placeholder="R$ 0,00"
                        value={valorContrato}
                        onChange={(e) => setValorContrato(formatCurrency(e.target.value))}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="percentual-contrato" className="text-[#4a3629]">
                        Percentual Contrato
                      </Label>
                      <Input
                        id="percentual-contrato"
                        type="text"
                        placeholder="0%"
                        value={percentualContrato}
                        onChange={(e) => setPercentualContrato(formatPercentage(e.target.value))}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="honorarios-advocaticios" className="text-[#4a3629]">
                        Honorários Advocatícios
                      </Label>
                      <Input
                        id="honorarios-advocaticios"
                        type="text"
                        placeholder="R$ 0,00"
                        value={honorariosAdvocaticios}
                        onChange={(e) => setHonorariosAdvocaticios(formatCurrency(e.target.value))}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* VALORES VARIÁVEIS E DESPESAS */}
                <div className="space-y-4">
                  <h3 className="text-[#a16535]">Valores Variáveis e Despesas</h3>

                  <div className="space-y-2">
                    <Label htmlFor="honorarios-sucumbencia" className="text-[#4a3629]">
                      Honorários de Sucumbência
                    </Label>
                    <Input
                      id="honorarios-sucumbencia"
                      type="text"
                      placeholder="R$ 0,00"
                      value={honorariosSucumbencia}
                      onChange={(e) => setHonorariosSucumbencia(formatCurrency(e.target.value))}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                  </div>

                  {/* Despesas Processuais - Múltiplas */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-[#4a3629]">
                        Despesas Processuais
                      </Label>
                      <Button
                        type="button"
                        onClick={adicionarDespesa}
                        size="sm"
                        className="bg-[#a16535] hover:bg-[#8b5329] text-white h-8"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Despesa
                      </Button>
                    </div>

                    {despesas.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-[#d4c4b0] rounded-lg bg-[#f6f3ee]/50">
                        <p className="text-[#6b5544] text-sm">
                          Nenhuma despesa cadastrada. Clique em "Adicionar Despesa" para incluir.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {despesas.map((despesa, index) => (
                          <div key={despesa.id} className="grid grid-cols-12 gap-3 p-3 border border-[#d4c4b0] rounded-lg bg-white">
                            <div className="col-span-3 space-y-2">
                              <Label htmlFor={`despesa-valor-${despesa.id}`} className="text-[#4a3629] text-sm">
                                Valor
                              </Label>
                              <Input
                                id={`despesa-valor-${despesa.id}`}
                                type="text"
                                placeholder="R$ 0,00"
                                value={despesa.valor}
                                onChange={(e) => atualizarDespesa(despesa.id, 'valor', formatCurrency(e.target.value))}
                                className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                              />
                            </div>
                            <div className="col-span-8 space-y-2">
                              <Label htmlFor={`despesa-finalidade-${despesa.id}`} className="text-[#4a3629] text-sm">
                                Finalidade / Descrição
                              </Label>
                              <Input
                                id={`despesa-finalidade-${despesa.id}`}
                                type="text"
                                placeholder="Ex: Custas judiciais, perícia técnica, etc."
                                value={despesa.finalidade}
                                onChange={(e) => atualizarDespesa(despesa.id, 'finalidade', e.target.value)}
                                className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                              />
                            </div>
                            <div className="col-span-1 flex items-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removerDespesa(despesa.id)}
                                className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Remover despesa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* GESTÃO DE RECEBIMENTO */}
                <div className="space-y-4">
                  <h3 className="text-[#a16535]">Gestão de Recebimento</h3>

                  <div className="space-y-2">
                    <Label htmlFor="valor-receber" className="text-[#4a3629]">
                      Valor a Receber
                    </Label>
                    <Input
                      id="valor-receber"
                      type="text"
                      placeholder="R$ 0,00"
                      value={valorReceber}
                      onChange={(e) => setValorReceber(formatCurrency(e.target.value))}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between h-6">
                        <Label htmlFor="forma-pagamento" className="text-[#4a3629]">
                          Forma de Pagamento
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirDialogGerenciar('formaPagamento')}
                          className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Gerenciar
                        </Button>
                      </div>
                      <Select
                        value={formaPagamento}
                        onValueChange={(value) => {
                          if (value === '__adicionar_novo__') {
                            abrirDialogPersonalizacao('formaPagamento');
                          } else {
                            setFormaPagamento(value);
                          }
                        }}
                      >
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                          <SelectValue placeholder="Selecione a forma" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0]">
                          {opcoesFormaPagamento.map((opcao) => (
                            <SelectItem key={opcao} value={opcao} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                              {opcao}
                            </SelectItem>
                          ))}
                          <Separator className="my-1 bg-[#d4c4b0]" />
                          <SelectItem
                            value="__adicionar_novo__"
                            className="text-[#a16535] hover:bg-[#f6f3ee] hover:text-[#8b5329]"
                          >
                            <div className="flex items-center gap-2">
                              <PlusCircle className="w-4 h-4" />
                              ✏️ Adicionar outra forma...
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="numero-parcelas" className="text-[#4a3629]">
                          Número de Parcelas
                        </Label>
                      </div>
                      <Input
                        id="numero-parcelas"
                        type="text"
                        placeholder="Ex: 12x"
                        value={numeroParcelas}
                        onChange={(e) => setNumeroParcelas(e.target.value)}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="data-vencimento" className="text-[#4a3629]">
                          Data de Vencimento
                        </Label>
                      </div>
                      <Input
                        id="data-vencimento"
                        type="date"
                        value={dataVencimento}
                        onChange={(e) => setDataVencimento(e.target.value)}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="h-6 flex items-center">
                        <Label htmlFor="data-pagamento" className="text-[#4a3629]">
                          Data de Pagamento
                        </Label>
                      </div>
                      <Input
                        id="data-pagamento"
                        type="date"
                        value={dataPagamento}
                        onChange={(e) => setDataPagamento(e.target.value)}
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status-financeiro" className="text-[#4a3629]">
                      Status Financeiro
                    </Label>
                    <Select value={statusFinanceiro} onValueChange={setStatusFinanceiro}>
                      <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#d4c4b0]">
                        <SelectItem value="pendente" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Pendente</SelectItem>
                        <SelectItem value="pago" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Pago</SelectItem>
                        <SelectItem value="atrasado" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Atrasado</SelectItem>
                        <SelectItem value="cancelado" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* INFORMAÇÕES ADICIONAIS FINANCEIRAS */}
                <div className="space-y-4">
                  <h3 className="text-[#a16535]">Informações Adicionais Financeiras</h3>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes-financeiras" className="text-[#4a3629]">
                      Observações Financeiras
                    </Label>
                    <Textarea
                      id="observacoes-financeiras"
                      placeholder="Observações sobre pagamentos, acordos, etc..."
                      value={observacoesFinanceiras}
                      onChange={(e) => setObservacoesFinanceiras(e.target.value)}
                      rows={2}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 resize-none"
                    />
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* Notificações Enviadas */}
                <div className="space-y-4">
                  <h3 className="text-[#a16535] flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificações Enviadas
                  </h3>

                  {/* Lista de Notificações */}
                  <div className="space-y-3">
                    {notificacoes.map((notificacao, index) => (
                      <div key={notificacao.id} className="bg-[#f6f3ee] border border-[#d4c4b0] rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-[#a16535] text-white">{notificacao.tipo}</Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setNotificacoes(notificacoes.filter(n => n.id !== notificacao.id));
                              toast.success('Notificação removida');
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 px-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-[#6b5544] text-xs">Data de Envio</Label>
                            <Input
                              type="date"
                              value={notificacao.dataEnvio}
                              onChange={(e) => {
                                const novasNotificacoes = [...notificacoes];
                                novasNotificacoes[index].dataEnvio = e.target.value;
                                setNotificacoes(novasNotificacoes);
                              }}
                              className="bg-white border-[#d4c4b0] text-[#2d1f16] h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[#6b5544] text-xs">Data de Recebimento</Label>
                            <Input
                              type="date"
                              value={notificacao.dataRecebimento}
                              onChange={(e) => {
                                const novasNotificacoes = [...notificacoes];
                                novasNotificacoes[index].dataRecebimento = e.target.value;
                                setNotificacoes(novasNotificacoes);
                              }}
                              className="bg-white border-[#d4c4b0] text-[#2d1f16] h-9"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {notificacoes.length === 0 && (
                      <div className="text-center text-[#6b5544] py-4 bg-[#f6f3ee] border border-dashed border-[#d4c4b0] rounded-lg">
                        Nenhuma notificação cadastrada
                      </div>
                    )}
                  </div>

                  {/* Botões para adicionar notificações */}
                  <div className="flex flex-wrap gap-2">
                    {tiposNotificacao.map((tipo) => (
                      <Button
                        key={tipo}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNotificacoes([...notificacoes, {
                            id: Date.now().toString(),
                            tipo,
                            dataEnvio: '',
                            dataRecebimento: ''
                          }]);
                          toast.success(`${tipo} adicionado`);
                        }}
                        className="border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {tipo}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const novoTipo = prompt('Digite o nome do novo tipo de notificação:');
                        if (novoTipo && novoTipo.trim()) {
                          setTiposNotificacao([...tiposNotificacao, novoTipo.trim()]);
                          setNotificacoes([...notificacoes, {
                            id: Date.now().toString(),
                            tipo: novoTipo.trim(),
                            dataEnvio: '',
                            dataRecebimento: ''
                          }]);
                          toast.success(`${novoTipo} adicionado`);
                        }
                      }}
                      className="border-dashed border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white"
                    >
                      <PlusCircle className="w-3 h-3 mr-1" />
                      Adicionar outro tipo...
                    </Button>
                  </div>

                  {/* Observações das Notificações */}
                  <div className="space-y-2">
                    <Label htmlFor="observacoes-notificacoes" className="text-[#4a3629]">
                      Observações sobre Notificações
                    </Label>
                    <Textarea
                      id="observacoes-notificacoes"
                      placeholder="Observações sobre as notificações enviadas..."
                      value={observacoesNotificacoes}
                      onChange={(e) => setObservacoesNotificacoes(e.target.value)}
                      rows={2}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 resize-none"
                    />
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-[#a16535] hover:bg-[#8b5329] text-white shadow-md"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {processoEmEdicao ? 'Atualizar Processo' : 'Cadastrar Processo'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={limparFormulario}
                    className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200"
                  >
                    Limpar Formulário
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA CONSULTAR */}
        <TabsContent value="consultar">
          <Card className="bg-white border-2 border-[#d4c4b0]">
            <CardHeader>
              <CardTitle className="text-[#2d1f16]">Buscar Processos</CardTitle>
              <CardDescription className="text-[#6b5544]">
                Pesquise por número do processo, CPF, CNPJ ou nome do cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Digite o número do processo ou CPF/CNPJ/Nome..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePesquisarProcessos();
                    }
                  }}
                  className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                />
                <Button
                  onClick={handlePesquisarProcessos}
                  className="bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>

              {/* Resultados da pesquisa */}
              {resultadosPesquisa.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-[#6b5544]">
                    {resultadosPesquisa.length} processo(s) encontrado(s)
                  </p>
                  {resultadosPesquisa.map((processo) => (
                    <Card key={processo.id} className="bg-[#a16535]/5 border-[#d4c4b0] hover:border-[#a16535]/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="text-[#2d1f16]">
                                {processo.numeroProcesso || <span className="text-[#6b5544] italic">Processo sem número</span>}
                              </h4>
                              {getStatusBadge(processo.status)}
                              {getPrioridadeBadge(processo.prioridade)}
                            </div>
                            <p className="text-[#4a3629]">
                              <strong>Cliente:</strong> {processo.clienteNome}
                            </p>
                            <p className="text-[#4a3629]">
                              <strong>Tipo de Ação:</strong> {processo.tipoAcao}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setProcessoVisualizacao(processo)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditarProcesso(processo)}
                              className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#a16535]/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <Separator className="my-3 bg-[#d4c4b0]" />

                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div>
                            <span className="text-[#6b5544]">Tribunal:</span>{' '}
                            <span className="text-[#4a3629]">{processo.tribunal}</span>
                          </div>
                          <div>
                            <span className="text-[#6b5544]">Comarca:</span>{' '}
                            <span className="text-[#4a3629]">{processo.comarca}</span>
                          </div>
                          <div>
                            <strong className="text-[#6b5544]">Fase:</strong>{' '}
                            <strong className="text-[#4a3629]">{getLabelFase(processo.faseProcessual)}</strong>
                          </div>
                          <div>
                            <span className="text-[#6b5544]">Advogado:</span>{' '}
                            <span className="text-[#4a3629]">{processo.advogadoResponsavel}</span>
                          </div>
                          {processo.valorContrato && (
                            <div>
                              <span className="text-[#6b5544]">Valor Contrato:</span>{' '}
                              <span className="text-green-600">{processo.valorContrato}</span>
                            </div>
                          )}
                          {processo.proximoPrazo && (
                            <div>
                              <strong className="text-[#6b5544]">Próximo Prazo:</strong>{' '}
                              <strong className="text-[#a16535]">
                                {formatDateBR(processo.proximoPrazo)}
                              </strong>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#6b5544]">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-[#d4c4b0]" />
                  <p>Nenhum processo encontrado.</p>
                  <p className="text-sm">Tente buscar por número do processo ou documento do cliente.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Visualização */}
      {processoVisualizacao && (
        <Dialog open={!!processoVisualizacao} onOpenChange={() => setProcessoVisualizacao(null)}>
          <DialogContent className="bg-white border-[#d4c4b0] max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#2d1f16]">Detalhes do Processo</DialogTitle>
              <DialogDescription className="text-[#6b5544]">
                {processoVisualizacao.numeroProcesso || 'Processo sem número (pré-processual)'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Dados do Cliente */}
              <div>
                <h4 className="text-[#a16535] mb-3">Cliente</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#6b5544]">Nome:</span>{' '}
                    <span className="text-[#2d1f16]">{processoVisualizacao.clienteNome}</span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Documento:</span>{' '}
                    <span className="text-[#2d1f16]">{processoVisualizacao.clienteDocumento}</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-[#d4c4b0]" />

              {/* Dados do Processo */}
              <div>
                <h4 className="text-[#a16535] mb-3">Dados Processuais</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#6b5544]">Data Distribuição:</span>{' '}
                    <span className="text-[#2d1f16]">
                      {formatDateBR(processoVisualizacao.dataDistribuicao)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Polo:</span>{' '}
                    <span className="text-[#2d1f16]">{getLabelPolo(processoVisualizacao.polo)}</span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Parte Contrária:</span>{' '}
                    <span className="text-[#2d1f16]">{processoVisualizacao.parteContraria}</span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Tipo de Ação:</span>{' '}
                    <span className="text-[#2d1f16]">{processoVisualizacao.tipoAcao}</span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Valor da Causa:</span>{' '}
                    <span className="text-[#2d1f16]">{processoVisualizacao.valorCausa}</span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Fase:</span>{' '}
                    <span className="text-[#2d1f16]">{getLabelFase(processoVisualizacao.faseProcessual)}</span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Tribunal:</span>{' '}
                    <span className="text-[#2d1f16]">{processoVisualizacao.tribunal}</span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Comarca:</span>{' '}
                    <span className="text-[#2d1f16]">{processoVisualizacao.comarca}</span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Vara:</span>{' '}
                    <span className="text-[#2d1f16]">{processoVisualizacao.vara}</span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Jurisdição:</span>{' '}
                    <span className="text-[#2d1f16] capitalize">{processoVisualizacao.tipoJurisdicao}</span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Competência:</span>{' '}
                    <span className="text-[#2d1f16] capitalize">{processoVisualizacao.competencia}</span>
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Status:</span>{' '}
                    {getStatusBadge(processoVisualizacao.status)}
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Prioridade:</span>{' '}
                    {getPrioridadeBadge(processoVisualizacao.prioridade)}
                  </div>
                  <div>
                    <span className="text-[#6b5544]">Advogado:</span>{' '}
                    <span className="text-[#2d1f16]">{processoVisualizacao.advogadoResponsavel}</span>
                  </div>
                </div>
                {processoVisualizacao.objetoAcao && (
                  <div className="mt-4">
                    <span className="text-[#6b5544]">Objeto da Ação:</span>
                    <p className="text-[#2d1f16] mt-1">{processoVisualizacao.objetoAcao}</p>
                  </div>
                )}
                {processoVisualizacao.observacoesProcesso && (
                  <div className="mt-4">
                    <span className="text-[#6b5544]">Observações:</span>
                    <p className="text-[#2d1f16] mt-1">{processoVisualizacao.observacoesProcesso}</p>
                  </div>
                )}
              </div>

              {/* Dados Financeiros */}
              {(processoVisualizacao.valorContrato || processoVisualizacao.honorariosAdvocaticios) && (
                <>
                  <Separator className="bg-[#d4c4b0]" />
                  <div>
                    <h4 className="text-[#a16535] mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Dados Financeiros
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {processoVisualizacao.valorContrato && (
                        <div>
                          <span className="text-[#6b5544]">Valor Contrato:</span>{' '}
                          <span className="text-green-600">{processoVisualizacao.valorContrato}</span>
                        </div>
                      )}
                      {processoVisualizacao.honorariosAdvocaticios && (
                        <div>
                          <span className="text-[#6b5544]">Honorários:</span>{' '}
                          <span className="text-green-600">{processoVisualizacao.honorariosAdvocaticios}</span>
                        </div>
                      )}
                      {processoVisualizacao.formaPagamento && (
                        <div>
                          <span className="text-[#6b5544]">Forma Pagamento:</span>{' '}
                          <span className="text-[#2d1f16]">{processoVisualizacao.formaPagamento}</span>
                        </div>
                      )}
                      {processoVisualizacao.statusFinanceiro && (
                        <div>
                          <span className="text-[#6b5544]">Status Financeiro:</span>{' '}
                          <span className="text-[#2d1f16] capitalize">{processoVisualizacao.statusFinanceiro}</span>
                        </div>
                      )}
                    </div>

                    {/* Despesas Processuais */}
                    {processoVisualizacao.despesas && processoVisualizacao.despesas.length > 0 && (
                      <div className="mt-4">
                        <span className="text-[#6b5544]">Despesas Processuais:</span>
                        <div className="mt-2 space-y-2">
                          {processoVisualizacao.despesas.map((despesa, index) => (
                            <div key={despesa.id} className="flex justify-between items-center p-2 bg-[#f6f3ee] rounded border border-[#d4c4b0]">
                              <div className="flex-1">
                                <span className="text-[#2d1f16]">{despesa.finalidade || 'Despesa não especificada'}</span>
                              </div>
                              <div className="text-right ml-4">
                                <span className="text-red-600">{despesa.valor}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
