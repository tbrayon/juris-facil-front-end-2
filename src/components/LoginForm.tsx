import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ArrowLeft, LogIn, Scale, KeyRound, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
// Removido: import { Footer } from './Footer';
// Caminho do contexto: Sobe um nível de components/ e entra em contexts/
import { useUsuarios, Usuario } from '../contexts/UsuariosContext';

interface LoginFormProps {
  onBack: () => void;
  onLoginSuccess: (name: string, tipo: string) => void; // Removido avatarUrl se não for usar
}

export function LoginForm({ onBack, onLoginSuccess }: LoginFormProps) {
  const { autenticarUsuario } = useUsuarios();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarRecuperacao, setMostrarRecuperacao] = useState(false);
  const [etapaRecuperacao, setEtapaRecuperacao] = useState<'email' | 'codigo' | 'nova-senha'>('email');
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const [codigoVerificacao, setCodigoVerificacao] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Adicionado estado de loading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Inicia loading

    // Simulação de autenticação (uso do contexto)
    const usuarioAutenticado = autenticarUsuario(usuario, senha);

    // Simula delay para feedback visual
    setTimeout(() => {
        if (usuarioAutenticado) {
            toast.success('Login realizado com sucesso!', {
              description: `Bem-vindo(a), ${usuarioAutenticado.nome}`,
              duration: 3000,
            });
            onLoginSuccess(usuarioAutenticado.nome, usuarioAutenticado.tipo);
            // Não precisa setar isLoading(false) aqui pois o componente desmontará
        } else {
            toast.error('Credenciais inválidas', {
              description: 'Usuário ou senha incorretos. Tente novamente.',
              duration: 4000,
            });
            setIsLoading(false); // Termina loading em caso de erro
        }
    }, 500); // Meio segundo de delay simulado
  };

  // Funções de recuperação de senha (handleEnviarEmail, handleVerificarCodigo, handleRedefinirSenha)
  // ... (Cole as funções handleEnviarEmail, handleVerificarCodigo, handleRedefinirSenha aqui, como no seu exemplo anterior)
   const handleEnviarEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecuperacao.trim()) {
      toast.error('Digite um email válido');
      return;
    }
    // Simula envio de email
    toast.success('Email enviado!', {
      description: 'Verifique sua caixa de entrada para o código de verificação.',
      duration: 4000,
    });
    setEtapaRecuperacao('codigo');
  };

  const handleVerificarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    // Código de exemplo para teste: 123456
    if (codigoVerificacao === '123456') {
      toast.success('Código verificado!', {
        description: 'Agora você pode cadastrar uma nova senha.',
        duration: 3000,
      });
      setEtapaRecuperacao('nova-senha');
    } else {
      toast.error('Código inválido', {
        description: 'O código de verificação está incorreto. Tente novamente.',
        duration: 4000,
      });
    }
  };

  const handleRedefinirSenha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaSenha || !confirmarSenha) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem', {
        description: 'Verifique se digitou a mesma senha nos dois campos.',
        duration: 4000,
      });
      return;
    }
    if (novaSenha.length < 6) {
      toast.error('Senha muito curta', {
        description: 'A senha deve ter no mínimo 6 caracteres.',
        duration: 4000,
      });
      return;
    }
    // Simula alteração de senha
    toast.success('Senha alterada com sucesso!', {
      description: 'Agora você pode fazer login com a nova senha.',
      duration: 4000,
    });
    // Reset do formulário
    setMostrarRecuperacao(false);
    setEtapaRecuperacao('email');
    setEmailRecuperacao('');
    setCodigoVerificacao('');
    setNovaSenha('');
    setConfirmarSenha('');
  };


  return (
    // Estrutura principal igual à WelcomePage
    <div className="w-full min-h-screen flex flex-col bg-[#f6f3ee]">
      {/* Container principal centralizado */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">

        <div className="w-full max-w-md"> {/* Limitador de largura para o formulário */}
          {/* Botão Voltar (posicionado acima do Card) */}
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-[#4a3629] hover:text-[#2d1f16] hover:bg-[#d4c4b0]/30 self-start" // self-start para alinhar à esquerda
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {/* Card do Formulário de Login */}
          <Card className="bg-white border-2 border-[#d4c4b0] shadow-xl w-full">
            <CardHeader className="space-y-4 text-center pb-4">
              <div className="flex justify-center">
                <div className="bg-[#a16535] p-4 rounded-xl shadow-lg">
                  <Scale className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl text-[#2d1f16]">
                  JURIS <span className="text-[#a16535]">FÁCIL</span>
                </CardTitle>
                <CardDescription className="mt-2 text-[#6b5544]">
                  Entre com suas credenciais para acessar o sistema
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="usuario" className="text-[#4a3629]">Usuário</Label>
                  <Input
                    id="usuario" type="text" placeholder="Digite seu usuário" value={usuario}
                    onChange={(e) => setUsuario(e.target.value)} required disabled={isLoading}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-[#4a3629]">Senha</Label>
                  <Input
                    id="senha" type="password" placeholder="Digite sua senha" value={senha}
                    onChange={(e) => setSenha(e.target.value)} required disabled={isLoading}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                  />
                </div>
                <Button
                  type="submit" disabled={isLoading}
                  className="w-full bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30 transition-all duration-300"
                >
                  {isLoading ? 'Entrando...' : <><LogIn className="w-4 h-4 mr-2" /> Entrar</>}
                </Button>
                <div className="text-center">
                  <button
                    type="button" onClick={() => setMostrarRecuperacao(true)} disabled={isLoading}
                    className="text-sm text-[#4a3629] hover:text-[#2d1f16] hover:underline transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                {/* Exemplo de Credenciais (igual ao anterior) */}
                 <div className="pt-4 border-t border-[#d4c4b0]">
                  <p className="text-sm text-[#6b5544] text-center">
                    <strong className="text-[#4a3629]">Exemplos de credenciais:</strong>
                    <br />
                    <span className="text-xs">Administradora: <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded">administradora</code> / <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded">adv123</code></span>
                    <br />
                    <span className="text-xs">Advogado: <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded">carlos.silva</code> / <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded">adv456</code></span>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de Recuperação de Senha (igual ao anterior) */}
      <Dialog open={mostrarRecuperacao} onOpenChange={setMostrarRecuperacao}>
        <DialogContent className="bg-white border-2 border-[#d4c4b0] sm:max-w-md">
           {/* ... (Cole o conteúdo do Dialog aqui, exatamente como estava no seu exemplo anterior) ... */}
           <DialogHeader>
            <DialogTitle className="text-[#2d1f16] flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#a16535]" />
              Recuperar Senha
            </DialogTitle>
            <DialogDescription className="text-[#6b5544]">
              {etapaRecuperacao === 'email' && 'Digite seu email para receber o código de verificação'}
              {etapaRecuperacao === 'codigo' && 'Digite o código enviado para seu email'}
              {etapaRecuperacao === 'nova-senha' && 'Cadastre sua nova senha'}
            </DialogDescription>
          </DialogHeader>

          {/* Etapa 1: Email */}
          {etapaRecuperacao === 'email' && (
            <form onSubmit={handleEnviarEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-recuperacao" className="text-[#4a3629]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b5544]" />
                  <Input
                    id="email-recuperacao"
                    type="email"
                    placeholder="seu@email.com"
                    value={emailRecuperacao}
                    onChange={(e) => setEmailRecuperacao(e.target.value)}
                    required
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMostrarRecuperacao(false);
                    setEtapaRecuperacao('email');
                    setEmailRecuperacao('');
                  }}
                  className="flex-1 border-[#d4c4b0] text-[#4a3629] hover:bg-[#f6f3ee]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#a16535] hover:bg-[#8b5329] text-white"
                >
                  Enviar Código
                </Button>
              </div>
            </form>
          )}

          {/* Etapa 2: Código de Verificação */}
          {etapaRecuperacao === 'codigo' && (
            <form onSubmit={handleVerificarCodigo} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codigo-verificacao" className="text-[#4a3629]">
                  Código de Verificação
                </Label>
                <Input
                  id="codigo-verificacao"
                  type="text"
                  placeholder="Digite o código de 6 dígitos"
                  value={codigoVerificacao}
                  onChange={(e) => setCodigoVerificacao(e.target.value)}
                  required
                  maxLength={6}
                  className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 text-center tracking-widest"
                />
                <p className="text-xs text-[#6b5544] text-center">
                  Código de teste: <code className="text-[#a16535] bg-[#f6f3ee] px-2 py-1 rounded">123456</code>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEtapaRecuperacao('email')}
                  className="flex-1 border-[#d4c4b0] text-[#4a3629] hover:bg-[#f6f3ee]"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#a16535] hover:bg-[#8b5329] text-white"
                >
                  Verificar Código
                </Button>
              </div>
            </form>
          )}

          {/* Etapa 3: Nova Senha */}
          {etapaRecuperacao === 'nova-senha' && (
            <form onSubmit={handleRedefinirSenha} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nova-senha" className="text-[#4a3629]">
                  Nova Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b5544]" />
                  <Input
                    id="nova-senha"
                    type="password"
                    placeholder="Digite a nova senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmar-senha" className="text-[#4a3629]">
                  Confirmar Nova Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b5544]" />
                  <Input
                    id="confirmar-senha"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#a16535] hover:bg-[#8b5329] text-white"
              >
                Redefinir Senha
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* REMOVIDO: O componente Footer principal */}
       {/* <Footer /> */}

      {/* Footer Básico Opcional */}
       <footer className="mt-8 text-center absolute bottom-4 left-0 right-0"> {/* Posicionado na parte inferior */}
        <p className="text-xs text-[#6b5544]">© 2026 Sistema de Gestão Jurídica</p>
      </footer>

    </div> // Fechamento da div principal
  );
}