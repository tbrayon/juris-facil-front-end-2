import React, { useState, useMemo } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// ... (imports) ...
// import { toast } from 'sonner';
// import { formatDateTimeBR, formatTelefone } from '../utils/formatters';

// --- INÍCIO DAS SIMULAÇÕES (MOCKS) ---
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

const Users = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></LucideMock>;
const UserPlus = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></LucideMock>;
const Search = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></LucideMock>;
const Edit = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></LucideMock>;
const Eye = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></LucideMock>;
const X = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></LucideMock>;
const Save = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></LucideMock>;
const AlertCircle = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></LucideMock>;
const Shield = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></LucideMock>;
const UserCheck = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></LucideMock>;
const UserX = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" x2="22" y1="8" y2="13" /><line x1="22" x2="17" y1="8" y2="13" /></LucideMock>;
const ArrowLeft = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></LucideMock>;
const Calendar = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></LucideMock>;
const Clock = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></LucideMock>;
const Filter = (props: React.SVGProps<SVGSVGElement>) => <LucideMock {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></LucideMock>;


// Mock para ./ui/card
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={`border rounded-lg shadow-sm bg-white ${className}`} {...props} />;
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props} />;
const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className={`text-sm text-gray-500 ${className}`} {...props} />;
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={`p-6 ${className}`} {...props} />;

// Mock para ./ui/input
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';

// Mock para ./ui/label
const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    ref={ref}
    {...props}
  />
));
Label.displayName = 'Label';

