import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ArrowLeft, LogIn, Scale, KeyRound, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useUsuarios } from '../contexts/UsuariosContext';

interface LoginFormProps {
  onBack: () => void;
  onLoginSuccess: (name: string, tipo: string) => void;
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const usuarioAutenticado = autenticarUsuario(usuario, senha);

    setTimeout(() => {
      if (usuarioAutenticado) {
        toast.success('Login realizado com sucesso!', {
          description: `Bem-vindo(a), ${usuarioAutenticado.nome}`,
          duration: 3000,
        });
        onLoginSuccess(usuarioAutenticado.nome, usuarioAutenticado.tipo);
      } else {
        toast.error('Credenciais inválidas', {
          description: 'Usuário ou senha incorretos. Tente novamente.',
          duration: 4000,
        });
        setIsLoading(false);
      }
    }, 500);
  };

  const handleEnviarEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecuperacao.trim()) {
      toast.error('Digite um email válido');
      return;
    }
    toast.success('Email enviado!', {
      description: 'Verifique sua caixa de entrada para o código de verificação.',
      duration: 4000,
    });
    setEtapaRecuperacao('codigo');
  };

  const handleVerificarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
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
    toast.success('Senha alterada com sucesso!', {
      description: 'Agora você pode fazer login com a nova senha.',
      duration: 4000,
    });
    setMostrarRecuperacao(false);
    setEtapaRecuperacao('email');
    setEmailRecuperacao('');
    setCodigoVerificacao('');
    setNovaSenha('');
    setConfirmarSenha('');
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f6f3ee] relative pb-16">
      {/* Container principal */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-[#4a3629] hover:text-[#2d1f16] hover:bg-[#d4c4b0]/30 text-sm sm:text-base"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {/* Card do Login */}
          <Card className="bg-white border-2 border-[#d4c4b0] shadow-xl w-full">
            <CardHeader className="space-y-4 text-center pb-4">
              <div className="flex justify-center">
                <div className="bg-[#a16535] p-3 sm:p-4 rounded-xl shadow-lg">
                  <Scale className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl text-[#2d1f16]">
                  JURIS <span className="text-[#a16535]">FÁCIL</span>
                </CardTitle>
                <CardDescription className="mt-2 text-[#6b5544] text-sm sm:text-base">
                  Entre com suas credenciais para acessar o sistema
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="usuario" className="text-[#4a3629] text-sm sm:text-base">Usuário</Label>
                  <Input
                    id="usuario"
                    type="text"
                    placeholder="Digite seu usuário"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-[#4a3629] text-sm sm:text-base">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 text-sm sm:text-base"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30 transition-all duration-300 text-sm sm:text-base"
                >
                  {isLoading ? 'Entrando...' : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </>
                  )}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMostrarRecuperacao(true)}
                    disabled={isLoading}
                    className="text-xs sm:text-sm text-[#4a3629] hover:text-[#2d1f16] hover:underline transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                {/* Exemplos de Credenciais */}
                <div className="pt-4 border-t border-[#d4c4b0]">
                  <p className="text-xs sm:text-sm text-[#6b5544] text-center">
                    <strong className="text-[#4a3629]">Exemplos de credenciais:</strong>
                    <br />
                    <span className="text-xs">
                      Administradora: <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded text-xs">administradora</code> / <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded text-xs">adv123</code>
                    </span>
                    <br />
                    <span className="text-xs">
                      Advogado: <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded text-xs">carlos.silva</code> / <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded text-xs">adv456</code>
                    </span>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de Recuperação */}
      <Dialog open={mostrarRecuperacao} onOpenChange={setMostrarRecuperacao}>
        <DialogContent className="bg-white border-2 border-[#d4c4b0] sm:max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16] flex items-center gap-2 text-lg sm:text-xl">
              <KeyRound className="w-5 h-5 text-[#a16535]" />
              Recuperar Senha
            </DialogTitle>
            <DialogDescription className="text-[#6b5544] text-sm sm:text-base">
              {etapaRecuperacao === 'email' && 'Digite seu email para receber o código de verificação'}
              {etapaRecuperacao === 'codigo' && 'Digite o código enviado para seu email'}
              {etapaRecuperacao === 'nova-senha' && 'Cadastre sua nova senha'}
            </DialogDescription>
          </DialogHeader>

          {etapaRecuperacao === 'email' && (
            <form onSubmit={handleEnviarEmail} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email-recuperacao" className="text-[#4a3629] text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b5544]" />
                  <Input
                    id="email-recuperacao"
                    type="email"
                    placeholder="seu@email.com"
                    value={emailRecuperacao}
                    onChange={(e) => setEmailRecuperacao(e.target.value)}
                    required
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 text-sm"
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
                  className="flex-1 border-[#d4c4b0] text-[#4a3629] hover:bg-[#f6f3ee] text-sm"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#a16535] hover:bg-[#8b5329] text-white text-sm"
                >
                  Enviar Código
                </Button>
              </div>
            </form>
          )}

          {etapaRecuperacao === 'codigo' && (
            <form onSubmit={handleVerificarCodigo} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="codigo-verificacao" className="text-[#4a3629] text-sm">
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
                  className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 text-center tracking-widest text-sm"
                />
                <p className="text-xs text-[#6b5544] text-center">
                  Código de teste: <code className="text-[#a16535] bg-[#f6f3ee] px-2 py-1 rounded text-xs">123456</code>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEtapaRecuperacao('email')}
                  className="flex-1 border-[#d4c4b0] text-[#4a3629] hover:bg-[#f6f3ee] text-sm"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#a16535] hover:bg-[#8b5329] text-white text-sm"
                >
                  Verificar Código
                </Button>
              </div>
            </form>
          )}

          {etapaRecuperacao === 'nova-senha' && (
            <form onSubmit={handleRedefinirSenha} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="nova-senha" className="text-[#4a3629] text-sm">Nova Senha</Label>
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
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmar-senha" className="text-[#4a3629] text-sm">Confirmar Nova Senha</Label>
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
                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 text-sm"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#a16535] hover:bg-[#8b5329] text-white text-sm"
              >
                Redefinir Senha
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer fixo na base */}
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-[#6b5544]">© 2026 Sistema de Gestão Jurídica</p>
      </footer>
    </div>
  );
}