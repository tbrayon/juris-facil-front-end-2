import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { AppView } from '@/types/navigation';

type NavigateFunc = (view: AppView) => void;

interface PrivacyPolicyProps {
  onNavigate: NavigateFunc;
}

export function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
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
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-[#a16535] flex-shrink-0" />
            Política de Privacidade
          </h2>
          <p className="text-sm sm:text-base text-[#6b5544] mt-1">
            Proteção e uso responsável dos seus dados no JURIS FÁCIL
          </p>
        </div>

        {/* Título Principal */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2d1f16] mb-2">
          Política de Privacidade - JURIS FÁCIL
        </h1>
        <p className="text-sm sm:text-base text-[#6b5544] mb-6">
          Última atualização: <strong>30 de outubro de 2025</strong>
        </p>

        {/* Conteúdo */}
        <div className="space-y-6 text-gray-700 text-sm sm:text-base">
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">1. Introdução</h3>
            <p>
              Esta Política de Privacidade descreve como o <strong>JURIS FÁCIL</strong> coleta, usa, armazena e protege suas informações pessoais ao utilizar nosso sistema de gestão jurídica.
            </p>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">2. Dados que Coletamos</h3>
            <p>Coletamos os seguintes tipos de dados:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 text-sm sm:text-base">
              <li>
                <strong>Dados de Cadastro:</strong> Nome, e-mail, CPF/CNPJ, OAB (quando aplicável), telefone e dados da empresa/escritório.
              </li>
              <li>
                <strong>Dados de Uso:</strong> Informações sobre como você utiliza o sistema (páginas visitadas, ações realizadas, tempo de sessão).
              </li>
              <li>
                <strong>Dados de Processos:</strong> Informações inseridas por você (número do processo, partes, documentos, prazos, etc.).
              </li>
              <li>
                <strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador, dispositivo, sistema operacional.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">3. Finalidade do Uso dos Dados</h3>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 text-sm sm:text-base">
              <li>Fornecer e manter o funcionamento do sistema JURIS FÁCIL.</li>
              <li>Autenticar usuários e gerenciar acessos.</li>
              <li>Enviar notificações importantes (prazos, atualizações, alertas).</li>
              <li>Melhorar a experiência do usuário com base em análises de uso.</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">4. Compartilhamento de Dados</h3>
            <p>
              Não vendemos nem alugamos seus dados. Eles podem ser compartilhados apenas com:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 text-sm sm:text-base">
              <li>Provedores de serviços técnicos (hospedagem, backup, análise).</li>
              <li>Autoridades judiciais ou administrativas, quando exigido por lei.</li>
              <li>Equipe interna com acesso restrito e sob sigilo.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">5. Segurança dos Dados</h3>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 text-sm sm:text-base">
              <li>Criptografia de dados em trânsito (HTTPS) e em repouso.</li>
              <li>Controle de acesso por autenticação multifator (quando disponível).</li>
              <li>Backups regulares e criptografados.</li>
              <li>Auditorias periódicas de segurança.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">6. Seus Direitos (LGPD)</h3>
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 text-sm sm:text-base">
              <li>Acessar, corrigir ou excluir seus dados pessoais.</li>
              <li>Solicitar a portabilidade dos dados.</li>
              <li>Revogar consentimento quando aplicável.</li>
              <li>Apresentar reclamação à ANPD (Autoridade Nacional de Proteção de Dados).</li>
            </ul>
            <p className="mt-3 text-xs sm:text-sm">
              Para exercer esses direitos, entre em contato pelo e-mail abaixo.
            </p>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">7. Retenção de Dados</h3>
            <p>
              Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades descritas ou conforme exigido por lei. Dados de processos são mantidos enquanto sua conta estiver ativa ou conforme obrigações legais (ex: 5 anos para documentos fiscais).
            </p>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">8. Alterações nesta Política</h3>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos mudanças significativas por e-mail ou no sistema.
            </p>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">9. Contato</h3>
            <p className="text-xs sm:text-sm text-[#6b5544]">
              Dúvidas sobre privacidade? Use o{' '}
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
          </section>
        </div>
      </div>
    </div>
  );
}
