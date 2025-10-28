import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLocalDateTimeString } from '../utils/formatters';

export interface Contrato {
  id: string;
  processoId: string;
  numeroProcesso: string;
  clienteNome: string;
  clienteDocumento: string;
  textoContrato: string;
  dataCriacao: string;
  dataEdicao?: string;
  arquivoAssinado?: {
    nome: string;
    url: string;
    dataUpload: string;
  };
}

interface ContratosContextType {
  contratos: Contrato[];
  adicionarContrato: (contrato: Omit<Contrato, 'id' | 'dataCriacao'>) => void;
  atualizarContrato: (id: string, contrato: Partial<Omit<Contrato, 'id' | 'dataCriacao'>>) => void;
  buscarContratoPorProcesso: (processoId: string) => Contrato | undefined;
  resetarDados: () => void;
}

const ContratosContext = createContext<ContratosContextType | undefined>(undefined);

const STORAGE_KEY = 'juris-facil-contratos';

const CONTRATOS_EXEMPLO: Contrato[] = [
  // Contrato 1 - Rafael Henrique Martins (CPF)
  {
    id: '1',
    processoId: '1',
    numeroProcesso: '1002345-67.2023.5.02.0038',
    clienteNome: 'Rafael Henrique Martins',
    clienteDocumento: '456.789.123-45',
    textoContrato: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: RAFAEL HENRIQUE MARTINS
CPF: 456.789.123-45
RG: 34.567.890-1
Endereço: Rua Augusta, 2840, Conjunto 1203 - Cerqueira César
São Paulo - SP, CEP: 01414-001
Email: rafael.martins@email.com
Telefone: (11) 99876-5432 / (11) 3789-4561

CONTRATADA: ANNA LAURA ROCHA GOMES - ADVOCACIA E CONSULTORIA
Endereço: [ENDEREÇO DO ESCRITÓRIO]
OAB: [NÚMERO OAB]
Email: contato@annalaura-adv.com.br
Telefone: [TELEFONE DO ESCRITÓRIO]

Pelo presente instrumento particular, as partes acima qualificadas têm entre si, justo e contratado, o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO
A CONTRATADA, por meio da advogada responsável Dra. Anna Laura Rocha Gomes, obriga-se a prestar serviços profissionais de advocacia ao CONTRATANTE, consistindo em:

Processo nº: 1002345-67.2023.5.02.0038
Tipo de Ação: Reclamação Trabalhista
Tribunal/Vara: TRT-2 - 38ª Vara do Trabalho
Comarca: São Paulo
Polo Processual: RÉU/REQUERIDO
Parte Contrária: Marcos Antônio Oliveira
Valor da Causa: R$ 120.500,00

Objeto da Ação: Defesa em reclamação trabalhista movida por ex-funcionário pleiteando verbas rescisórias, horas extras, adicional noturno e danos morais relacionados a alegado assédio moral no ambiente de trabalho.

CLÁUSULA SEGUNDA - DOS HONORÁRIOS CONTRATUAIS
Pelos serviços prestados, o CONTRATANTE pagará à CONTRATADA, a título de honorários advocatícios contratuais, o valor total de R$ 32.500,00, a ser pago da seguinte forma:

Valor do Contrato: R$ 32.500,00
Forma de Pagamento: PIX
Número de Parcelas: 5x
Vencimento: 10/01/2026

CLÁUSULA TERCEIRA - DOS HONORÁRIOS DE SUCUMBÊNCIA
Em caso de êxito na demanda, os honorários de sucumbência, arbitrados pelo juízo, no montante estimado de R$ 18.000,00, serão devidos integralmente à CONTRATADA, não se confundindo com os honorários contratuais.

CLÁUSULA QUARTA - DAS DESPESAS PROCESSUAIS
Todas as despesas processuais necessárias ao regular andamento do processo, tais como custas judiciais, perícias técnicas, autenticações e outras que se fizerem necessárias, serão de responsabilidade do CONTRATANTE, estimadas em R$ 3.200,00.

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATADA
A CONTRATADA obriga-se a:
a) Prestar os serviços advocatícios com zelo, diligência e dentro dos padrões técnicos e éticos da profissão;
b) Manter o CONTRATANTE informado sobre o andamento do processo;
c) Comparecer às audiências e praticar todos os atos processuais necessários;
d) Guardar sigilo sobre todas as informações obtidas em razão da prestação dos serviços.

