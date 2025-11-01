import React, { useState } from 'react';

// ──────────────────────────────────────────────────────────────
// MOCKS (ícones, componentes UI, contexto, formatters, etc.)
// ──────────────────────────────────────────────────────────────
const LucideMock = ({
  className = '',
  children,
  ...props
}: React.SVGProps<SVGSVGElement> & { children?: React.ReactNode }) => (
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

const Users = (p: React.SVGProps<SVGSVGElement>) => (
  <LucideMock {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </LucideMock>
);
const UserPlus = (p: React.SVGProps<SVGSVGElement>) => (
  <LucideMock {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </LucideMock>
);
const Search = (p: React.SVGProps<SVGSVGElement>) => (
  <LucideMock {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </LucideMock>
);
const Edit = (p: React.SVGProps<SVGSVGElement>) => (
  <LucideMock {...p}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </LucideMock>
);
const Eye = (p: React.SVGProps<SVGSVGElement>) => (
  <LucideMock {...p}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </LucideMock>
);
const X = (p: React.SVGProps<SVGSVGElement>) => (
  <LucideMock {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </LucideMock>
);
const Save = (p: React.SVGProps<SVGSVGElement>) => (
  <LucideMock {...p}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </LucideMock>
);
const AlertCircle = (p: React.SVGProps<SVGSVGElement>) => (
  <LucideMock {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </LucideMock>
);
const UserCheck = (p: React.SVGProps<SVGSVGElement>) => (
  <LucideMock {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </LucideMock>
);
const UserX = (p: React.SVGProps<SVGSVGElement>) => (
  <LucideMock {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="17" x2="22" y1="8" y2="13" />
    <line x1="22" x2="17" y1="8" y2="13" />
  </LucideMock>
);
const ArrowLeft = (p: React.SVGProps<SVGSVGElement>) => (
  <LucideMock {...p}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </LucideMock>
);

// UI mocks
const Card = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`border rounded-lg shadow-sm bg-white ${className}`} {...p} />
);
const CardHeader = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...p} />
);
const CardTitle = ({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...p} />
);
const CardDescription = ({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-gray-500 ${className}`} {...p} />
);
const CardContent = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 ${className}`} {...p} />
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...p }, ref) => (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...p}
    />
  )
);
Input.displayName = 'Input';

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...p }, ref) => (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      ref={ref}
      {...p}
    />
  )
);
Label.displayName = 'Label';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'ghost' | 'default';
  size?: 'sm' | 'default' | 'icon';
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...p }, ref) => (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${variant === 'outline' ? 'border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900' : variant === 'ghost' ? 'hover:bg-gray-100 hover:text-gray-900' : 'bg-blue-600 text-white hover:bg-blue-700'}
        ${size === 'sm' ? 'h-9 px-3' : size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 py-2'}
        ${className}`}
      ref={ref}
      {...p}
    />
  )
);
Button.displayName = 'Button';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'outline' | 'default' | string;
}
const Badge = ({ className, ...p }: BadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    {...p}
  />
);

const Alert = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div role="alert" className={`relative w-full rounded-lg border p-4 ${className}`} {...p} />
);
const AlertDescription = ({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <div className={`text-sm ${className}`} {...p} />
);

const Separator = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`shrink-0 bg-gray-200 h-[1px] w-full ${className}`} {...p} />
);

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...p }, ref) => (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...p}
    />
  )
);
Textarea.displayName = 'Textarea';

const toast = {
  success: (msg: string) => console.log(`Toast Success: ${msg}`),
  error: (msg: string) => console.log(`Toast Error: ${msg}`),
};

const formatDateTimeBR = (dateStr?: string | null) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('pt-BR', { timeZone: 'UTC' });
  } catch {
    return dateStr;
  }
};

const formatTelefone = (v: string) => {
  if (!v) return '';
  const n = v.replace(/\D/g, '');
  const m = n.replace(/^(\d{2})(\d)/g, '($1) $2');
  return m.replace(/(\d)(\d{4})$/, '$1-$2').slice(0, 15);
};

// ──────────────────────────────────────────────────────────────
// CONTEXTO DE USUÁRIOS (mock)
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
  {
    id: '1',
    nome: 'Dr. João Silva',
    email: 'joao@juris.com',
    tipo: 'administrador',
    usuario: 'joao.silva',
    oab: 'SP123456',
    ativo: true,
    dataCadastro: '2025-01-15T12:00:00.000Z',
    telefone: '(11) 98765-4321',
  },
  {
    id: '2',
    nome: 'Dra. Ana Costa',
    email: 'ana@juris.com',
    tipo: 'advogado',
    usuario: 'ana.costa',
    oab: 'SP654321',
    ativo: true,
    dataCadastro: '2025-02-20T12:00:00.000Z',
    observacoes: 'Especialista em cível.',
  },
  {
    id: '3',
    nome: 'Carlos Pereira',
    email: 'carlos@juris.com',
    tipo: 'estagiario',
    usuario: 'carlos.pereira',
    ativo: false,
    dataCadastro: '2025-03-10T12:00:00.000Z',
  },
];

const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState(mockUsuariosData);
  return {
    usuarios,
    adicionarUsuario: (u: Omit<Usuario, 'id' | 'dataCadastro'>) => {
      const novo = { ...u, id: String(usuarios.length + 1), dataCadastro: new Date().toISOString() };
      setUsuarios((p) => [...p, novo]);
    },
    atualizarUsuario: (id: string, u: Partial<Usuario>) => {
      setUsuarios((p) => p.map((usr) => (usr.id === id ? { ...usr, ...u } : usr)));
    },
    desativarUsuario: (id: string) => {
      setUsuarios((p) => p.map((usr) => (usr.id === id ? { ...usr, ativo: false } : usr)));
    },
    ativarUsuario: (id: string) => {
      setUsuarios((p) => p.map((usr) => (usr.id === id ? { ...usr, ativo: true } : usr)));
    },
  };
};

// ──────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────────
interface UsuariosViewProps {
  onVoltar: () => void;
}

export function UsuariosView({ onVoltar }: UsuariosViewProps) {
  const { usuarios, adicionarUsuario, atualizarUsuario, desativarUsuario, ativarUsuario } = useUsuarios();

  const [modoExibicao, setModoExibicao] = useState<'lista' | 'cadastro' | 'edicao' | 'visualizacao'>('lista');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [busca, setBusca] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'advogado' as Usuario['tipo'],
    usuario: '',
    telefone: '',
    oab: '',
    ativo: true,
    observacoes: '',
  });

  const [erros, setErros] = useState<Record<string, string>>({});

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

  const handleEditar = (u: Usuario) => {
    setUsuarioSelecionado(u);
    setFormData({
      nome: u.nome,
      email: u.email,
      senha: '',
      confirmarSenha: '',
      tipo: u.tipo,
      usuario: u.usuario,
      telefone: u.telefone || '',
      oab: u.oab || '',
      ativo: u.ativo,
      observacoes: u.observacoes || '',
    });
    setErros({});
    setModoExibicao('edicao');
  };

  const handleVisualizar = (u: Usuario) => {
    setUsuarioSelecionado(u);
    setModoExibicao('visualizacao');
  };

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!formData.nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) novosErros.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) novosErros.email = 'E-mail inválido';
    if (!formData.usuario.trim()) novosErros.usuario = 'Nome de usuário é obrigatório';
    if (modoExibicao === 'cadastro' && !formData.senha.trim()) novosErros.senha = 'Senha é obrigatória no cadastro';
    else if (formData.senha.trim() && formData.senha.length < 6) novosErros.senha = 'Senha deve ter no mínimo 6 caracteres';
    if (formData.senha.trim() && formData.senha !== formData.confirmarSenha)
      novosErros.confirmarSenha = 'As senhas não coincidem';
    if (modoExibicao === 'edicao' && (formData.senha || formData.confirmarSenha) && formData.senha !== formData.confirmarSenha)
      novosErros.confirmarSenha = 'As senhas não coincidem';
    if ((formData.tipo === 'advogado' || formData.tipo === 'administrador') && !formData.oab?.trim())
      novosErros.oab = 'OAB é obrigatória para advogados';

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
      confirmarSenha: undefined,
      senha: modoExibicao === 'edicao' && !formData.senha ? undefined : formData.senha,
    };

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

  const handleToggleAtivo = (u: Usuario) => {
    if (u.ativo) {
      // @ts-ignore
      desativarUsuario(u.id);
      toast.success(`Usuário ${u.nome} desativado`);
    } else {
      // @ts-ignore
      ativarUsuario(u.id);
      toast.success(`Usuário ${u.nome} ativado`);
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase()) ||
      u.usuario.toLowerCase().includes(busca.toLowerCase()) ||
      (u.oab && u.oab.toLowerCase().includes(busca.toLowerCase()))
  );

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'administrador':
        return <Badge className="bg-[#a16535] text-white border-[#a16535]">Administrador</Badge>;
      case 'advogado':
        return <Badge className="bg-blue-500/30 text-blue-700 border-blue-600">Advogado</Badge>;
      case 'estagiario':
        return <Badge className="bg-green-500/30 text-green-700 border-green-600">Estagiário</Badge>;
      case 'secretario':
        return <Badge className="bg-purple-500/30 text-purple-700 border-purple-600">Secretário</Badge>;
      default:
        return <Badge>{tipo}</Badge>;
    }
  };

  // ──────────────────────── LISTA ────────────────────────
  if (modoExibicao === 'lista') {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        {/* Header da página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl text-[#2d1f16] flex items-center gap-2">
              <Users className="w-6 h-6 text-[#a16535]" />
              Gestão de Usuários
            </h2>
            <p className="text-[#6b5544]">Gerencie os usuários com acesso ao sistema</p>
          </div>
          <Button
            variant="outline"
            onClick={onVoltar}
            className="w-full sm:w-auto !bg-white !text-[#a16535] border-2 !border-[#955d30] hover:!bg-[#a16535] hover:!text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Página Inicial
          </Button>
        </div>

        <Card className="bg-white border-[#d4c4b0]">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-[#2d1f16]">Usuários Cadastrados</CardTitle>
                <CardDescription className="text-[#6b5544]">
                  {usuariosFiltrados.length} usuário(s) encontrado(s)
                </CardDescription>
              </div>
              <Button
                onClick={handleNovoCadastro}
                className="!bg-[#9b6236] !hover:bg-[#9b6236] !text-white w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5544] w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email, usuário ou OAB..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                />
              </div>

              {/* Lista */}
              <div className="space-y-3">
                {usuariosFiltrados.length === 0 ? (
                  <div className="text-center py-8 text-[#6b5544]">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum usuário encontrado</p>
                  </div>
                ) : (
                  usuariosFiltrados.map((u) => (
                    <div
                      key={u.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#f6f3ee] rounded-lg border border-[#d4c4b0] hover:border-[#a16535] transition-colors"
                    >
                      {/* Informações */}
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-[#2d1f16]">{u.nome}</h3>
                          {getTipoBadge(u.tipo)}
                          {!u.ativo && (
                            <Badge variant="outline" className="border-red-600 text-red-700">
                              Inativo
                            </Badge>
                          )}
                        </div>

                        {/* Dados sem emojis */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-[#6b5544]">
                          <p className="truncate">{u.email}</p>
                          <p className="truncate">@{u.usuario}</p>
                          {u.oab && <p className="truncate">{u.oab}</p>}
                        </div>
                      </div>

                      {/* Botões – sempre à direita */}
                      <div className="flex items-center gap-1 sm:gap-2 mt-3 sm:mt-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleVisualizar(u)}
                          className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#a16535]/10"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditar(u)}
                          className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#a16535]/10"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleToggleAtivo(u)}
                          className={u.ativo ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}
                          title={u.ativo ? 'Desativar' : 'Ativar'}
                        >
                          {u.ativo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
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

  // ──────────────────────── VISUALIZAÇÃO ────────────────────────
  if (modoExibicao === 'visualizacao' && usuarioSelecionado) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <Card className="bg-white border-[#d4c4b0]">
          {/* Header responsivo */}
          <div className="flex items-center justify-between p-6 border-b border-[#d4c4b0]">
            {/* Placeholder para empurrar o X à direita no mobile */}
            <div className="flex-1 sm:hidden" />

            {/* Botão X mobile - agora à direita */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCancelar}
              className="sm:hidden text-[#6b5544] hover:bg-[#f6f3ee] rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Desktop – título + descrição */}
            <div className="hidden sm:block">
              <CardTitle className="text-[#2d1f16] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#a16535]" />
                Detalhes do Cliente
              </CardTitle>
              <CardDescription className="text-[#6b5544]">
                Visualização completa dos dados cadastrais
              </CardDescription>
            </div>

            {/* Desktop – botão fechar */}
            <Button
              variant="outline"
              onClick={handleCancelar}
              className="hidden sm:flex border-[#d4c4b0] text-[#6b5544] hover:bg-[#f6f3ee] items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Fechar
            </Button>
          </div>

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

  // ──────────────────────── FORMULÁRIO ────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <Card className="bg-white border-[#d4c4b0]">
        {/* Header do formulário */}
        <div className="flex items-center justify-between p-6 border-b border-[#d4c4b0]">
          {/* Placeholder para empurrar o X à direita no mobile */}
          <div className="flex-1 sm:hidden" />

          {/* Botão X mobile - agora à direita */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancelar}
            className="sm:hidden text-[#6b5544] hover:bg-[#f6f3ee] rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Desktop – título + descrição */}
          <div className="hidden sm:block">
            <CardTitle className="text-[#2d1f16] flex items-center gap-2">
              {modoExibicao === 'cadastro' ? (
                <UserPlus className="w-5 h-5 text-[#a16535]" />
              ) : (
                <Edit className="w-5 h-5 text-[#a16535]" />
              )}
              {modoExibicao === 'cadastro' ? 'Novo Usuário' : 'Editar Usuário'}
            </CardTitle>
            <CardDescription className="text-[#6b5544]">
              {modoExibicao === 'cadastro'
                ? 'Preencha os dados para cadastrar um novo usuário'
                : 'Atualize as informações do usuário'}
            </CardDescription>
          </div>

          {/* Desktop – botão cancelar */}
          <Button
            variant="outline"
            onClick={handleCancelar}
            className="hidden sm:flex border-[#d4c4b0] text-[#6b5544] hover:bg-[#f6f3ee] items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>

        <CardContent>
          <div className="space-y-6">
            {/* Dados Principais */}
            <div className="space-y-4">
              <h3 className="text-[#4a3629] flex items-center gap-2">Dados Principais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nome" className="text-[#6b5544]">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    placeholder="Digite o nome completo"
                  />
                  {erros.nome && <p className="text-sm text-red-600 mt-1">{erros.nome}</p>}
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#6b5544]">
                    E-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    placeholder="email@exemplo.com"
                  />
                  {erros.email && <p className="text-sm text-red-600 mt-1">{erros.email}</p>}
                </div>

                <div>
                  <Label htmlFor="telefone" className="text-[#6b5544]">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: formatTelefone(e.target.value) })}
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
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
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
                      onChange={(e) => setFormData({ ...formData, oab: e.target.value })}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      placeholder="OAB/SP 123.456"
                    />
                    {erros.oab && <p className="text-sm text-red-600 mt-1">{erros.oab}</p>}
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-[#d4c4b0]" />

            {/* Dados de Acesso */}
            <div className="space-y-4">
              <h3 className="text-[#4a3629] flex items-center gap-2">Dados de Acesso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="usuario" className="text-[#6b5544]">
                    Nome de Usuário *
                  </Label>
                  <Input
                    id="usuario"
                    value={formData.usuario}
                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value.toLowerCase().replace(/\s/g, '') })}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    placeholder="usuario.login"
                  />
                  {erros.usuario && <p className="text-sm text-red-600 mt-1">{erros.usuario}</p>}
                </div>

                <div>
                  <Label htmlFor="senha" className="text-[#6b5544]">
                    Senha *
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    placeholder="Mínimo 6 caracteres"
                  />
                  {erros.senha && <p className="text-sm text-red-600 mt-1">{erros.senha}</p>}
                </div>

                <div>
                  <Label htmlFor="confirmarSenha" className="text-[#6b5544]">
                    Confirmar Senha *
                  </Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    placeholder="Repita a senha"
                  />
                  {erros.confirmarSenha && <p className="text-sm text-red-600 mt-1">{erros.confirmarSenha}</p>}
                </div>
              </div>
            </div>

            <Separator className="bg-[#d4c4b0]" />

            {/* Observações */}
            <div className="space-y-4">
              <Label htmlFor="observacoes" className="text-[#6b5544]">
                Observações
              </Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 min-h-[100px]"
                placeholder="Informações adicionais sobre o usuário..."
              />
            </div>

            {Object.keys(erros).length > 0 && (
              <Alert className="border-red-600 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Por favor, corrija os erros antes de salvar
                </AlertDescription>
              </Alert>
            )}

            {/* Botões de ação – responsivos */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelar}
                className="border-[#d4c4b0] text-[#6b5544] hover:bg-[#f6f3ee] w-full sm:w-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleSalvar}
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

export default UsuariosView;