import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, LogIn, Scale, } from 'lucide-react';
import { toast } from 'sonner';

import { AppView } from '../types/navigation';
import { useUsers } from '../contexts/UsersContext';
import { useQueryClient } from '@tanstack/react-query';

interface LoginProps {
  onNavigate: (view: AppView) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { authenticateMutation } = useUsers();

  const { isPending, mutate } = authenticateMutation;

  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          console.log("mutation ", data);
          queryClient.invalidateQueries({ queryKey: ['currentUser'] });

          onNavigate("home");
        },
        onError: (err) => {
          console.log(err)
          toast.error("Credenciais inválidas. Por favor, tente novamente!")
        }
      }
    );
  };


  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f6f3ee] relative pb-16">
      {/* Container principal */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            onClick={() => onNavigate("welcome")}
            className="mb-6 text-[#4a3629] hover:text-[#2d1f16] hover:bg-[#d4c4b0]/30 text-sm sm:text-base"
            disabled={isPending}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isPending}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-[#4a3629] text-sm sm:text-base">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isPending}
                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 text-sm sm:text-base"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30 transition-all duration-300 text-sm sm:text-base"
                >
                  {isPending ? 'Entrando...' : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </>
                  )}
                </Button>

                {/* Exemplos de Credenciais */}
                <div className="pt-4 border-t border-[#d4c4b0]">
                  <p className="text-xs sm:text-sm text-[#6b5544] text-center">
                    <strong className="text-[#4a3629]">Exemplos de credenciais:</strong>
                    <br />
                    <span className="text-xs">
                      Administrador: <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded text-xs">admin@juris.com.br</code> / <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded text-xs">juris.admin</code>
                    </span>
                    <br />
                    <span className="text-xs">
                      Advogado: <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded text-xs">advogado@juris.com.br</code> / <code className="text-[#a16535] bg-[#f6f3ee] px-1 py-0.5 rounded text-xs">juris.advogado</code>
                    </span>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>


      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-[#6b5544]">© 2026 Sistema de Gestão Jurídica</p>
      </footer>
    </div>
  );
}