CLÁUSULA SEXTA - DAS OBRIGAÇÕES DO CONTRATANTE
O CONTRATANTE obriga-se a:
a) Fornecer todas as informações e documentos necessários à prestação dos serviços;
b) Efetuar o pagamento dos honorários nas datas estabelecidas;
c) Reembolsar as despesas processuais antecipadas pela CONTRATADA;
d) Informar imediatamente qualquer mudança de endereço ou telefone.

CLÁUSULA SÉTIMA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação prévia por escrito, com antecedência mínima de 30 (trinta) dias, devendo os honorários serem pagos proporcionalmente aos serviços já prestados.

CLÁUSULA OITAVA - DO FORO
Fica eleito o Foro da Comarca de São Paulo para dirimir quaisquer questões oriundas do presente contrato.

E, por estarem assim justos e contratados, assinam o presente instrumento em 02 (duas) vias de igual teor e forma.

São Paulo, 12 de abril de 2023.


_______________________________              _______________________________
CONTRATANTE                                  CONTRATADA
Rafael Henrique Martins                      Anna Laura Rocha Gomes
CPF: 456.789.123-45                          OAB: [NÚMERO]


Testemunhas:

1. _______________________________
Nome: Patrícia Lima Santos
CPF: 234.567.890-12

2. _______________________________
Nome: Roberto Carlos Mendes
CPF: 345.678.901-23`,
    dataCriacao: '2023-04-12T09:30:00.000Z',
    dataEdicao: '2023-04-12T14:15:00.000Z',
    arquivoAssinado: {
      nome: 'contrato_assinado_rafael_martins.pdf',
      url: 'data:application/pdf;base64,exemplo',
      dataUpload: '2023-04-15T10:00:00.000Z',
    },
  },

  // Contrato 2 - Juliana Aparecida Ferreira (CPF)
  {
    id: '2',
    processoId: '2',
    numeroProcesso: '1003456-78.2024.8.26.0100',
    clienteNome: 'Juliana Aparecida Ferreira',
    clienteDocumento: '789.456.321-78',
    textoContrato: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: JULIANA APARECIDA FERREIRA
CPF: 789.456.321-78
RG: 56.789.012-3
Endereço: Rua dos Pinheiros, 1456, Sala 307 - Pinheiros
São Paulo - SP, CEP: 05424-000
Email: juliana.ferreira@email.com
Telefone: (11) 98234-5678 / (11) 2345-6789

CONTRATADA: ANNA LAURA ROCHA GOMES - ADVOCACIA E CONSULTORIA
Endereço: [ENDEREÇO DO ESCRITÓRIO]
OAB: [NÚMERO OAB]
Email: contato@annalaura-adv.com.br
Telefone: [TELEFONE DO ESCRITÓRIO]

Pelo presente instrumento particular, as partes acima qualificadas têm entre si, justo e contratado, o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO
A CONTRATADA, por meio da advogada responsável Dra. Anna Laura Rocha Gomes, obriga-se a prestar serviços profissionais de advocacia à CONTRATANTE, consistindo em:

Processo nº: 1003456-78.2024.8.26.0100
Tipo de Ação: Ação de Cobrança contra Plano de Saúde
Tribunal/Vara: TJ-SP - 8ª Vara Cível
Comarca: São Paulo
Polo Processual: AUTOR/REQUERENTE
Parte Contrária: MedCare Assistência Médica S.A.
Valor da Causa: R$ 85.200,00

Objeto da Ação: Cobrança de valores não reembolsados pelo plano de saúde referentes a procedimentos médicos de urgência e tratamento psicológico especializado negados irregularmente pela operadora.

CLÁUSULA SEGUNDA - DOS HONORÁRIOS CONTRATUAIS
Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA, a título de honorários advocatícios contratuais, o valor total de R$ 21.300,00 (25% do valor da causa), a ser pago da seguinte forma:

Valor do Contrato: R$ 21.300,00
Forma de Pagamento: PIX
Número de Parcelas: 4x
Vencimento: 28/02/2026

CLÁUSULA TERCEIRA - DOS HONORÁRIOS DE SUCUMBÊNCIA
Em caso de êxito na demanda, os honorários de sucumbência, arbitrados pelo juízo, no montante estimado de R$ 12.800,00, serão devidos integralmente à CONTRATADA, não se confundindo com os honorários contratuais.

CLÁUSULA QUARTA - DAS DESPESAS PROCESSUAIS
Todas as despesas processuais necessárias ao regular andamento do processo, tais como custas judiciais, perícias médicas, certidões e outras que se fizerem necessárias, serão de responsabilidade da CONTRATANTE, estimadas em R$ 2.500,00.

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATADA
A CONTRATADA obriga-se a:
a) Prestar os serviços advocatícios com zelo, diligência e dentro dos padrões técnicos e éticos da profissão;
b) Manter a CONTRATANTE informada sobre o andamento do processo;
c) Comparecer às audiências e praticar todos os atos processuais necessários;
d) Guardar sigilo sobre todas as informações obtidas em razão da prestação dos serviços.

CLÁUSULA SEXTA - DAS OBRIGAÇÕES DA CONTRATANTE
A CONTRATANTE obriga-se a:
a) Fornecer todas as informações e documentos necessários à prestação dos serviços;
b) Efetuar o pagamento dos honorários nas datas estabelecidas;
c) Reembolsar as despesas processuais antecipadas pela CONTRATADA;
d) Informar imediatamente qualquer mudança de endereço ou telefone.

CLÁUSULA SÉTIMA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação prévia por escrito, com antecedência mínima de 30 (trinta) dias, devendo os honorários serem pagos proporcionalmente aos serviços já prestados.

CLÁUSULA OITAVA - DO FORO
Fica eleito o Foro da Comarca de São Paulo para dirimir quaisquer questões oriundas do presente contrato.

E, por estarem assim justos e contratados, assinam o presente instrumento em 02 (duas) vias de igual teor e forma.

São Paulo, 28 de fevereiro de 2024.


_______________________________              _______________________________
CONTRATANTE                                  CONTRATADA
Juliana Aparecida Ferreira                   Anna Laura Rocha Gomes
CPF: 789.456.321-78                          OAB: [NÚMERO]


Testemunhas:

1. _______________________________
Nome: Fernanda Costa Alves
CPF: 456.789.012-34

2. _______________________________
Nome: Gabriel Rodrigues Silva
CPF: 567.890.123-45`,
    dataCriacao: '2024-02-28T11:00:00.000Z',
    dataEdicao: '2024-02-28T16:20:00.000Z',
    arquivoAssinado: {
      nome: 'contrato_assinado_juliana_ferreira.pdf',
      url: 'data:application/pdf;base64,exemplo2',
      dataUpload: '2024-03-05T09:30:00.000Z',
    },
  },

  // Contrato 3 - André Luiz Barbosa (CPF)
  {
    id: '3',
    processoId: '3',
    numeroProcesso: '1004567-89.2022.8.26.0100',
    clienteNome: 'André Luiz Barbosa',
    clienteDocumento: '321.654.987-90',
    textoContrato: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: ANDRÉ LUIZ BARBOSA
CPF: 321.654.987-90
RG: 78.901.234-5
Endereço: Avenida Corifeu de Azevedo Marques, 3890, Apartamento 152 - Butantã
São Paulo - SP, CEP: 05508-000
Email: andre.barbosa@email.com
Telefone: (11) 97654-3210 / (11) 4567-8901

CONTRATADA: ANNA LAURA ROCHA GOMES - ADVOCACIA E CONSULTORIA
Endereço: [ENDEREÇO DO ESCRITÓRIO]
OAB: [NÚMERO OAB]
Email: contato@annalaura-adv.com.br
Telefone: [TELEFONE DO ESCRITÓRIO]

Pelo presente instrumento particular, as partes acima qualificadas têm entre si, justo e contratado, o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO
A CONTRATADA, por meio da advogada responsável Dra. Anna Laura Rocha Gomes, obriga-se a prestar serviços profissionais de advocacia ao CONTRATANTE, consistindo em:

Processo nº: 1004567-89.2022.8.26.0100
Tipo de Ação: Revisão de Alimentos
Tribunal/Vara: TJ-SP - 3ª Vara de Família e Sucessões
Comarca: São Paulo
Polo Processual: AUTOR/REQUERENTE
Parte Contrária: Carolina Barbosa Mendes
Valor da Causa: R$ 45.000,00

Objeto da Ação: Revisão de pensão alimentícia em razão de mudança nas condições financeiras do alimentante, que teve redução significativa de renda após mudança de cargo na universidade.

CLÁUSULA SEGUNDA - DOS HONORÁRIOS CONTRATUAIS
Pelos serviços prestados, o CONTRATANTE pagará à CONTRATADA, a título de honorários advocatícios contratuais, o valor total de R$ 18.000,00, a ser pago da seguinte forma:

Valor do Contrato: R$ 18.000,00
Forma de Pagamento: Transferência Bancária
Número de Parcelas: 6x
Vencimento: 15/08/2026

CLÁUSULA TERCEIRA - DOS HONORÁRIOS DE SUCUMBÊNCIA
Em caso de êxito na demanda, os honorários de sucumbência, arbitrados pelo juízo, no montante estimado de R$ 9.000,00, serão devidos integralmente à CONTRATADA, não se confundindo com os honorários contratuais.

CLÁUSULA QUARTA - DAS DESPESAS PROCESSUAIS
Todas as despesas processuais necessárias ao regular andamento do processo, tais como custas judiciais, certidões e outras que se fizerem necessárias, serão de responsabilidade do CONTRATANTE, estimadas em R$ 1.200,00.

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATADA
A CONTRATADA obriga-se a:
a) Prestar os serviços advocatícios com zelo, diligência e dentro dos padrões técnicos e éticos da profissão;
b) Manter o CONTRATANTE informado sobre o andamento do processo;
c) Comparecer às audiências e praticar todos os atos processuais necessários;
d) Guardar sigilo sobre todas as informações obtidas em razão da prestação dos serviços.

