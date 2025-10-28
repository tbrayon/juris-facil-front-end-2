import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLocalDateString } from '../utils/formatters';

export interface Notificacao {
  id: string;
  tipo: string;
  dataEnvio: string;
  dataRecebimento: string;
}

export interface DespesaProcessual {
  id: string;
  valor: string;
  finalidade: string;
}

export interface Processo {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteDocumento: string;
  numeroProcesso: string;
  dataDistribuicao: string;
  polo: string;
  parteContraria: string;
  tipoAcao: string;
  objetoAcao: string;
  valorCausa: string;
  faseProcessual: string;
  tribunal: string;
  estado: string;
  numeroContratoHonorarios: string;
  tipoJurisdicao: string;
  vara: string;
  competencia: string;
  comarca: string;
  status: string;
  prioridade: string;
  advogadoResponsavel: string;
  proximoPrazo: string;
  linkProcesso: string;
  observacoesProcesso: string;
  dataCadastro: string;
  // Dados Financeiros
  valorContrato: string;
  percentualContrato: string;
  honorariosAdvocaticios: string;
  honorariosSucumbencia: string;
  despesas: DespesaProcessual[];
  valorReceber: string;
  dataVencimento: string;
  formaPagamento: string;
  statusFinanceiro: string;
  numeroParcelas: string;
  dataPagamento: string;
  observacoesFinanceiras: string;
  // Notificações
  notificacoes: Notificacao[];
  observacoesNotificacoes: string;
}

interface ProcessosContextType {
  processos: Processo[];
  adicionarProcesso: (processo: Omit<Processo, 'id' | 'dataCadastro'>) => void;
  atualizarProcesso: (id: string, processo: Omit<Processo, 'id' | 'dataCadastro'>) => void;
  buscarProcessos: (filtros: { numeroProcesso?: string; clienteDocumento?: string; clienteNome?: string }) => Processo[];
  resetarDados: () => void;
}

const ProcessosContext = createContext<ProcessosContextType | undefined>(undefined);

const STORAGE_KEY = 'juris-facil-processos';

