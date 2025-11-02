import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { AppView } from '@/types/navigation';

type NavigateFunc = (view: AppView) => void;

interface TermsOfUseProps {
  onNavigate: NavigateFunc;
}

export function TermsOfUse({ onNavigate }: TermsOfUseProps) {
  return (
    <div className="max-w-2xl sm:max-w-7xl mx-auto mt-10 px-4 sm:px-0">
      {/* Botão "Página Inicial" FORA DO CARD – RESPONSIVO */}
      <div className="flex justify-end mb-6">
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200 rounded-md px-4 py-2 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Página Inicial
          </Button>
        </div>
      </div>

      {/* Card Principal */}
      <div className="p-5 sm:p-6 md:p-8 bg-white rounded-lg shadow-md border border-[#d4c4b0]">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#2d1f16] flex items-center gap-2">
            <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-[#a16535] flex-shrink-0" />
            Termos de Uso
          </h2>
          <p className="text-sm sm:text-base text-[#6b5544] mt-1">
            Regras e condições de uso do sistema
          </p>
        </div>

        {/* Título Principal */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2d1f16] mb-2">
          Termos de Uso - JURIS FÁCIL
        </h1>
        <p className="text-sm sm:text-base text-[#6b5544] mb-6">
          Ao acessar e utilizar o aplicativo <strong>JURIS FÁCIL</strong>, o usuário declara estar de acordo com os Termos de Uso aqui descritos:
        </p>

        {/* Lista de Termos */}
        <ul className="list-disc pl-5 sm:pl-6 space-y-3 text-gray-700 text-sm sm:text-base">
          <li>O <strong>cadastro é obrigatório</strong> e o usuário é responsável pela veracidade das informações fornecidas.</li>
          <li>O <strong>login e senha são pessoais e intransferíveis</strong>. O usuário deve manter a confidencialidade desses dados.</li>
          <li>É <strong>proibido utilizar o app para atividades ilícitas</strong>, inserir informações de terceiros sem consentimento ou comprometer a integridade e segurança do aplicativo.</li>
          <li>O usuário responde por <strong>danos causados pelo uso indevido</strong>, sendo passível de responsabilização civil e criminal.</li>
          <li>O <strong>JURIS FÁCIL não se responsabiliza</strong> por instabilidades técnicas, danos em dispositivos ou infecções por software malicioso.</li>
        </ul>

        {/* Suporte + e-mail: TUDO NA MESMA LINHA */}
        <p className="mt-6 text-xs sm:text-sm text-[#6b5544]">
          Dúvidas? Use o{' '}
          <button
            type="button"
            onClick={() => onNavigate('suporte')}
            className="text-[#a16535] hover:underline font-medium focus:outline-none"
          >
            suporte disponível
          </button>{' '}
          ou envie um e-mail para:{' '}
          <a
            href="mailto:suporte@jurisfacil.com.br"
            className="text-[#a16535] hover:underline font-medium"
          >
            suporte@jurisfacil.com.br
          </a>
        </p>
      </div>
    </div>
  );
}