CLÁUSULA SEXTA - DAS OBRIGAÇÕES DO CONTRATANTE
O CONTRATANTE obriga-se a:
a) Fornecer todas as informações e documentos necessários à prestação dos serviços;
b) Efetuar o pagamento dos honorários nas datas estabelecidas;
c) Reembolsar as despesas processuais antecipadas pela CONTRATADA;
d) Informar imediatamente qualquer mudança de endereço ou telefone.

CLÁUSULA SÉTIMA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação prévia por escrito, com antecedência mínima de 30 (trinta) dias, devendo os honorários serem pagos proporcionalmente aos serviços já prestados.

CLÁUSULA OITAVA - DO FORO
Fica eleito o Foro da Comarca de São Paulo para dirimir quaisquer questões oriundas do presente contrato.

E, por estarem assim justos e contratados, assinam o presente instrumento em 02 (duas) vias de igual teor e forma.

São Paulo, 15 de agosto de 2022.


_______________________________              _______________________________
CONTRATANTE                                  CONTRATADA
André Luiz Barbosa                           Anna Laura Rocha Gomes
CPF: 321.654.987-90                          OAB: [NÚMERO]


Testemunhas:

1. _______________________________
Nome: Lucas Eduardo Santos
CPF: 678.901.234-56

2. _______________________________
Nome: Marina Souza Oliveira
CPF: 789.012.345-67`,
    dataCriacao: '2022-08-15T10:45:00.000Z',
    dataEdicao: '2022-08-15T15:30:00.000Z',
    arquivoAssinado: {
      nome: 'contrato_assinado_andre_barbosa.pdf',
      url: 'data:application/pdf;base64,exemplo3',
      dataUpload: '2022-08-20T14:00:00.000Z',
    },
  },

  // Contrato 4 - Inovare Tecnologia e Sistemas Ltda (CNPJ)
  {
    id: '4',
    processoId: '4',
    numeroProcesso: '1005678-90.2024.5.02.0015',
    clienteNome: 'Inovare Tecnologia e Sistemas Ltda',
    clienteDocumento: '23.456.789/0001-12',
    textoContrato: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: INOVARE TECNOLOGIA E SISTEMAS LTDA
CNPJ: 23.456.789/0001-12
Nome Fantasia: Inovare Tech
Representante Legal: Fernanda Cristina Almeida
Endereço: Avenida Brigadeiro Luís Antônio, 2344, Andar 15 - Jardim Paulista
São Paulo - SP, CEP: 01451-000
Email: contato@inovaretech.com.br
Telefone: (11) 4123-5678 / (11) 99123-4567

CONTRATADA: ANNA LAURA ROCHA GOMES - ADVOCACIA E CONSULTORIA
Endereço: [ENDEREÇO DO ESCRITÓRIO]
OAB: [NÚMERO OAB]
Email: contato@annalaura-adv.com.br
Telefone: [TELEFONE DO ESCRITÓRIO]

Pelo presente instrumento particular, as partes acima qualificadas têm entre si, justo e contratado, o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO
A CONTRATADA, por meio da advogada responsável Dra. Anna Laura Rocha Gomes, obriga-se a prestar serviços profissionais de advocacia à CONTRATANTE, consistindo em:

Processo nº: 1005678-90.2024.5.02.0015
Tipo de Ação: Reclamação Trabalhista Coletiva
Tribunal/Vara: TRT-2 - 15ª Vara do Trabalho
Comarca: São Paulo
Polo Processual: RÉU/REQUERIDO
Parte Contrária: Sindicato dos Trabalhadores em TI de São Paulo
Valor da Causa: R$ 420.000,00

Objeto da Ação: Defesa em reclamação trabalhista coletiva movida por grupo de 8 ex-funcionários pleiteando horas extras, adicional noturno, verbas rescisórias e indenização por danos morais coletivos.

CLÁUSULA SEGUNDA - DOS HONORÁRIOS CONTRATUAIS
Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA, a título de honorários advocatícios contratuais, o valor total de R$ 84.000,00 (20% do valor da causa), a ser pago da seguinte forma:

Valor do Contrato: R$ 84.000,00
Forma de Pagamento: Transferência Bancária
Número de Parcelas: 6x
Vencimento: 10/03/2026

CLÁUSULA TERCEIRA - DOS HONORÁRIOS DE SUCUMBÊNCIA
Em caso de êxito na demanda, os honorários de sucumbência, arbitrados pelo juízo, no montante estimado de R$ 50.000,00, serão devidos integralmente à CONTRATADA, não se confundindo com os honorários contratuais.

CLÁUSULA QUARTA - DAS DESPESAS PROCESSUAIS
Todas as despesas processuais necessárias ao regular andamento do processo, tais como custas judiciais, perícias, certidões e outras que se fizerem necessárias, serão de responsabilidade da CONTRATANTE, estimadas em R$ 8.500,00.

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATADA
A CONTRATADA obriga-se a:
a) Prestar os serviços advocatícios com zelo, diligência e dentro dos padrões técnicos e éticos da profissão;
b) Manter a CONTRATANTE informada sobre o andamento do processo;
c) Comparecer às audiências e praticar todos os atos processuais necessários;
d) Guardar sigilo sobre todas as informações obtidas em razão da prestação dos serviços.

CLÁUSULA SEXTA - DAS OBRIGAÇÕES DA CONTRATANTE
A CONTRATANTE obriga-se a:
a) Fornecer todas as informações e documentos necessários à prestação dos serviços;
b) Efetuar o pagamento dos honorários nas datas estabelecidas;
c) Reembolsar as despesas processuais antecipadas pela CONTRATADA;
d) Informar imediatamente qualquer mudança de endereço, telefone ou representante legal.

CLÁUSULA SÉTIMA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação prévia por escrito, com antecedência mínima de 30 (trinta) dias, devendo os honorários serem pagos proporcionalmente aos serviços já prestados.

CLÁUSULA OITAVA - DO FORO
Fica eleito o Foro da Comarca de São Paulo para dirimir quaisquer questões oriundas do presente contrato.

E, por estarem assim justos e contratados, assinam o presente instrumento em 02 (duas) vias de igual teor e forma.

São Paulo, 10 de março de 2024.


_______________________________              _______________________________
CONTRATANTE                                  CONTRATADA
Fernanda Cristina Almeida                    Anna Laura Rocha Gomes
Representante Legal                          OAB: [NÚMERO]
Inovare Tecnologia e Sistemas Ltda
CNPJ: 23.456.789/0001-12


Testemunhas:

1. _______________________________
Nome: Rodrigo Fernandes Lima
CPF: 890.123.456-78

2. _______________________________
Nome: Carla Mendes Ribeiro
CPF: 901.234.567-89`,
    dataCriacao: '2024-03-10T08:00:00.000Z',
    dataEdicao: '2024-03-10T13:45:00.000Z',
    arquivoAssinado: {
      nome: 'contrato_assinado_inovare_tech.pdf',
      url: 'data:application/pdf;base64,exemplo4',
      dataUpload: '2024-03-15T11:30:00.000Z',
    },
  },

  // Contrato 5 - Distribuidora Mercantil São Jorge Ltda (CNPJ)
  {
    id: '5',
    processoId: '5',
    numeroProcesso: '1006789-01.2023.8.26.0100',
    clienteNome: 'Distribuidora Mercantil São Jorge Ltda',
    clienteDocumento: '34.567.890/0001-23',
    textoContrato: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: DISTRIBUIDORA MERCANTIL SÃO JORGE LTDA
CNPJ: 34.567.890/0001-23
Nome Fantasia: Mercantil São Jorge
Representante Legal: Paulo Roberto da Silva
Endereço: Rua da Mooca, 5678, Galpão 3 - Mooca
São Paulo - SP, CEP: 03102-002
Email: juridico@mercantilsaojorge.com.br
Telefone: (11) 3234-5678 / (11) 98765-4321

CONTRATADA: ANNA LAURA ROCHA GOMES - ADVOCACIA E CONSULTORIA
Endereço: [ENDEREÇO DO ESCRITÓRIO]
OAB: [NÚMERO OAB]
Email: contato@annalaura-adv.com.br
Telefone: [TELEFONE DO ESCRITÓRIO]

Pelo presente instrumento particular, as partes acima qualificadas têm entre si, justo e contratado, o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO
A CONTRATADA, por meio da advogada responsável Dra. Anna Laura Rocha Gomes, obriga-se a prestar serviços profissionais de advocacia à CONTRATANTE, consistindo em:

Processo nº: 1006789-01.2023.8.26.0100
Tipo de Ação: Ação Cível de Indenização por Descumprimento Contratual
Tribunal/Vara: TJ-SP - 12ª Vara Cível
Comarca: São Paulo
Polo Processual: AUTOR/REQUERENTE
Parte Contrária: Alimentos Nordeste Distribuidora Ltda
Valor da Causa: R$ 350.000,00

Objeto da Ação: Cobrança de valores e indenização por descumprimento contratual de fornecedor que deixou de entregar mercadorias conforme acordado, causando prejuízos financeiros e perda de clientes.

CLÁUSULA SEGUNDA - DOS HONORÁRIOS CONTRATUAIS
Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA, a título de honorários advocatícios contratuais, o valor total de R$ 70.000,00 (20% do valor da causa), a ser pago da seguinte forma:

Valor do Contrato: R$ 70.000,00
Forma de Pagamento: Boleto Bancário
Número de Parcelas: 5x
Vencimento: 22/09/2026

CLÁUSULA TERCEIRA - DOS HONORÁRIOS DE SUCUMBÊNCIA
Em caso de êxito na demanda, os honorários de sucumbência, arbitrados pelo juízo, no montante estimado de R$ 45.000,00, serão devidos integralmente à CONTRATADA, não se confundindo com os honorários contratuais.

CLÁUSULA QUARTA - DAS DESPESAS PROCESSUAIS
Todas as despesas processuais necessárias ao regular andamento do processo, tais como custas judiciais, perícias contábeis, certidões e outras que se fizerem necessárias, serão de responsabilidade da CONTRATANTE, estimadas em R$ 6.800,00.

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATADA
A CONTRATADA obriga-se a:
a) Prestar os serviços advocatícios com zelo, diligência e dentro dos padrões técnicos e éticos da profissão;
b) Manter a CONTRATANTE informada sobre o andamento do processo;
c) Comparecer às audiências e praticar todos os atos processuais necessários;
d) Guardar sigilo sobre todas as informações obtidas em razão da prestação dos serviços.

