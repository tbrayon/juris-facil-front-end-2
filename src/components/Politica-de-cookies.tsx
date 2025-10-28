// src/components/Politica-de-cookies.tsx
import React from 'react';

export function PoliticaDeCookies() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-md border border-[#d4c4b0] mt-10 prose prose-stone">
      <h1 className="text-3xl font-semibold text-[#2d1f16] mb-6">Política de Cookies - JURIS FÁCIL</h1>
      
      <p className="text-sm text-[#6b5544] mb-4">Última atualização: [Inserir Data]</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">1. O que são Cookies?</h2>
      <p>Cookies são pequenos arquivos de texto que os sites armazenam no seu computador ou dispositivo móvel quando você os visita. Eles são amplamente utilizados para fazer os sites funcionarem, ou funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do site.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">2. Como Usamos Cookies</h2>
      <p>Utilizamos cookies para os seguintes propósitos no JURIS FÁCIL:</p>
      <ul className="list-disc list-inside ml-4">
        <li>
          <strong>Cookies Estritamente Necessários:</strong> Essenciais para permitir que você navegue pelo site e use seus recursos, como acessar áreas seguras. Sem esses cookies, serviços como o login não podem ser fornecidos.
          <br /><em>Exemplo: Manter sua sessão ativa enquanto você navega no sistema.</em>
        </li>
        <li>
          <strong>Cookies Funcionais:</strong> Permitem que o site se lembre das escolhas que você faz (como nome de usuário, idioma ou região) e forneça recursos aprimorados e mais pessoais.
          <br /><em>Exemplo: Lembrar suas preferências de visualização (se aplicável).</em>
        </li>
        <li>
          <strong>Cookies de Desempenho/Analíticos:</strong> Coletam informações sobre como os visitantes usam nosso site (ex: quais páginas são mais visitadas, se recebem mensagens de erro). Essas informações são agregadas e anônimas e usadas apenas para melhorar o funcionamento do site. **[Se você usar Analytics, mencione aqui e que o consentimento pode ser necessário].**
          <br /><em>Exemplo: Uso do Google Analytics para entender padrões de uso.</em>
        </li>
         {/* Adicionar Cookies de Publicidade apenas SE REALMENTE USAR
         <li>
           <strong>Cookies de Publicidade/Marketing:</strong> Usados para direcionar publicidade mais relevante para você e seus interesses. [Seja específico sobre o uso, se houver].
         </li>
         */}
      </ul>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">3. Cookies Específicos Utilizados</h2>
      <p className="font-semibold text-red-700">**IMPORTANTE:** Você DEVE listar aqui os cookies específicos que seu site realmente utiliza, suas finalidades e durações. Use as ferramentas de desenvolvedor do seu navegador para inspecionar os cookies.</p>
      <ul className="list-disc list-inside ml-4">
          <li><strong>[Nome do Cookie de Sessão, ex: `session_id`]</strong>: (Necessário) Usado para identificar e manter sua sessão de usuário ativa após o login. Geralmente expira quando o navegador é fechado.</li>
          <li><strong>[Nome do Cookie CSRF, ex: `csrf_token`]</strong>: (Necessário) Usado para proteção contra ataques Cross-Site Request Forgery. Geralmente é um cookie de sessão.</li>
          <li><strong>[Nome do Cookie de Preferência, ex: `user_prefs`]</strong>: (Funcional, se usado) Armazena preferências do usuário, como tema ou idioma. Duração: [ex: 1 ano].</li>
          <li><strong>[Cookies do Google Analytics, ex: `_ga`, `_gid`, `_gat`]</strong>: (Desempenho, se usado) Usados para coletar informações estatísticas anônimas sobre o uso do site. Duração: Variável (consulte a documentação do Google Analytics).</li>
          {/* Liste TODOS os outros cookies */}
      </ul>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">4. Gerenciando Cookies</h2>
      <p>Você pode controlar e/ou excluir cookies como desejar. A maioria dos navegadores permite que você gerencie suas preferências de cookies através das configurações.</p>
      <ul className="list-disc list-inside ml-4">
        <li>Google Chrome: [Link para instruções]</li>
        <li>Mozilla Firefox: [Link para instruções]</li>
        <li>Microsoft Edge: [Link para instruções]</li>
        <li>Safari: [Link para instruções]</li>
        {/* Adicionar links relevantes para as páginas de ajuda dos navegadores */}
      </ul>
      <p>Observe que, se você bloquear ou excluir cookies estritamente necessários, talvez não consiga acessar ou usar todas as funcionalidades do JURIS FÁCIL.</p>
      {/* Se você usa um banner de consentimento, mencione-o aqui e como alterar as preferências */}

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">5. Alterações nesta Política</h2>
      <p>Podemos atualizar nossa Política de Cookies periodicamente. Notificaremos sobre quaisquer alterações publicando a nova política nesta página.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">6. Contato</h2>
      <p>Se você tiver alguma dúvida sobre nossa Política de Cookies, entre em contato conosco: <a href="mailto:[Seu Email de Contato]" className="text-[#a16535] hover:underline">[Seu Email de Contato]</a>.</p>
    </div>
  );
}