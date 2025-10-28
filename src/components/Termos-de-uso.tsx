// src/components/Termos-de-uso.tsx
import React from 'react';

export function TermosDeUso() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-md border border-[#d4c4b0] mt-10 prose prose-stone">
      <h1 className="text-3xl font-semibold text-[#2d1f16] mb-6">Termos de Uso - JURIS FÁCIL</h1>
      
      <p className="text-sm text-[#6b5544] mb-4">Última atualização: [Inserir Data]</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">1. Aceitação dos Termos</h2>
      <p>Ao acessar e usar o sistema JURIS FÁCIL ("Serviço"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com estes termos, não utilize o Serviço.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">2. Descrição do Serviço</h2>
      <p>JURIS FÁCIL é um sistema de gestão jurídica projetado para auxiliar [Descrever brevemente o público e a finalidade principal, ex: advogados e escritórios na organização de processos, clientes e prazos].</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">3. Contas de Usuário</h2>
      <p>Para acessar certas funcionalidades, você pode precisar criar uma conta. Você é responsável por manter a confidencialidade de sua senha e conta, e por todas as atividades que ocorram sob sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">4. Uso Aceitável</h2>
      <p>Você concorda em usar o Serviço apenas para fins legais e de acordo com estes Termos. Você não deve usar o Serviço de forma que possa danificar, desabilitar, sobrecarregar ou prejudicar o sistema.</p>
      {/* Adicionar outros pontos relevantes sobre responsabilidades do usuário, ex: precisão dos dados inseridos */}

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">5. Propriedade Intelectual</h2>
      <p>O Serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva de [Nome da Empresa/Seu Nome] e seus licenciadores.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">6. Isenção de Garantias</h2>
      <p>O Serviço é fornecido "COMO ESTÁ" e "CONFORME DISPONÍVEL". Não garantimos que o serviço será ininterrupto, seguro ou livre de erros.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">7. Limitação de Responsabilidade</h2>
      <p>Em nenhuma circunstância [Nome da Empresa/Seu Nome] será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso do Serviço.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">8. Modificações nos Termos</h2>
      <p>Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos sobre quaisquer alterações publicando os novos Termos no site. É sua responsabilidade revisar periodicamente.</p>

      <h2 className="text-xl font-semibold text-[#a16535] mt-6 mb-3">9. Contato</h2>
      <p>Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em: <a href="mailto:[Seu Email de Contato]" className="text-[#a16535] hover:underline">[Seu Email de Contato]</a>.</p>
      
      {/* Adicionar cláusulas sobre rescisão, lei aplicável, etc., conforme necessário */}
    </div>
  );
}