CLÁUSULA SEXTA - DAS OBRIGAÇÕES DA CONTRATANTE
A CONTRATANTE obriga-se a:
a) Fornecer todas as informações e documentos necessários à prestação dos serviços;
b) Efetuar o pagamento dos honorários nas datas estabelecidas;
c) Reembolsar as despesas processuais antecipadas pela CONTRATADA;
d) Informar imediatamente qualquer mudança de endereço, telefone ou representante legal.

CLÁUSULA SÉTIMA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação prévia por escrito, com antecedência mínima de 30 (trinta) dias, devendo os honorários serem pagos proporcionalmente aos serviços já prestados.

CLÁUSULA OITAVA - DO FORO
Fica eleito o Foro da Comarca de São Paulo para dirimir quaisquer questões oriundas do presente contrato.

E, por estarem assim justos e contratados, assinam o presente instrumento em 02 (duas) vias de igual teor e forma.

São Paulo, 22 de setembro de 2023.


_______________________________              _______________________________
CONTRATANTE                                  CONTRATADA
Paulo Roberto da Silva                       Anna Laura Rocha Gomes
Representante Legal                          OAB: [NÚMERO]
Distribuidora Mercantil São Jorge Ltda
CNPJ: 34.567.890/0001-23


Testemunhas:

