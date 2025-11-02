import { Cookie, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { AppView } from '@/types/navigation';

type NavigateFunc = (view: AppView) => void;

interface CookiesPolicyProps {
  onNavigate: NavigateFunc;
}

export function CookiesPolicy({ onNavigate }: CookiesPolicyProps) {
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
            <Cookie className="w-6 h-6 sm:w-7 sm:h-7 text-[#a16535] flex-shrink-0" />
            Política de Cookies
          </h2>
          <p className="text-sm sm:text-base text-[#6b5544] mt-1">
            Como usamos cookies no JURIS FÁCIL
          </p>
        </div>

        {/* Título Principal */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2d1f16] mb-2">
          Política de Cookies - JURIS FÁCIL
        </h1>
        <p className="text-sm sm:text-base text-[#6b5544] mb-6">
          Última atualização: <strong>30 de outubro de 2025</strong>
        </p>

        {/* Conteúdo */}
        <div className="space-y-6 text-gray-700 text-sm sm:text-base">
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">1. O que são Cookies?</h3>
            <p>
              Cookies são pequenos arquivos de texto que os sites armazenam no seu computador ou dispositivo móvel quando você os visita. Eles são amplamente utilizados para fazer os sites funcionarem, ou funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do site.
            </p>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">2. Como Usamos Cookies</h3>
            <p>Utilizamos cookies para os seguintes propósitos no JURIS FÁCIL:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 text-sm sm:text-base">
              <li>
                <strong>Cookies Estritamente Necessários:</strong> Essenciais para permitir que você navegue pelo site e use seus recursos, como acessar áreas seguras. Sem esses cookies, serviços como o login não podem ser fornecidos.
                <br />
                <em className="text-xs sm:text-sm text-[#6b5544]">Exemplo: Manter sua sessão ativa enquanto você navega no sistema.</em>
              </li>
              <li>
                <strong>Cookies Funcionais:</strong> Permitem que o site se lembre das escolhas que você faz (como nome de usuário, idioma ou região) e forneça recursos aprimorados e mais pessoais.
                <br />
                <em className="text-xs sm:text-sm text-[#6b5544]">Exemplo: Lembrar suas preferências de visualização (se aplicável).</em>
              </li>
              <li>
                <strong>Cookies de Desempenho/Analíticos:</strong> Coletam informações sobre como os visitantes usam nosso site (ex: quais páginas são mais visitadas, se recebem mensagens de erro). Essas informações são agregadas e anônimas e usadas apenas para melhorar o funcionamento do site.
                <br />
                <em className="text-xs sm:text-sm text-[#6b5544]">Exemplo: Uso do Google Analytics para entender padrões de uso.</em>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">3. Cookies Específicos Utilizados</h3>
            <p className="text-xs sm:text-sm text-red-700 font-medium mb-2">
              IMPORTANTE: Liste abaixo apenas os cookies que seu sistema realmente utiliza.
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-xs sm:text-sm">
              <li><strong><code>session_id</code></strong>: (Necessário) Identifica e mantém sua sessão ativa após o login. Expira ao fechar o navegador.</li>
              <li><strong><code>csrf_token</code></strong>: (Necessário) Protege contra ataques Cross-Site Request Forgery. Cookie de sessão.</li>
              <li><strong><code>user_prefs</code></strong>: (Funcional) Armazena preferências como tema ou idioma. Duração: 1 ano.</li>
              <li><strong><code>_ga</code>, <code>_gid</code>, <code>_gat</code></strong>: (Google Analytics) Estatísticas anônimas de uso. Consulte a documentação do Google.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">4. Gerenciando Cookies</h3>
            <p>
              Você pode controlar e/ou excluir cookies como desejar. A maioria dos navegadores permite que você gerencie suas preferências de cookies através das configurações:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1 mt-2 text-xs sm:text-sm">
              <li>Google Chrome: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#a16535] hover:underline">Instruções</a></li>
              <li>Mozilla Firefox: <a href="https://support.mozilla.org/pt-BR/kb/limpe-cookies-e-dados-de-sites-no-firefox" target="_blank" rel="noopener noreferrer" className="text-[#a16535] hover:underline">Instruções</a></li>
              <li>Microsoft Edge: <a href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#a16535] hover:underline">Instruções</a></li>
              <li>Safari: <a href="https://support.apple.com/pt-br/HT201265" target="_blank" rel="noopener noreferrer" className="text-[#a16535] hover:underline">Instruções</a></li>
            </ul>
            <p className="mt-3 text-xs sm:text-sm">
              <strong>Atenção:</strong> Bloquear cookies necessários pode impedir o acesso a funcionalidades essenciais do JURIS FÁCIL.
            </p>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">5. Alterações nesta Política</h3>
            <p className="text-xs sm:text-base">
              Podemos atualizar nossa Política de Cookies periodicamente. Notificaremos sobre alterações significativas publicando a nova versão nesta página.
            </p>
          </section>

          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-[#a16535] mb-2">6. Contato</h3>
            <p className="text-xs sm:text-sm text-[#6b5544]">
              Dúvidas sobre cookies? Use o{' '}
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
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
