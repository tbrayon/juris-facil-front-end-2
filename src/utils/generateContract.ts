import { Client } from '@/contexts/ClientsContext';
import { formatDateBR, getLocalDateString } from './formatters';
import { ContractInput } from '@/contexts/ContractsContext';
import { Process } from '@/contexts/ProcessesContext';

export const generateContractTemplate = (process: Process,  contract: ContractInput, client: Client) => {
  const today = formatDateBR(getLocalDateString());
  const proceduralHub = process.proceduralHub === 'autor' ? 'AUTOR/REQUERENTE' : process.proceduralHub === 'reu' ? 'RÉU/REQUERIDO' : 'TERCEIRO INTERESSADO';
  const processInfo = process.processNumber
    ? `Processo nº: ${process.processNumber}`
    : '(Processo ainda não ajuizado - a ser distribuído)';

  return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: ${client.name.toUpperCase()}
${`${client.type}: ${client.document}`}

Endereço: ${client.address?.street}, ${client.address?.number}${client.address?.complement ? ', ' + client.address.complement : ''} - ${client.address?.neighborhood}
${client.address?.city} - ${client.address?.state}, CEP: ${client.address?.zipCode}
Email: ${client.email || 'Não informado'}
Telefone: ${client.phones && client.phones.length > 0 ? client.phones.join(' / ') : 'Não informado'}

CONTRATADA: ANNA LAURA ROCHA GOMES - ADVOCACIA E CONSULTORIA
Endereço: [ENDEREÇO DO ESCRITÓRIO]
OAB: [NÚMERO OAB]
Email: [EMAIL DO ESCRITÓRIO]
Telefone: [TELEFONE DO ESCRITÓRIO]

Pelo presente instrumento particular, as partes acima qualificadas têm entre si, justo e contratado, o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO
A CONTRATADA, por meio da advogada responsável ${process.responsibleAttorney || '[ADVOGADO RESPONSÁVEL]'}, obriga-se a prestar serviços profissionais de advocacia ao CONTRATANTE, consistindo em:

${processInfo}
Tipo de Ação: ${process.actionType || '[TIPO DE AÇÃO]'}
Tribunal/Vara: ${process.court?.name || '[TRIBUNAL]'} - ${process.branch || '[VARA]'}
Comarca: ${process.district || '[COMARCA]'}
Polo Processual: ${proceduralHub}
Parte Contrária: ${process.opposingParty || '[PARTE CONTRÁRIA]'}
Valor da Causa: ${process.claimValue || '[VALOR DA CAUSA]'}

Objeto da Ação: ${process.actionObject || '[DESCREVER OBJETO DA AÇÃO]'}

CLÁUSULA SEGUNDA - DOS HONORÁRIOS CONTRATUAIS
Pelos serviços prestados, o CONTRATANTE pagará à CONTRATADA, a título de honorários advocatícios contratuais, o valor total de ${contract.sucumbencyFees} (${contract.contractPercentage} do valor da causa), a ser pago da seguinte forma:

Valor do Contrato: ${contract.contractValue}
Forma de Pagamento: ${contract.paymentMethod}
${contract.installmentsNumber ? `Número de Parcelas: ${contract.installmentsNumber}` : ''}
${contract.dueDate ? `Vencimento: ${contract.dueDate}` : ''}

CLÁUSULA TERCEIRA - DOS HONORÁRIOS DE SUCUMBÊNCIA
Em caso de êxito na demanda, os honorários de sucumbência, arbitrados pelo juízo, no montante estimado de ${contract.attorneyFees}, serão devidos integralmente à CONTRATADA, não se confundindo com os honorários contratuais.

CLÁUSULA QUARTA - DAS DESPESAS PROCESSUAIS
Todas as despesas processuais necessárias ao regular andamento do process, tais como custas judiciais, emolumentos, certidões, publicações, perícias, autenticações e outras que se fizerem necessárias, serão de responsabilidade do CONTRATANTE, estimadas em ${contract.amountToReceive}.

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATADA
A CONTRATADA obriga-se a:
a) Prestar os serviços advocatícios com zelo, diligência e dentro dos padrões técnicos e éticos da profissão;
b) Manter o CONTRATANTE informado sobre o andamento do process;
c) Comparecer às audiências e praticar todos os atos processuais necessários;
d) Guardar sigilo sobre todas as informações obtidas em razão da prestação dos serviços.

CLÁUSULA SEXTA - DAS OBRIGAÇÕES DO CONTRATANTE
O CONTRATANTE obriga-se a:
a) Fornecer todas as informações e documentos necessários à prestação dos serviços;
b) Efetuar o pagamento dos honorários nas datas estabelecidas;
c) Reembolsar as despesas processuais antecipadas pela CONTRATADA;
d) Informar imediatamente qualquer mudança de endereço ou telefone.

CLÁUSULA SÉTIMA - DA PROTEÇÃO DE DADOS PESSOAIS (LGPD)
Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), o CONTRATANTE autoriza expressamente a CONTRATADA a coletar, armazenar, tratar e utilizar seus dados pessoais, bem como dos documentos fornecidos, exclusivamente para as finalidades relacionadas à prestação dos serviços advocatícios objeto deste contrato, incluindo:
a) Elaboração e ajuizamento de petições e demais atos processuais;
b) Representação em audiências e atos judiciais/extrajudiciais;
c) Comunicação sobre o andamento processual;
d) Cumprimento de obrigações legais e regulatórias.

A CONTRATADA compromete-se a:
- Implementar medidas de segurança técnicas e administrativas aptas a proteger os dados pessoais contra acessos não autorizados e situações acidentais ou ilícitas;
- Utilizar os dados pessoais exclusivamente para as finalidades autorizadas neste contrato;
- Manter sigilo absoluto sobre todas as informações e dados pessoais do CONTRATANTE;
- Excluir os dados pessoais após o término da finalidade para a qual foram coletados, respeitados os prazos legais de guarda de documentos.

O CONTRATANTE poderá, a qualquer momento, exercer seus direitos de acesso, retificação, eliminação e portabilidade de dados, mediante solicitação por escrito à CONTRATADA.

CLÁUSULA OITAVA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação prévia por escrito, com antecedência mínima de 30 (trinta) dias, devendo os honorários serem pagos proporcionalmente aos serviços já prestados.

CLÁUSULA NONA - DO FORO
Fica eleito o Foro da Comarca de ${process.district} para dirimir quaisquer questões oriundas do presente contrato.

E, por estarem assim justos e contratados, assinam o presente instrumento em 02 (duas) vias de igual teor e forma.

${client.address?.city}, ${today}.

CONTRATANTE
${client.name}
${`${client.type}: ${client.document}`}

CONTRATADA
Anna Laura Rocha Gomes
OAB: [NÚMERO OAB]

TESTEMUNHAS

1. Nome:
CPF:

2. Nome:
CPF:
`;};