import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLocalDateTimeString } from '../others/formatters';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: 'administrador' | 'advogado' | 'estagiario' | 'secretario';
  usuario: string;
  telefone?: string;
  oab?: string;
  ativo: boolean;
  dataCadastro: string;
  observacoes?: string;
}

interface UsuariosContextType {
  usuarios: Usuario[];
  adicionarUsuario: (usuario: Omit<Usuario, 'id' | 'dataCadastro'>) => void;
  atualizarUsuario: (id: string, usuario: Omit<Usuario, 'id' | 'dataCadastro'>) => void;
  desativarUsuario: (id: string) => void;
  ativarUsuario: (id: string) => void;
  autenticarUsuario: (usuario: string, senha: string) => Usuario | null;
}

const UsuariosContext = createContext<UsuariosContextType | undefined>(undefined);

const STORAGE_KEY = 'juris-facil-usuarios';

const USUARIOS_EXEMPLO: Usuario[] = [
    {
      id: '1',
      nome: 'Dra. Anna Laura Rocha Gomes',
      email: 'anna.laura@jurisfacil.com.br',
      senha: 'adv123',
      tipo: 'administrador',
      usuario: 'administradora',
      telefone: '(11) 98765-4321',
      oab: 'OAB/SP 123.456',
      ativo: true,
      dataCadastro: '2020-01-01T08:00:00.000Z',
      observacoes: 'Administradora do sistema Juris Fácil. Responsável pela gestão completa do escritório.',
    },
    {
      id: '2',
      nome: 'Dr. Carlos Eduardo Silva',
      email: 'carlos.silva@jurisfacil.com.br',
      senha: 'adv456',
      tipo: 'advogado',
      usuario: 'carlos.silva',
      telefone: '(11) 97654-3210',
      oab: 'OAB/SP 234.567',
      ativo: true,
      dataCadastro: '2022-03-15T09:30:00.000Z',
      observacoes: 'Advogado especialista em Direito Trabalhista.',
    },
    {
      id: '3',
      nome: 'Mariana Costa',
      email: 'mariana.costa@jurisfacil.com.br',
      senha: 'est123',
      tipo: 'estagiario',
      usuario: 'mariana.costa',
      telefone: '(11) 96543-2109',
      ativo: true,
      dataCadastro: '2024-01-10T10:00:00.000Z',
      observacoes: 'Estagiária - cursando 4º ano de Direito. Auxilia nos processos cíveis.',
    },
    {
      id: '4',
      nome: 'Paula Fernandes',
      email: 'paula.fernandes@jurisfacil.com.br',
      senha: 'sec123',
      tipo: 'secretario',
      usuario: 'paula.fernandes',
      telefone: '(11) 95432-1098',
      ativo: true,
      dataCadastro: '2021-06-20T08:30:00.000Z',
      observacoes: 'Secretária responsável pelo atendimento e organização de documentos.',
    },
];

export function UsuariosProvider({ children }: { children: ReactNode }) {
  // Carregar dados do localStorage ou usar exemplos
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    try {
      const savedUsuarios = localStorage.getItem(STORAGE_KEY);
      if (savedUsuarios) {
        return JSON.parse(savedUsuarios);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários do localStorage:', error);
    }
    return USUARIOS_EXEMPLO;
  });

  // Salvar no localStorage sempre que usuários mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
    } catch (error) {
      console.error('Erro ao salvar usuários no localStorage:', error);
    }
  }, [usuarios]);

  const adicionarUsuario = (usuario: Omit<Usuario, 'id' | 'dataCadastro'>) => {
    const novoUsuario: Usuario = {
      ...usuario,
      id: Date.now().toString(),
      dataCadastro: getLocalDateTimeString(),
    };
    setUsuarios((prev) => [...prev, novoUsuario]);
  };

  const atualizarUsuario = (id: string, usuarioAtualizado: Omit<Usuario, 'id' | 'dataCadastro'>) => {
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === id
          ? { ...usuarioAtualizado, id, dataCadastro: usuario.dataCadastro }
          : usuario
      )
    );
  };

  const desativarUsuario = (id: string) => {
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === id ? { ...usuario, ativo: false } : usuario
      )
    );
  };

  const ativarUsuario = (id: string) => {
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === id ? { ...usuario, ativo: true } : usuario
      )
    );
  };

  const autenticarUsuario = (usuario: string, senha: string): Usuario | null => {
    const usuarioEncontrado = usuarios.find(
      (u) => u.usuario === usuario && u.senha === senha && u.ativo
    );
    return usuarioEncontrado || null;
  };

  return (
    <UsuariosContext.Provider
      value={{
        usuarios,
        adicionarUsuario,
        atualizarUsuario,
        desativarUsuario,
        ativarUsuario,
        autenticarUsuario,
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
}

export function useUsuarios() {
  const context = useContext(UsuariosContext);
  if (context === undefined) {
    throw new Error('useUsuarios must be used within a UsuariosProvider');
  }
  return context;
}
