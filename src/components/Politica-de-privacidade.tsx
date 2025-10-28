// src/components/Politica-de-privacidade.tsx
import React from 'react';

export function PoliticaDePrivacidade() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-md border border-[#d4c4b0] mt-10 prose prose-stone">
      <h1 className="text-3xl font-semibold text-[#2d1f16] mb-6">Política de Privacidade - JURIS FÁCIL</h1>
      
      <p className="text-sm text-[#6b5544] mb-4">Última atualização: [Inserir Data]</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">1. Introdução</h2>
      <p>Esta Política de Privacidade descreve como [Nome da Empresa/Seu Nome] ("nós", "nosso") coleta, usa e protege suas informações pessoais quando você utiliza o JURIS FÁCIL ("Serviço"). Levamos sua privacidade a sério.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">2. Informações que Coletamos</h2>
      <p>Podemos coletar os seguintes tipos de informações:</p>
      <ul className="list-disc list-inside ml-4">
        <li>**Informações Pessoais:** Nome, endereço de e-mail, informações de contato, dados de pagamento (se aplicável), e outras informações que você fornece ao se registrar ou usar o serviço.</li>
        <li>**Dados Inseridos no Sistema:** Informações sobre clientes, processos, prazos, contratos e outros dados que você insere e gerencia através do JURIS FÁCIL. **Reconhecemos a natureza potencialmente sensível destes dados.**</li>
        <li>**Informações de Uso:** Como você interage com o Serviço, páginas visitadas, tempo gasto, endereço IP, tipo de navegador, sistema operacional.</li>
        <li>**Cookies:** Veja nossa <a href="/politica-de-cookies" className="text-[#a16535] hover:underline">Política de Cookies</a> para mais detalhes.</li>
      </ul>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">3. Como Usamos Suas Informações</h2>
      <p>Utilizamos as informações coletadas para:</p>
      <ul className="list-disc list-inside ml-4">
        <li>Fornecer, operar e manter o Serviço.</li>
        <li>Melhorar, personalizar e expandir o Serviço.</li>
        <li>Entender e analisar como você usa o Serviço.</li>
        <li>Comunicar com você (suporte, atualizações, informações).</li>
        <li>Processar transações (se aplicável).</li>
        <li>Prevenir fraudes e garantir a segurança.</li>
        <li>Cumprir obrigações legais.</li>
      </ul>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">4. Compartilhamento de Informações</h2>
      <p>Não compartilhamos suas informações pessoais com terceiros, exceto nas seguintes circunstâncias:</p>
      <ul className="list-disc list-inside ml-4">
        <li>Com seu consentimento.</li>
        <li>Com provedores de serviços que nos auxiliam a operar o Serviço (ex: hospedagem em nuvem, processamento de pagamentos), sob acordos de confidencialidade.</li>
        <li>Para cumprir obrigações legais ou proteger nossos direitos.</li>
        <li>Em caso de fusão, aquisição ou venda de ativos.</li>
        {/* Seja específico sobre quaisquer compartilhamentos essenciais */}
      </ul>
      <p><strong>Nós NUNCA venderemos seus dados pessoais ou os dados inseridos no sistema.</strong></p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">5. Segurança dos Dados</h2>
      <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro.</p>
      {/* Detalhar mais as medidas, se possível (criptografia, controles de acesso etc.) */}

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">6. Seus Direitos de Privacidade</h2>
      <p>Dependendo da sua localização, você pode ter direitos como acessar, corrigir, excluir ou restringir o processamento de suas informações pessoais. Entre em contato para exercer seus direitos.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">7. Retenção de Dados</h2>
      <p>Reteremos suas informações apenas pelo tempo necessário para os fins descritos nesta política ou conforme exigido por lei.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">8. Alterações nesta Política</h2>
      <p>Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos sobre quaisquer alterações publicando a nova política nesta página.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">9. Contato</h2>
      <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco: <a href="mailto:[Seu Email de Contato]" className="text-[#a16535] hover:underline">[Seu Email de Contato]</a>.</p>
    </div>
  );
}