const PROCESSOS_EXEMPLO: Processo[] = [
  // Processo 1 - Rafael Henrique Martins
  {
    id: '1',
    clienteId: '1',
    clienteNome: 'Rafael Henrique Martins',
    clienteDocumento: '456.789.123-45',
    numeroProcesso: '1002345-67.2023.5.02.0038',
    dataDistribuicao: '2023-04-12',
    polo: 'Réu / Requerido / Reclamado',
    parteContraria: 'Marcos Antônio Oliveira',
    tipoAcao: 'Ação Trabalhista',
    objetoAcao: 'Defesa em reclamação trabalhista movida por ex-funcionário pleiteando verbas rescisórias, horas extras, adicional noturno e danos morais relacionados a alegado assédio moral no ambiente de trabalho.',
    valorCausa: 'R$ 120.500,00',
    faseProcessual: 'Instrução',
    tribunal: 'TRT-2',
    estado: 'SP',
    numeroContratoHonorarios: 'CH-2023-012',
    tipoJurisdicao: 'Trabalhista',
    vara: '38ª Vara do Trabalho',
    competencia: 'Federal',
    comarca: 'São Paulo',
    status: 'Ativo',
    prioridade: 'alta',
    advogadoResponsavel: 'Dra. Anna Laura Rocha Gomes',
    proximoPrazo: '2026-01-10',
    linkProcesso: 'https://pje.trt2.jus.br/consultaprocessual',
    observacoesProcesso: 'Cliente muito preocupado com a reputação profissional. Necessário juntar provas de que não houve assédio moral. Testemunhas já identificadas.',
    dataCadastro: '2023-04-12',
    valorContrato: 'R$ 32.500,00',
    percentualContrato: '27%',
    honorariosAdvocaticios: 'R$ 32.500,00',
    honorariosSucumbencia: 'R$ 18.000,00',
    despesas: [
      { id: '1', valor: 'R$ 1.800,00', finalidade: 'Custas judiciais' },
      { id: '2', valor: 'R$ 1.400,00', finalidade: 'Perícia técnica' }
    ],
    valorReceber: 'R$ 19.500,00',
    dataVencimento: '2026-01-10',
    formaPagamento: 'PIX',
    statusFinanceiro: 'Pendente',
    numeroParcelas: '5x',
    dataPagamento: '',
    observacoesFinanceiras: 'Entrada de R$ 6.500,00 paga. Restam 4 parcelas de R$ 6.500,00 com vencimento em 10/01/2026.',
    notificacoes: [],
    observacoesNotificacoes: '',
  },

  // Processo 2 - Juliana Aparecida Ferreira
  {
    id: '2',
    clienteId: '2',
    clienteNome: 'Juliana Aparecida Ferreira',
    clienteDocumento: '789.456.321-78',
    numeroProcesso: '1003456-78.2024.8.26.0100',
    dataDistribuicao: '2024-02-28',
    polo: 'Autor / Requerente / Reclamante',
    parteContraria: 'MedCare Assistência Médica S.A.',
    tipoAcao: 'Ação de Cobrança',
    objetoAcao: 'Cobrança de valores não reembolsados pelo plano de saúde referentes a procedimentos médicos de urgência e tratamento psicológico especializado negados irregularmente pela operadora.',
    valorCausa: 'R$ 85.200,00',
    faseProcessual: 'Sentença',
    tribunal: 'TJ-SP',
    estado: 'SP',
    numeroContratoHonorarios: 'CH-2024-028',
    tipoJurisdicao: 'Cível',
    vara: '8ª Vara Cível',
    competencia: 'Estadual',
    comarca: 'São Paulo',
    status: 'Ativo',
    prioridade: 'normal',
    advogadoResponsavel: 'Dra. Anna Laura Rocha Gomes',
    proximoPrazo: '2026-02-28',
    linkProcesso: 'https://esaj.tjsp.jus.br/cpopg',
    observacoesProcesso: 'Cliente possui toda documentação médica organizada. Perícia médica comprovou necessidade dos procedimentos. Aguardando sentença.',
    dataCadastro: '2024-02-28',
    valorContrato: 'R$ 21.300,00',
    percentualContrato: '25%',
    honorariosAdvocaticios: 'R$ 21.300,00',
    honorariosSucumbencia: 'R$ 12.800,00',
    despesas: [
      { id: '1', valor: 'R$ 1.200,00', finalidade: 'Perícia médica' },
      { id: '2', valor: 'R$ 800,00', finalidade: 'Custas processuais' },
      { id: '3', valor: 'R$ 500,00', finalidade: 'Certidões e documentos' }
    ],
    valorReceber: 'R$ 10.650,00',
    dataVencimento: '2026-02-28',
    formaPagamento: 'PIX',
    statusFinanceiro: 'Pendente',
    numeroParcelas: '4x',
    dataPagamento: '',
    observacoesFinanceiras: 'Parcelas de R$ 5.325,00. Primeira e segunda parcelas pagas. Restam 2 parcelas.',
    notificacoes: [],
    observacoesNotificacoes: '',
  },

  // Processo 3 - André Luiz Barbosa
  {
    id: '3',
    clienteId: '3',
    clienteNome: 'André Luiz Barbosa',
    clienteDocumento: '321.654.987-90',
    numeroProcesso: '1004567-89.2022.8.26.0100',
    dataDistribuicao: '2022-08-15',
    polo: 'Autor / Requerente / Reclamante',
    parteContraria: 'Carolina Barbosa Mendes',
    tipoAcao: 'Ação de Alimentos',
    objetoAcao: 'Revisão de pensão alimentícia em razão de mudança nas condições financeiras do alimentante, que teve redução significativa de renda após mudança de cargo na universidade.',
    valorCausa: 'R$ 45.000,00',
    faseProcessual: 'Sentença',
    tribunal: 'TJ-SP',
    estado: 'SP',
    numeroContratoHonorarios: 'CH-2022-085',
    tipoJurisdicao: 'Cível',
    vara: '3ª Vara de Família e Sucessões',
    competencia: 'Estadual',
    comarca: 'São Paulo',
    status: 'Ativo',
    prioridade: 'normal',
    advogadoResponsavel: 'Dra. Anna Laura Rocha Gomes',
    proximoPrazo: '2026-08-15',
    linkProcesso: 'https://esaj.tjsp.jus.br/cpopg',
    observacoesProcesso: 'Cliente apresentou todos os comprovantes de mudança salarial. Ex-cônjuge não concordou com revisão amigável. Processo seguindo tramitação normal.',
    dataCadastro: '2022-08-15',
    valorContrato: 'R$ 18.000,00',
    percentualContrato: '40%',
    honorariosAdvocaticios: 'R$ 18.000,00',
    honorariosSucumbencia: 'R$ 9.000,00',
    despesas: [
      { id: '1', valor: 'R$ 800,00', finalidade: 'Custas processuais' },
      { id: '2', valor: 'R$ 400,00', finalidade: 'Certidões diversas' }
    ],
    valorReceber: 'R$ 0,00',
    dataVencimento: '2026-08-15',
    formaPagamento: 'Transferência bancária',
    statusFinanceiro: 'Pago',
    numeroParcelas: '6x',
    dataPagamento: '2023-02-15',
    observacoesFinanceiras: 'Contrato pago integralmente em 6 parcelas de R$ 3.000,00. Última parcela quitada em 15/02/2023.',
    notificacoes: [],
    observacoesNotificacoes: '',
  },

  // Processo 4 - Inovare Tecnologia e Sistemas Ltda
  {
    id: '4',
    clienteId: '4',
    clienteNome: 'Inovare Tecnologia e Sistemas Ltda',
    clienteDocumento: '23.456.789/0001-12',
    numeroProcesso: '1005678-90.2024.5.02.0015',
    dataDistribuicao: '2024-03-10',
    polo: 'Réu / Requerido / Reclamado',
    parteContraria: 'Sindicato dos Trabalhadores em TI de São Paulo',
    tipoAcao: 'Ação Trabalhista',
    objetoAcao: 'Defesa em reclamação trabalhista coletiva movida por grupo de 8 ex-funcionários pleiteando horas extras, adicional noturno, verbas rescisórias e indenização por danos morais coletivos.',
    valorCausa: 'R$ 420.000,00',
    faseProcessual: 'Instrução',
    tribunal: 'TRT-2',
    estado: 'SP',
    numeroContratoHonorarios: 'CH-2024-030',
    tipoJurisdicao: 'Trabalhista',
    vara: '15ª Vara do Trabalho',
    competencia: 'Federal',
    comarca: 'São Paulo',
    status: 'Ativo',
    prioridade: 'alta',
    advogadoResponsavel: 'Dra. Anna Laura Rocha Gomes',
    proximoPrazo: '2026-03-10',
    linkProcesso: 'https://pje.trt2.jus.br/consultaprocessual',
    observacoesProcesso: 'Ação coletiva complexa. Empresa possui registro de ponto eletrônico que comprova não haver horas extras. Necessário preparar defesa robusta.',
    dataCadastro: '2024-03-10',
    valorContrato: 'R$ 84.000,00',
    percentualContrato: '20%',
    honorariosAdvocaticios: 'R$ 84.000,00',
    honorariosSucumbencia: 'R$ 50.000,00',
    despesas: [
      { id: '1', valor: 'R$ 4.500,00', finalidade: 'Perícia técnica trabalhista' },
      { id: '2', valor: 'R$ 2.800,00', finalidade: 'Custas processuais' },
      { id: '3', valor: 'R$ 1.200,00', finalidade: 'Notificações e publicações' }
    ],
    valorReceber: 'R$ 56.000,00',
    dataVencimento: '2026-03-10',
    formaPagamento: 'Transferência bancária',
    statusFinanceiro: 'Pendente',
    numeroParcelas: '6x',
    dataPagamento: '',
    observacoesFinanceiras: 'Parcelas de R$ 14.000,00. Primeira e segunda parcelas pagas. Restam 4 parcelas.',
    notificacoes: [],
    observacoesNotificacoes: '',
  },

  // Processo 5 - Distribuidora Mercantil São Jorge Ltda
  {
    id: '5',
    clienteId: '5',
    clienteNome: 'Distribuidora Mercantil São Jorge Ltda',
    clienteDocumento: '34.567.890/0001-23',
    numeroProcesso: '1006789-01.2023.8.26.0100',
    dataDistribuicao: '2023-09-22',
    polo: 'Autor / Requerente / Reclamante',
    parteContraria: 'Alimentos Nordeste Distribuidora Ltda',
    tipoAcao: 'Ação de Indenização',
    objetoAcao: 'Cobrança de valores e indenização por descumprimento contratual de fornecedor que deixou de entregar mercadorias conforme acordado, causando prejuízos financeiros e perda de clientes.',
    valorCausa: 'R$ 350.000,00',
    faseProcessual: 'Recurso',
    tribunal: 'TJ-SP',
    estado: 'SP',
    numeroContratoHonorarios: 'CH-2023-092',
    tipoJurisdicao: 'Cível',
    vara: '12ª Vara Cível',
    competencia: 'Estadual',
    comarca: 'São Paulo',
    status: 'Em recurso',
    prioridade: 'urgente',
    advogadoResponsavel: 'Dra. Anna Laura Rocha Gomes',
    proximoPrazo: '2026-09-22',
    linkProcesso: 'https://esaj.tjsp.jus.br/cpopg',
    observacoesProcesso: 'Sentença parcialmente procedente em primeira instância. Cliente apelou para aumentar valor da indenização. Perícia contábil comprovou prejuízo maior que o estimado inicialmente.',
    dataCadastro: '2023-09-22',
    valorContrato: 'R$ 70.000,00',
    percentualContrato: '20%',
    honorariosAdvocaticios: 'R$ 70.000,00',
    honorariosSucumbencia: 'R$ 45.000,00',
    despesas: [
      { id: '1', valor: 'R$ 4.200,00', finalidade: 'Perícia contábil' },
      { id: '2', valor: 'R$ 1.800,00', finalidade: 'Custas processuais e recursos' },
      { id: '3', valor: 'R$ 800,00', finalidade: 'Documentação e certidões' }
    ],
    valorReceber: 'R$ 0,00',
    dataVencimento: '2026-09-22',
    formaPagamento: 'Boleto',
    statusFinanceiro: 'Pago',
    numeroParcelas: '5x',
    dataPagamento: '2024-02-22',
    observacoesFinanceiras: 'Contrato pago integralmente em 5 parcelas de R$ 14.000,00. Última parcela quitada em 22/02/2024.',
    notificacoes: [],
    observacoesNotificacoes: '',
  },

  // Processo 6 - Construtora Edifica Brasil S.A.
  {
    id: '6',
    clienteId: '6',
    clienteNome: 'Construtora Edifica Brasil S.A.',
    clienteDocumento: '45.678.901/0001-34',
    numeroProcesso: '1007890-12.2021.8.26.0100',
    dataDistribuicao: '2021-11-18',
    polo: 'Autor / Requerente / Reclamante',
    parteContraria: 'Incorporadora Millennium Empreendimentos Ltda',
    tipoAcao: 'Ação de Cobrança',
    objetoAcao: 'Cobrança de valores devidos por incorporadora referentes a serviços de construção civil prestados em empreendimento residencial, incluindo materiais fornecidos, mão de obra e aditivos contratuais não pagos.',
    valorCausa: 'R$ 1.200.000,00',
    faseProcessual: 'Sentença',
    tribunal: 'TJ-SP',
    estado: 'SP',
    numeroContratoHonorarios: 'CH-2021-115',
    tipoJurisdicao: 'Cível',
    vara: '7ª Vara Cível',
    competencia: 'Estadual',
    comarca: 'São Paulo',
    status: 'Sentenciado',
    prioridade: 'baixa',
    advogadoResponsavel: 'Dra. Anna Laura Rocha Gomes',
    proximoPrazo: '2026-11-18',
    linkProcesso: 'https://esaj.tjsp.jus.br/cpopg',
    observacoesProcesso: 'Processo de alto valor. Perícia de engenharia e contábil realizadas comprovando valores devidos. Réu apresentou contestação fraca. Expectativa de sentença favorável.',
    dataCadastro: '2021-11-18',
    valorContrato: 'R$ 180.000,00',
    percentualContrato: '15%',
    honorariosAdvocaticios: 'R$ 180.000,00',
    honorariosSucumbencia: 'R$ 120.000,00',
    despesas: [
      { id: '1', valor: 'R$ 15.000,00', finalidade: 'Perícia de engenharia civil' },
      { id: '2', valor: 'R$ 8.500,00', finalidade: 'Perícia contábil' },
      { id: '3', valor: 'R$ 3.200,00', finalidade: 'Custas processuais' },
      { id: '4', valor: 'R$ 1.300,00', finalidade: 'Certidões e documentos' }
    ],
    valorReceber: 'R$ 0,00',
    dataVencimento: '2026-11-18',
    formaPagamento: 'Transferência bancária',
    statusFinanceiro: 'Pago',
    numeroParcelas: '8x',
    dataPagamento: '2022-07-18',
    observacoesFinanceiras: 'Contrato pago integralmente em 8 parcelas de R$ 22.500,00. Última parcela quitada em 18/07/2022.',
    notificacoes: [],
    observacoesNotificacoes: '',
  },
];