1. _______________________________
Nome: Adriana Costa Pereira
CPF: 012.345.678-90

2. _______________________________
Nome: Marcelo Augusto Rocha
CPF: 123.456.789-01`,
    dataCriacao: '2023-09-22T09:00:00.000Z',
    dataEdicao: '2023-09-22T14:30:00.000Z',
    arquivoAssinado: {
      nome: 'contrato_assinado_mercantil_sao_jorge.pdf',
      url: 'data:application/pdf;base64,exemplo5',
      dataUpload: '2023-09-28T10:15:00.000Z',
    },
  },

  // Contrato 6 - Construtora Edifica Brasil S.A. (CNPJ)
  {
    id: '6',
    processoId: '6',
    numeroProcesso: '1007890-12.2021.8.26.0100',
    clienteNome: 'Construtora Edifica Brasil S.A.',
    clienteDocumento: '45.678.901/0001-34',
    textoContrato: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: CONSTRUTORA EDIFICA BRASIL S.A.
CNPJ: 45.678.901/0001-34
Nome Fantasia: Edifica Brasil
Representante Legal: Marcelo Augusto Pereira
Endereço: Rua Funchal, 418, Conjunto 2301 - Vila Olímpia
São Paulo - SP, CEP: 04543-010
Email: juridico@edificabrasil.com.br
Telefone: (11) 3890-1234 / (11) 99234-5678

CONTRATADA: ANNA LAURA ROCHA GOMES - ADVOCACIA E CONSULTORIA
Endereço: [ENDEREÇO DO ESCRITÓRIO]
OAB: [NÚMERO OAB]
Email: contato@annalaura-adv.com.br
Telefone: [TELEFONE DO ESCRITÓRIO]

Pelo presente instrumento particular, as partes acima qualificadas têm entre si, justo e contratado, o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO
A CONTRATADA, por meio da advogada responsável Dra. Anna Laura Rocha Gomes, obriga-se a prestar serviços profissionais de advocacia à CONTRATANTE, consistindo em:

Processo nº: 1007890-12.2021.8.26.0100
Tipo de Ação: Ação de Cobrança
Tribunal/Vara: TJ-SP - 7ª Vara Cível
Comarca: São Paulo
Polo Processual: AUTOR/REQUERENTE
Parte Contrária: Incorporadora Millennium Empreendimentos Ltda
Valor da Causa: R$ 1.200.000,00

Objeto da Ação: Cobrança de valores devidos por incorporadora referentes a serviços de construção civil prestados em empreendimento residencial, incluindo materiais fornecidos, mão de obra e aditivos contratuais não pagos.

CLÁUSULA SEGUNDA - DOS HONORÁRIOS CONTRATUAIS
Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA, a título de honorários advocatícios contratuais, o valor total de R$ 180.000,00 (15% do valor da causa), a ser pago da seguinte forma:

Valor do Contrato: R$ 180.000,00
Forma de Pagamento: Transferência Bancária
Número de Parcelas: 8x
Vencimento: 18/11/2026

CLÁUSULA TERCEIRA - DOS HONORÁRIOS DE SUCUMBÊNCIA
Em caso de êxito na demanda, os honorários de sucumbência, arbitrados pelo juízo, no montante estimado de R$ 120.000,00, serão devidos integralmente à CONTRATADA, não se confundindo com os honorários contratuais.

CLÁUSULA QUARTA - DAS DESPESAS PROCESSUAIS
Todas as despesas processuais necessárias ao regular andamento do processo, tais como custas judiciais, perícias técnicas de engenharia, perícias contábeis, certidões e outras que se fizerem necessárias, serão de responsabilidade da CONTRATANTE, estimadas em R$ 28.000,00.

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATADA
A CONTRATADA obriga-se a:
a) Prestar os serviços advocatícios com zelo, diligência e dentro dos padrões técnicos e éticos da profissão;
b) Manter a CONTRATANTE informada sobre o andamento do processo;
c) Comparecer às audiências e praticar todos os atos processuais necessários;
d) Guardar sigilo sobre todas as informações obtidas em razão da prestação dos serviços;
e) Acompanhar perícias técnicas e contábeis necessárias.

CLÁUSULA SEXTA - DAS OBRIGAÇÕES DA CONTRATANTE
A CONTRATANTE obriga-se a:
a) Fornecer todas as informações e documentos necessários à prestação dos serviços;
b) Efetuar o pagamento dos honorários nas datas estabelecidas;
c) Reembolsar as despesas processuais antecipadas pela CONTRATADA;
d) Informar imediatamente qualquer mudança de endereço, telefone ou representante legal;
e) Disponibilizar documentação técnica, contratos e planilhas orçamentárias.

CLÁUSULA SÉTIMA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação prévia por escrito, com antecedência mínima de 30 (trinta) dias, devendo os honorários serem pagos proporcionalmente aos serviços já prestados.

CLÁUSULA OITAVA - DO FORO
Fica eleito o Foro da Comarca de São Paulo para dirimir quaisquer questões oriundas do presente contrato.

E, por estarem assim justos e contratados, assinam o presente instrumento em 02 (duas) vias de igual teor e forma.

São Paulo, 18 de novembro de 2021.


_______________________________              _______________________________
CONTRATANTE                                  CONTRATADA
Marcelo Augusto Pereira                      Anna Laura Rocha Gomes
Representante Legal                          OAB: [NÚMERO]
Construtora Edifica Brasil S.A.
CNPJ: 45.678.901/0001-34


Testemunhas:

1. _______________________________
Nome: Daniela Ferreira Costa
CPF: 234.567.890-12

2. _______________________________
Nome: Eduardo Henrique Santos
CPF: 345.678.901-23`,
    dataCriacao: '2021-11-18T10:30:00.000Z',
    dataEdicao: '2021-11-18T16:00:00.000Z',
    arquivoAssinado: {
      nome: 'contrato_assinado_edifica_brasil.pdf',
      url: 'data:application/pdf;base64,exemplo6',
      dataUpload: '2021-11-25T09:00:00.000Z',
    },
  }
];

