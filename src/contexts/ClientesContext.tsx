import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLocalDateString } from '../utils/formatters';

export interface Cliente {
  id: string;
  nome: string;
  documento: string;
  tipo: 'cpf' | 'cnpj';
  dataCadastro: string;
  // Campos específicos para CPF
  rg?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  nacionalidade?: string;
  // Dados Profissionais (CPF)
  profissao?: string;
  empresa?: string;
  cargo?: string;
  // Campos específicos para CNPJ
  nomeFantasia?: string;
  nomeResponsavel?: string;
  // Contatos
  telefones?: string[];
  email?: string;
  // Endereço
  cep?: string;
  uf?: string;
  municipio?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  // Observações
  observacoes?: string;
}

interface ClientesContextType {
  clientes: Cliente[];
  adicionarCliente: (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => void;
  atualizarCliente: (id: string, cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => void;
  buscarClientes: (filtros: { cpf?: string; cnpj?: string; nome?: string }) => Cliente[];
  resetarDados: () => void;
}

const ClientesContext = createContext<ClientesContextType | undefined>(undefined);

const CLIENTES_EXEMPLO: Cliente[] = [
  // CLIENTES PESSOA FÍSICA (CPF)
  {
    id: '1',
    tipo: 'cpf',
    nome: 'Rafael Henrique Martins',
    documento: '456.789.123-45',
    rg: '34.567.890-1',
    dataNascimento: '1988-11-20',
    estadoCivil: 'Casado',
    nacionalidade: 'Brasileira',
    profissao: 'Arquiteto',
    empresa: 'Martins & Associados Arquitetura',
    cargo: 'Sócio-Proprietário',
    telefones: ['(11) 99876-5432', '(11) 3789-4561'],
    email: 'rafael.martins@email.com',
    cep: '01414-001',
    uf: 'SP',
    municipio: 'São Paulo',
    bairro: 'Cerqueira César',
    logradouro: 'Rua Augusta',
    numero: '2840',
    complemento: 'Conjunto 1203',
    observacoes: 'Cliente desde 2023. Processo trabalhista movido por ex-funcionário. Sempre muito pontual com os pagamentos. Prefere reuniões presenciais.',
    dataCadastro: '2023-04-12',
  },
  {
    id: '2',
    tipo: 'cpf',
    nome: 'Juliana Aparecida Ferreira',
    documento: '789.456.321-78',
    rg: '56.789.012-3',
    dataNascimento: '1995-06-08',
    estadoCivil: 'Solteira',
    nacionalidade: 'Brasileira',
    profissao: 'Psicóloga Clínica',
    empresa: 'Clínica Mente Saudável',
    cargo: 'Psicóloga Responsável',
    telefones: ['(11) 98234-5678', '(11) 2345-6789'],
    email: 'juliana.ferreira@email.com',
    cep: '05424-000',
    uf: 'SP',
    municipio: 'São Paulo',
    bairro: 'Pinheiros',
    logradouro: 'Rua dos Pinheiros',
    numero: '1456',
    complemento: 'Sala 307',
    observacoes: 'Cliente desde 2024. Ação de cobrança contra plano de saúde. Muito organizada com documentação. Preferência por contato via WhatsApp.',
    dataCadastro: '2024-02-28',
  },
  {
    id: '3',
    tipo: 'cpf',
    nome: 'André Luiz Barbosa',
    documento: '321.654.987-90',
    rg: '78.901.234-5',
    dataNascimento: '1982-09-14',
    estadoCivil: 'Divorciado',
    nacionalidade: 'Brasileira',
    profissao: 'Professor Universitário',
    empresa: 'Universidade de São Paulo - USP',
    cargo: 'Professor Doutor',
    telefones: ['(11) 97654-3210', '(11) 4567-8901'],
    email: 'andre.barbosa@email.com',
    cep: '05508-000',
    uf: 'SP',
    municipio: 'São Paulo',
    bairro: 'Butantã',
    logradouro: 'Avenida Corifeu de Azevedo Marques',
    numero: '3890',
    complemento: 'Apartamento 152',
    observacoes: 'Cliente desde 2022. Ação de revisão de alimentos. Muito colaborativo e pontual. Preferência por comunicação via e-mail.',
    dataCadastro: '2022-08-15',
  },

  // CLIENTES PESSOA JURÍDICA (CNPJ)
  {
    id: '4',
    tipo: 'cnpj',
    nome: 'Inovare Tecnologia e Sistemas Ltda',
    documento: '23.456.789/0001-12',
    nomeFantasia: 'Inovare Tech',
    nomeResponsavel: 'Fernanda Cristina Almeida',
    telefones: ['(11) 4123-5678', '(11) 99123-4567'],
    email: 'contato@inovaretech.com.br',
    cep: '01451-000',
    uf: 'SP',
    municipio: 'São Paulo',
    bairro: 'Jardim Paulista',
    logradouro: 'Avenida Brigadeiro Luís Antônio',
    numero: '2344',
    complemento: 'Andar 15',
    observacoes: 'Cliente corporativo desde 2024. Litígio trabalhista com grupo de ex-funcionários. Empresa de médio porte, sempre cumpre prazos de pagamento.',
    dataCadastro: '2024-03-10',
  },
  {
    id: '5',
    tipo: 'cnpj',
    nome: 'Distribuidora Mercantil São Jorge Ltda',
    documento: '34.567.890/0001-23',
    nomeFantasia: 'Mercantil São Jorge',
    nomeResponsavel: 'Paulo Roberto da Silva',
    telefones: ['(11) 3234-5678', '(11) 98765-4321'],
    email: 'juridico@mercantilsaojorge.com.br',
    cep: '03102-002',
    uf: 'SP',
    municipio: 'São Paulo',
    bairro: 'Mooca',
    logradouro: 'Rua da Mooca',
    numero: '5678',
    complemento: 'Galpão 3',
    observacoes: 'Cliente desde 2023. Ação cível contra fornecedor por descumprimento contratual. Empresa tradicional no ramo de distribuição.',
    dataCadastro: '2023-09-22',
  },
  {
    id: '6',
    tipo: 'cnpj',
    nome: 'Construtora Edifica Brasil S.A.',
    documento: '45.678.901/0001-34',
    nomeFantasia: 'Edifica Brasil',
    nomeResponsavel: 'Marcelo Augusto Pereira',
    telefones: ['(11) 3890-1234', '(11) 99234-5678'],
    email: 'juridico@edificabrasil.com.br',
    cep: '04543-010',
    uf: 'SP',
    municipio: 'São Paulo',
    bairro: 'Vila Olímpia',
    logradouro: 'Rua Funchal',
    numero: '418',
    complemento: 'Conjunto 2301',
    observacoes: 'Cliente desde 2021. Ação de cobrança contra incorporadora. Grande construtora com diversos processos em andamento. Pagamentos sempre em dia.',
    dataCadastro: '2021-11-18',
  }
];

const STORAGE_KEY = 'juris-facil-clientes';

export function ClientesProvider({ children }: { children: ReactNode }) {
  // Carregar dados do localStorage ou usar exemplos
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    try {
      const savedClientes = localStorage.getItem(STORAGE_KEY);
      if (savedClientes) {
        return JSON.parse(savedClientes);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes do localStorage:', error);
    }
    return CLIENTES_EXEMPLO;
  });

  // Salvar no localStorage sempre que clientes mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
    } catch (error) {
      console.error('Erro ao salvar clientes no localStorage:', error);
    }
  }, [clientes]);

  const adicionarCliente = (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    const novoCliente: Cliente = {
      ...cliente,
      id: Date.now().toString(),
      dataCadastro: getLocalDateString(),
    };
    setClientes((prev) => [...prev, novoCliente]);
  };

  const atualizarCliente = (id: string, clienteAtualizado: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    setClientes((prev) =>
      prev.map((cliente) =>
        cliente.id === id
          ? { ...clienteAtualizado, id, dataCadastro: cliente.dataCadastro }
          : cliente
      )
    );
  };

  const buscarClientes = (filtros: { cpf?: string; cnpj?: string; nome?: string }) => {
    return clientes.filter((cliente) => {
      const cpfMatch = filtros.cpf
        ? cliente.tipo === 'cpf' && cliente.documento.includes(filtros.cpf)
        : true;

      const cnpjMatch = filtros.cnpj
        ? cliente.tipo === 'cnpj' && cliente.documento.includes(filtros.cnpj)
        : true;

      const nomeMatch = filtros.nome
        ? cliente.nome.toLowerCase().includes(filtros.nome.toLowerCase())
        : true;

      return cpfMatch && cnpjMatch && nomeMatch;
    });
  };

  const resetarDados = () => {
    setClientes(CLIENTES_EXEMPLO);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(CLIENTES_EXEMPLO));
  };

  return (
    <ClientesContext.Provider value={{ clientes, adicionarCliente, atualizarCliente, buscarClientes, resetarDados }}>
      {children}
    </ClientesContext.Provider>
  );
}

export function useClientes() {
  const context = useContext(ClientesContext);
  if (context === undefined) {
    throw new Error('useClientes must be used within a ClientesProvider');
  }
  return context;
}