export function ProcessosProvider({ children }: { children: ReactNode }) {
  // Carregar dados do localStorage ou usar exemplos
  const [processos, setProcessos] = useState<Processo[]>(() => {
    try {
      const savedProcessos = localStorage.getItem(STORAGE_KEY);
      if (savedProcessos) {
        return JSON.parse(savedProcessos);
      }
    } catch (error) {
      console.error('Erro ao carregar processos do localStorage:', error);
    }
    return PROCESSOS_EXEMPLO;
  });

  // Salvar no localStorage sempre que processos mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(processos));
    } catch (error) {
      console.error('Erro ao salvar processos no localStorage:', error);
    }
  }, [processos]);

  const adicionarProcesso = (processo: Omit<Processo, 'id' | 'dataCadastro'>) => {
    const novoProcesso: Processo = {
      ...processo,
      id: Date.now().toString(),
      dataCadastro: getLocalDateString(),
    };
    setProcessos((prev) => [...prev, novoProcesso]);
  };

  const atualizarProcesso = (id: string, processoAtualizado: Omit<Processo, 'id' | 'dataCadastro'>) => {
    setProcessos((prev) =>
      prev.map((processo) =>
        processo.id === id
          ? { ...processoAtualizado, id, dataCadastro: processo.dataCadastro }
          : processo
      )
    );
  };

  const buscarProcessos = (filtros: { numeroProcesso?: string; clienteDocumento?: string; clienteNome?: string }) => {
    return processos.filter((processo) => {
      // Se nenhum filtro foi fornecido, retorna todos os processos
      if (!filtros.numeroProcesso && !filtros.clienteDocumento && !filtros.clienteNome) {
        return true;
      }

      // Verifica se o termo buscado aparece em qualquer um dos campos (OR)
      const numeroMatch = filtros.numeroProcesso
        ? processo.numeroProcesso.includes(filtros.numeroProcesso)
        : false;

      const documentoMatch = filtros.clienteDocumento
        ? processo.clienteDocumento.includes(filtros.clienteDocumento)
        : false;

      const nomeMatch = filtros.clienteNome
        ? processo.clienteNome.toLowerCase().includes(filtros.clienteNome.toLowerCase())
        : false;

      return numeroMatch || documentoMatch || nomeMatch;
    });
  };

  const resetarDados = () => {
    setProcessos(PROCESSOS_EXEMPLO);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PROCESSOS_EXEMPLO));
  };

  return (
    <ProcessosContext.Provider value={{ processos, adicionarProcesso, atualizarProcesso, buscarProcessos, resetarDados }}>
      {children}
    </ProcessosContext.Provider>
  );
}

export function useProcessos() {
  const context = useContext(ProcessosContext);
  if (context === undefined) {
    throw new Error('useProcessos must be used within a ProcessosProvider');
  }
  return context;
}