export function ContratosProvider({ children }: { children: ReactNode }) {
  // Carregar dados do localStorage ou usar exemplos
  const [contratos, setContratos] = useState<Contrato[]>(() => {
    try {
      const savedContratos = localStorage.getItem(STORAGE_KEY);
      if (savedContratos) {
        return JSON.parse(savedContratos);
      }
    } catch (error) {
      console.error('Erro ao carregar contratos do localStorage:', error);
    }
    return CONTRATOS_EXEMPLO;
  });

  // Salvar no localStorage sempre que contratos mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contratos));
    } catch (error) {
      console.error('Erro ao salvar contratos no localStorage:', error);
    }
  }, [contratos]);

  const adicionarContrato = (contrato: Omit<Contrato, 'id' | 'dataCriacao'>) => {
    const novoContrato: Contrato = {
      ...contrato,
      id: Date.now().toString(),
      dataCriacao: getLocalDateTimeString(),
    };
    setContratos((prev) => [...prev, novoContrato]);
  };

  const atualizarContrato = (id: string, contratoAtualizado: Partial<Omit<Contrato, 'id' | 'dataCriacao'>>) => {
    setContratos((prev) =>
      prev.map((contrato) =>
        contrato.id === id
          ? { ...contrato, ...contratoAtualizado, dataEdicao: getLocalDateTimeString() }
          : contrato
      )
    );
  };

  const buscarContratoPorProcesso = (processoId: string) => {
    return contratos.find(c => c.processoId === processoId);
  };

  const resetarDados = () => {
    setContratos(CONTRATOS_EXEMPLO);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(CONTRATOS_EXEMPLO));
  };

  return (
    <ContratosContext.Provider value={{ contratos, adicionarContrato, atualizarContrato, buscarContratoPorProcesso, resetarDados }}>
      {children}
    </ContratosContext.Provider>
  );
}

export function useContratos() {
  const context = useContext(ContratosContext);
  if (context === undefined) {
    throw new Error('useContratos must be used within a ContratosProvider');
  }
  return context;
}