// Mock para ./ui/button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'ghost' | 'default';
  size?: 'sm' | 'default' | 'icon';
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
      ${variant === 'outline' ? 'border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900' : (variant === 'ghost' ? 'hover:bg-gray-100 hover:text-gray-900' : 'bg-blue-600 text-white hover:bg-blue-700')}
      ${size === 'sm' ? 'h-9 px-3' : (size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 py-2')}
      ${className}`}
    ref={ref}
    {...props}
  />
));
Button.displayName = 'Button';

// Mock para ./ui/badge
// --- CORREÇÃO: Adicionada a prop 'variant' para ser consumida e não passada ao span ---
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'outline' | 'default' | string; // Aceita a prop 'variant'
}
const Badge = ({ className, variant, ...props }: BadgeProps) => ( // 'variant' é extraído aqui
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    {...props} // 'variant' não está mais em 'props' e não é passado para o 'span'
  />
);

// Mock para ./ui/alert
const Alert = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div role="alert" className={`relative w-full rounded-lg border p-4 ${className}`} {...props} />;
const AlertDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <div className={`text-sm ${className}`} {...props} />;

// Mock para ./ui/separator
const Separator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={`shrink-0 bg-gray-200 h-[1px] w-full ${className}`} {...props} />;

// Mock para ./ui/textarea
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

// Mock para sonner
const toast = {
  success: (message: string) => console.log(`Toast Success: ${message}`),
  error: (message: string) => console.log(`Toast Error: ${message}`),
};

// Mock para ../utils/formatters
const formatDateTimeBR = (dateStr: string | null | undefined) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('pt-BR', { timeZone: 'UTC' });
  } catch (e) {
    return dateStr;
  }
};
// Simples mock para formatTelefone
const formatTelefone = (value: string) => {
  if (!value) return "";
  value = value.replace(/\D/g,"");
  value = value.replace(/^(\d{2})(\d)/g,"($1) $2");
  value = value.replace(/(\d)(\d{4})$/,"$1-$2");
  return value.slice(0, 15); // Limita ao formato (XX) XXXXX-XXXX
};

// Mock para ../contexts/UsuariosContext
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'administrador' | 'advogado' | 'estagiario' | 'secretario';
  usuario: string;
  telefone?: string;
  oab?: string;
  ativo: boolean;
  observacoes?: string;
  dataCadastro: string; 
}

const mockUsuariosData: Usuario[] = [
  { id: '1', nome: 'Dr. João Silva', email: 'joao@juris.com', tipo: 'administrador', usuario: 'joao.silva', oab: 'SP123456', ativo: true, dataCadastro: '2025-01-15T12:00:00.000Z', telefone: '(11) 98765-4321' },
  { id: '2', nome: 'Dra. Ana Costa', email: 'ana@juris.com', tipo: 'advogado', usuario: 'ana.costa', oab: 'SP654321', ativo: true, dataCadastro: '2025-02-20T12:00:00.000Z', observacoes: 'Especialista em cível.' },
  { id: '3', nome: 'Carlos Pereira', email: 'carlos@juris.com', tipo: 'estagiario', usuario: 'carlos.pereira', ativo: false, dataCadastro: '2025-03-10T12:00:00.000Z' },
];

const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState(mockUsuariosData);
  return {
    usuarios,
    adicionarUsuario: (u: Omit<Usuario, 'id' | 'dataCadastro'>) => {
      const novoUsuario = { ...u, id: String(usuarios.length + 1), dataCadastro: new Date().toISOString() };
      setUsuarios(prev => [...prev, novoUsuario]);
      console.log("Adicionando usuário", novoUsuario);
    },
    atualizarUsuario: (id: string, u: Partial<Usuario>) => {
      setUsuarios(prev => prev.map(usr => usr.id === id ? { ...usr, ...u } : usr));
      console.log("Atualizando usuário", id, u);
    },
    desativarUsuario: (id: string) => {
      setUsuarios(prev => prev.map(usr => usr.id === id ? { ...usr, ativo: false } : usr));
      console.log("Desativando usuário", id);
    },
    ativarUsuario: (id: string) => {
      setUsuarios(prev => prev.map(usr => usr.id === id ? { ...usr, ativo: true } : usr));
      console.log("Ativando usuário", id);
    },
  };
};

// --- FIM DAS SIMULAÇÕES (MOCKS) ---


interface UsuariosViewProps {
  onVoltar: () => void;
}

export function UsuariosView({ onVoltar }: UsuariosViewProps) {
  const { usuarios, adicionarUsuario, atualizarUsuario, desativarUsuario, ativarUsuario } = useUsuarios();
  
  const [modoExibicao, setModoExibicao] = useState<'lista' | 'cadastro' | 'edicao' | 'visualizacao'>('lista');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [busca, setBusca] = useState('');
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'advogado' as 'administrador' | 'advogado' | 'estagiario' | 'secretario',
    usuario: '',
    telefone: '',
    oab: '',
    ativo: true,
    observacoes: '',
  });

  const [erros, setErros] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      tipo: 'advogado',
      usuario: '',
      telefone: '',
      oab: '',
      ativo: true,
      observacoes: '',
    });
    setErros({});
  };

  const handleNovoCadastro = () => {
    resetForm();
    setModoExibicao('cadastro');
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    // FIX: Garantindo que valores opcionais sejam strings vazias para evitar o erro 2322
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      // Se a senha for omitida (boa prática), você pode deixá-la vazia para o usuário digitar
      // ou manter o hash salvo (se houver), mas aqui, forçamos a digitar novamente para segurança/simplicidade.
      senha: '', 
      confirmarSenha: '',
      tipo: usuario.tipo,
      usuario: usuario.usuario,
      telefone: usuario.telefone || '',
      oab: usuario.oab || '',
      ativo: usuario.ativo,
      observacoes: usuario.observacoes || '',
    });
    setErros({});
    setModoExibicao('edicao');
  };

  const handleVisualizar = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setModoExibicao('visualizacao');
  };

  const validarFormulario = (): boolean => {
    const novosErros: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      novosErros.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = 'E-mail inválido';
    }

    if (!formData.usuario.trim()) {
      novosErros.usuario = 'Nome de usuário é obrigatório';
    }

    // A senha é obrigatória apenas no cadastro, ou se estiver sendo alterada na edição
    if (modoExibicao === 'cadastro' && !formData.senha.trim()) {
      novosErros.senha = 'Senha é obrigatória no cadastro';
    } else if (formData.senha.trim() && formData.senha.length < 6) {
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (formData.senha.trim() && formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }
    
    // Para edição, se a senha não for alterada, não validamos o campo vazio
    // Se o modo for 'edicao' e a senha estiver vazia, pulamos a validação de senha/confirmação
    if (modoExibicao === 'edicao' && (formData.senha || formData.confirmarSenha) && formData.senha !== formData.confirmarSenha) {
         novosErros.confirmarSenha = 'As senhas não coincidem';
    }


    if ((formData.tipo === 'advogado' || formData.tipo === 'administrador') && !formData.oab?.trim()) {
      novosErros.oab = 'OAB é obrigatória para advogados';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = () => {
    if (!validarFormulario()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    const userData = {
      ...formData,
      // Remove a confirmação de senha do objeto final
      confirmarSenha: undefined,
      // Se estiver editando e a senha estiver vazia, não enviamos a senha para a API
      senha: modoExibicao === 'edicao' && !formData.senha ? undefined : formData.senha,
    }

    if (modoExibicao === 'cadastro') {
      // @ts-ignore
      adicionarUsuario(userData);
      toast.success(`Usuário ${formData.nome} cadastrado com sucesso!`);
    } else if (modoExibicao === 'edicao' && usuarioSelecionado) {
      // @ts-ignore
      atualizarUsuario(usuarioSelecionado.id, userData);
      toast.success(`Usuário ${formData.nome} atualizado com sucesso!`);
    }

    setModoExibicao('lista');
    resetForm();
    setUsuarioSelecionado(null);
  };

  const handleCancelar = () => {
    setModoExibicao('lista');
    resetForm();
    setUsuarioSelecionado(null);
  };

  const handleToggleAtivo = (usuario: Usuario) => {
    if (usuario.ativo) {
      // @ts-ignore
      desativarUsuario(usuario.id);
      toast.success(`Usuário ${usuario.nome} desativado`);
    } else {
      // @ts-ignore
      ativarUsuario(usuario.id);
      toast.success(`Usuário ${usuario.nome} ativado`);
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.usuario.toLowerCase().includes(busca.toLowerCase()) ||
    (usuario.oab && usuario.oab.toLowerCase().includes(busca.toLowerCase()))
  );

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'administrador':
        return <Badge className="bg-[#a16535] text-white border-[#a16535]">👑 Administrador</Badge>;
      case 'advogado':
        return <Badge className="bg-blue-500/30 text-blue-700 border-blue-600">⚖️ Advogado</Badge>;
      case 'estagiario':
        return <Badge className="bg-green-500/30 text-green-700 border-green-600">📚 Estagiário</Badge>;
      case 'secretario':
        return <Badge className="bg-purple-500/30 text-purple-700 border-purple-600">📋 Secretário</Badge>;
      default:
        return <Badge>{tipo}</Badge>;
    }
  };

  // Lista de usuários
  if (modoExibicao === 'lista') {
    return (
      // {/* ALTERAÇÃO: Adicionado 'p-4' */}
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        {/* ALTERAÇÃO: Header responsivo */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-[#2d1f16] flex items-center gap-2">
              <Users className="w-6 h-6 text-[#a16535]" />
              Gestão de Usuários
            </h2>
            <p className="text-[#6b5544]">Gerencie os usuários com acesso ao sistema</p>
          </div>
          <Button
            variant="outline"
            onClick={onVoltar}
            className="border-2 border-[#a16535] !text-[#a16535] hover:!bg-[#a16535] hover:!text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Página Inicial
           </Button>
        </div>

        <Card className="bg-white border-[#d4c4b0]">
          <CardHeader>
            {/* ALTERAÇÃO: Header do card responsivo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-[#2d1f16]">Usuários Cadastrados</CardTitle>
                <CardDescription className="text-[#6b5544]">
                  {usuariosFiltrados.length} usuário(s) encontrado(s)
                </CardDescription>
              </div>
              <Button
                onClick={handleNovoCadastro}
                // ALTERAÇÃO: w-full sm:w-auto
                className="bg-[#a16535] hover:bg-[#8b5329] text-white w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Campo de busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b5544] w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email, usuário ou OAB..."
                  value={busca}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusca(e.target.value)}
                  className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                />
              </div>

              {/* Lista de usuários */}
              <div className="space-y-3">
                {usuariosFiltrados.length === 0 ? (
                  <div className="text-center py-8 text-[#6b5544]">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum usuário encontrado</p>
                  </div>
                ) : (
                  usuariosFiltrados.map((usuario) => (
                    <div
                      key={usuario.id}
                      // ALTERAÇÃO: Lista responsiva (card)
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#f6f3ee] rounded-lg border border-[#d4c4b0] hover:border-[#a16535] transition-colors"
                    >
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-[#2d1f16]">{usuario.nome}</h3>
                          {getTipoBadge(usuario.tipo)}
                          {!usuario.ativo && (
                            <Badge variant="outline" className="border-red-600 text-red-700">
                              Inativo
                            </Badge>
                          )}
                        </div>
                        {/* ALTERAÇÃO: grid-cols-1 sm:grid-cols-3 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-[#6b5544]">
                          <p className="truncate">✉️ {usuario.email}</p>
                          <p className="truncate">👤 @{usuario.usuario}</p>
                          {usuario.oab && <p className="truncate">⚖️ {usuario.oab}</p>}
                        </div>
                      </div>
                      {/* ALTERAÇÃO: Botões com self-end e margin */}
                      <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto mt-4 sm:mt-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleVisualizar(usuario)}
                          className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#a16535]/10"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditar(usuario)}
                          className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#a16535]/10"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleToggleAtivo(usuario)}
                          className={usuario.ativo ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                          title={usuario.ativo ? "Desativar" : "Ativar"}
                        >
                          {usuario.ativo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Visualização de usuário
  if (modoExibicao === 'visualizacao' && usuarioSelecionado) {
    return (
      // {/* ALTERAÇÃO: Adicionado 'p-4' */}
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <Card className="bg-white border-[#d4c4b0]">
          <CardHeader>
            {/* ALTERAÇÃO: Header responsivo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-[#2d1f16] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#a16535]" />
                  Detalhes do Usuário
                </CardTitle>
                <CardDescription className="text-[#6b5544]">
                  Informações completas do usuário
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={handleCancelar}
                // ALTERAÇÃO: self-end sm:self-auto
                className="border-[#d4c4b0] text-[#6b5544] hover:bg-[#f6f3ee] self-end sm:self-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Fechar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[#2d1f16]">{usuarioSelecionado.nome}</h3>
                {getTipoBadge(usuarioSelecionado.tipo)}
                {!usuarioSelecionado.ativo && (
                  <Badge variant="outline" className="border-red-600 text-red-700">
                    Inativo
                  </Badge>
                )}
              </div>

              <Separator className="bg-[#d4c4b0]" />

              {/* ALTERAÇÃO: Grid já era responsivo (md:grid-cols-2), mantido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-[#6b5544]">E-mail</Label>
                  <p className="text-[#2d1f16] break-words">{usuarioSelecionado.email}</p>
                </div>
                <div>
                  <Label className="text-[#6b5544]">Nome de Usuário</Label>
                  <p className="text-[#2d1f16] break-words">{usuarioSelecionado.usuario}</p>
                </div>
                {usuarioSelecionado.telefone && (
                  <div>
                    <Label className="text-[#6b5544]">Telefone</Label>
                    <p className="text-[#2d1f16]">{usuarioSelecionado.telefone}</p>
                  </div>
                )}
                {usuarioSelecionado.oab && (
                  <div>
                    <Label className="text-[#6b5544]">OAB</Label>
                    <p className="text-[#2d1f16]">{usuarioSelecionado.oab}</p>
                  </div>
                )}
                <div>
                  <Label className="text-[#6b5544]">Data de Cadastro</Label>
                  <p className="text-[#2d1f16]">{formatDateTimeBR(usuarioSelecionado.dataCadastro)}</p>
                </div>
                <div>
                  <Label className="text-[#6b5544]">Status</Label>
                  <p className="text-[#2d1f16]">{usuarioSelecionado.ativo ? 'Ativo' : 'Inativo'}</p>
                </div>
              </div>

              {usuarioSelecionado.observacoes && (
                <>
                  <Separator className="bg-[#d4c4b0]" />
                  <div>
                    <Label className="text-[#6b5544]">Observações</Label>
                    <p className="text-[#2d1f16] whitespace-pre-wrap">{usuarioSelecionado.observacoes}</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => handleEditar(usuarioSelecionado)}
                // ALTERAÇÃO: w-full sm:w-auto
                className="bg-[#a16535] hover:bg-[#8b5329] text-white w-full sm:w-auto"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Formulário de cadastro/edição
  return (
    // {/* ALTERAÇÃO: Adicionado 'p-4' */}
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <Card className="bg-white border-[#d4c4b0]">
        <CardHeader>
          {/* ALTERAÇÃO: Header responsivo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-[#2d1f16] flex items-center gap-2">
                {modoExibicao === 'cadastro' ? <UserPlus className="w-5 h-5 text-[#a16535]" /> : <Edit className="w-5 h-5 text-[#a16535]" />}
                {modoExibicao === 'cadastro' ? 'Novo Usuário' : 'Editar Usuário'}
              </CardTitle>
              <CardDescription className="text-[#6b5544]">
                {modoExibicao === 'cadastro' 
                  ? 'Preencha os dados para cadastrar um novo usuário'
                  : 'Atualize as informações do usuário'}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={handleCancelar}
              // ALTERAÇÃO: self-end sm:self-auto
              className="border-[#d4c4b0] text-[#6b5544] hover:bg-[#f6f3ee] self-end sm:self-auto"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Dados Principais */}
            <div className="space-y-4">
              <h3 className="text-[#4a3629] flex items-center gap-2">
                Dados Principais
              </h3>
              
              {/* ALTERAÇÃO: Grid já era responsivo (md:grid-cols-2), mantido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nome" className="text-[#6b5544]">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nome: e.target.value })}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    placeholder="Digite o nome completo"
                  />
                  {erros.nome && (
                    <p className="text-sm text-red-600 mt-1">{erros.nome}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#6b5544]">
                    E-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    placeholder="email@exemplo.com"
                  />
                  {erros.email && (
                    <p className="text-sm text-red-600 mt-1">{erros.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefone" className="text-[#6b5544]">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, telefone: formatTelefone(e.target.value) })}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div>
                  <Label htmlFor="tipo" className="text-[#6b5544]">
                    Tipo de Usuário *
                  </Label>
                  <select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-md border border-[#d4c4b0] bg-[#f6f3ee] text-[#2d1f16] focus:border-[#a16535] focus:ring-2 focus:ring-[#a16535]/20 outline-none transition-colors"
                  >
                    <option value="administrador">Administrador</option>
                    <option value="advogado">Advogado</option>
                    <option value="estagiario">Estagiário</option>
                    <option value="secretario">Secretário</option>
                  </select>
                </div>

                {(formData.tipo === 'advogado' || formData.tipo === 'administrador') && (
                  <div>
                    <Label htmlFor="oab" className="text-[#6b5544]">
                      OAB *
                    </Label>
                    <Input
                      id="oab"
                      value={formData.oab}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, oab: e.target.value })}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      placeholder="OAB/SP 123.456"
                    />
                    {erros.oab && (
                      <p className="text-sm text-red-600 mt-1">{erros.oab}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-[#d4c4b0]" />

            {/* Dados de Acesso */}
            <div className="space-y-4">
              <h3 className="text-[#4a3629] flex items-center gap-2">
                Dados de Acesso
              </h3>
              
              {/* ALTERAÇÃO: Grid já era responsivo (md:grid-cols-2), mantido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="usuario" className="text-[#6b5544]">
                    Nome de Usuário *
                  </Label>
                  <Input
                    id="usuario"
                    value={formData.usuario}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, usuario: e.target.value.toLowerCase().replace(/\s/g, '') })}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    placeholder="usuario.login"
                  />
                  {erros.usuario && (
                    <p className="text-sm text-red-600 mt-1">{erros.usuario}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="senha" className="text-[#6b5544]">
                    Senha *
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, senha: e.target.value })}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    placeholder="Mínimo 6 caracteres"
                  />
                  {erros.senha && (
                    <p className="text-sm text-red-600 mt-1">{erros.senha}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmarSenha" className="text-[#6b5544]">
                    Confirmar Senha *
                  </Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    placeholder="Repita a senha"
                  />
                  {erros.confirmarSenha && (
                    <p className="text-sm text-red-600 mt-1">{erros.confirmarSenha}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator className="bg-[#d4c4b0]" />

            {/* Observações */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="observacoes" className="text-[#6b5544]">
                  Observações
                </Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 min-h-[100px]"
                  placeholder="Informações adicionais sobre o usuário..."
                />
              </div>
            </div>

            {Object.keys(erros).length > 0 && (
              <Alert className="border-red-600 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Por favor, corrija os erros antes de salvar
                </AlertDescription>
              </Alert>
            )}

            {/* ALTERAÇÃO: Botões de ação responsivos */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelar}
                // ALTERAÇÃO: w-full sm:w-auto
                className="border-[#d4c4b0] text-[#6b5544] hover:bg-[#f6f3ee] w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSalvar}
                // ALTERAÇÃO: w-full sm:w-auto
                className="bg-[#a16535] hover:bg-[#8b5329] text-white w-full sm:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Adicionar exportação default para o ambiente de preview
export default UsuariosView;
