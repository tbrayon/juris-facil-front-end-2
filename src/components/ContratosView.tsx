import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { FileText, Printer, Upload, Edit, Save, X, Plus, Search, CheckCircle, ArrowLeft } from 'lucide-react';
import { useContratos } from '../contexts/ContratosContext';
import { useProcessos } from '../contexts/ProcessosContext';
import { useClientes } from '../contexts/ClientesContext';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { formatDateBR, formatDateTimeBR, getLocalDateString, getLocalDateTimeString } from '../utils/formatters';

const gerarTemplateContrato = (processo: any, cliente: any) => {
  const hoje = formatDateBR(getLocalDateString());
  const polo = processo.polo === 'autor' ? 'AUTOR/REQUERENTE' : processo.polo === 'reu' ? 'RÉU/REQUERIDO' : 'TERCEIRO INTERESSADO';
  const processoInfo = processo.numeroProcesso
    ? `Processo nº: ${processo.numeroProcesso}`
    : '(Processo ainda não ajuizado - a ser distribuído)';

  return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: ${cliente.nome.toUpperCase()}
${cliente.tipo === 'cpf' ? `CPF: ${cliente.documento}` : `CNPJ: ${cliente.documento}`}
${cliente.tipo === 'cpf' ? `RG: ${cliente.rg || 'Não informado'}` : ''}
Endereço: ${cliente.logradouro}, ${cliente.numero}${cliente.complemento ? ', ' + cliente.complemento : ''} - ${cliente.bairro}
${cliente.municipio} - ${cliente.uf}, CEP: ${cliente.cep}
Email: ${cliente.email || 'Não informado'}
Telefone: ${cliente.telefones && cliente.telefones.length > 0 ? cliente.telefones.join(' / ') : 'Não informado'}

CONTRATADA: ANNA LAURA ROCHA GOMES - ADVOCACIA E CONSULTORIA
Endereço: [ENDEREÇO DO ESCRITÓRIO]
OAB: [NÚMERO OAB]
Email: [EMAIL DO ESCRITÓRIO]
Telefone: [TELEFONE DO ESCRITÓRIO]

Pelo presente instrumento particular, as partes acima qualificadas têm entre si, justo e contratado, o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO
A CONTRATADA, por meio da advogada responsável ${processo.advogadoResponsavel || '[ADVOGADO RESPONSÁVEL]'}, obriga-se a prestar serviços profissionais de advocacia ao CONTRATANTE, consistindo em:

${processoInfo}
Tipo de Ação: ${processo.tipoAcao || '[TIPO DE AÇÃO]'}
Tribunal/Vara: ${processo.tribunal || '[TRIBUNAL]'} - ${processo.vara || '[VARA]'}
Comarca: ${processo.comarca || '[COMARCA]'}
Polo Processual: ${polo}
Parte Contrária: ${processo.parteContraria || '[PARTE CONTRÁRIA]'}
Valor da Causa: ${processo.valorCausa || '[VALOR DA CAUSA]'}

Objeto da Ação: ${processo.objetoAcao || '[DESCREVER OBJETO DA AÇÃO]'}

CLÁUSULA SEGUNDA - DOS HONORÁRIOS CONTRATUAIS
Pelos serviços prestados, o CONTRATANTE pagará à CONTRATADA, a título de honorários advocatícios contratuais, o valor total de ${processo.honorariosAdvocaticios} (${processo.percentualContrato} do valor da causa), a ser pago da seguinte forma:

Valor do Contrato: ${processo.valorContrato}
Forma de Pagamento: ${processo.formaPagamento}
${processo.numeroParcelas ? `Número de Parcelas: ${processo.numeroParcelas}x` : ''}
Vencimento: ${formatDateBR(processo.dataVencimento)}

CLÁUSULA TERCEIRA - DOS HONORÁRIOS DE SUCUMBÊNCIA
Em caso de êxito na demanda, os honorários de sucumbência, arbitrados pelo juízo, no montante estimado de ${processo.honorariosSucumbencia}, serão devidos integralmente à CONTRATADA, não se confundindo com os honorários contratuais.

CLÁUSULA QUARTA - DAS DESPESAS PROCESSUAIS
Todas as despesas processuais necessárias ao regular andamento do processo, tais como custas judiciais, emolumentos, certidões, publicações, perícias, autenticações e outras que se fizerem necessárias, serão de responsabilidade do CONTRATANTE, estimadas em ${processo.despesas}.

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
Fica eleito o Foro da Comarca de ${processo.comarca} para dirimir quaisquer questões oriundas do presente contrato.

E, por estarem assim justos e contratados, assinam o presente instrumento em 02 (duas) vias de igual teor e forma.

${cliente.municipio}, ${hoje}.

CONTRATANTE
${cliente.nome}
${cliente.tipo === 'cpf' ? `CPF: ${cliente.documento}` : `CNPJ: ${cliente.documento}`}
${cliente.tipo === 'cpf' ? `RG: ${cliente.rg || 'Não informado'}` : ''}

CONTRATADA
Anna Laura Rocha Gomes
OAB: [NÚMERO OAB]

TESTEMUNHAS

1. Nome:
CPF:

2. Nome:
CPF:
`;
};

interface ContratosViewProps {
  onVoltar: () => void;
}

export function ContratosView({ onVoltar }: ContratosViewProps) {
  const { contratos, adicionarContrato, atualizarContrato } = useContratos();
  const { processos } = useProcessos();
  const { clientes } = useClientes();

  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'gerar' | 'editar' | 'visualizar'>('lista');
  const [processoSelecionado, setProcessoSelecionado] = useState<string>('');
  const [contratoAtual, setContratoAtual] = useState<any>(null);
  const [textoEditavel, setTextoEditavel] = useState('');
  const [termoBusca, setTermoBusca] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGerarContrato = () => {
    if (!processoSelecionado) {
      toast.error('Selecione um processo', {
        description: 'É necessário selecionar um processo para gerar o contrato.',
      });
      return;
    }

    const processo = processos.find(p => p.id === processoSelecionado);
    if (!processo) return;

    const cliente = clientes.find(c => c.id === processo.clienteId);
    if (!cliente) {
      toast.error('Cliente não encontrado', {
        description: 'Não foi possível encontrar os dados do cliente.',
      });
      return;
    }

    const contratoExistente = contratos.find(c => c.processoId === processo.id);
    if (contratoExistente) {
      setContratoAtual(contratoExistente);
      setTextoEditavel(contratoExistente.textoContrato);
      setModoVisualizacao('editar');
      toast.info('Contrato já existe', {
        description: 'Este processo já possui um contrato. Você pode editá-lo.',
      });
      return;
    }

    const template = gerarTemplateContrato(processo, cliente);
    setTextoEditavel(template);
    setContratoAtual({
      processoId: processo.id,
      numeroProcesso: processo.numeroProcesso,
      clienteNome: processo.clienteNome,
      clienteDocumento: processo.clienteDocumento,
    });
    setModoVisualizacao('editar');
  };

  const handleSalvarContrato = () => {
    if (contratoAtual.id) {
      atualizarContrato(contratoAtual.id, {
        textoContrato: textoEditavel,
      });
      toast.success('Contrato atualizado!', {
        description: 'As alterações foram salvas com sucesso.',
      });
    } else {
      adicionarContrato({
        processoId: contratoAtual.processoId,
        numeroProcesso: contratoAtual.numeroProcesso,
        clienteNome: contratoAtual.clienteNome,
        clienteDocumento: contratoAtual.clienteDocumento,
        textoContrato: textoEditavel,
      });
      toast.success('Contrato criado!', {
        description: 'O contrato foi salvo com sucesso.',
      });
    }
    setModoVisualizacao('lista');
    setContratoAtual(null);
    setTextoEditavel('');
    setProcessoSelecionado('');
  };

  const handleImprimirContrato = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Contrato de Honorários</title>
            <meta charset="UTF-8">
            <style>
              @page { margin: 2cm; }
              body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.8; margin: 0; color: #000; }
              .header-logo { margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1.5px solid #a16535; display: flex; align-items: center; justify-content: center; gap: 15px; }
              .logo-coluna { flex-shrink: 0; }
              .logo-texto { text-align: left; }
              .logo-texto h1 { font-family: Georgia, serif; font-size: 16pt; margin: 0; letter-spacing: 0.08em; color: #2d1f16; }
              .logo-texto p { font-family: Georgia, serif; margin: 4px 0 0 0; color: #4a3629; }
              .logo-subtitle { font-size: 9pt; letter-spacing: 0.12em; }
              .logo-areas { font-size: 7pt; letter-spacing: 0.15em; color: #6b5544; }
              pre.contrato-texto { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.8; margin: 0; padding: 0; overflow-x: auto; text-align: justify; }
              @media print {
                body { margin: 0; }
                pre.contrato-texto { white-space: pre-wrap; overflow-x: visible; font-size: 12pt; }
              }
            </style>
          </head>
          <body>
            <div class="header-logo">
              <div class="logo-coluna">
                <svg width="50" height="60" viewBox="0 0 100 120" style="color: #a16535;">
                  <line x1="10" y1="5" x2="90" y2="5" stroke="currentColor" stroke-width="2"/>
                  <line x1="10" y1="9" x2="90" y2="9" stroke="currentColor" stroke-width="2"/>
                  <line x1="10" y1="13" x2="90" y2="13" stroke="currentColor" stroke-width="2"/>
                  <path d="M 15 20 Q 20 15, 25 20 Q 30 15, 35 20 Q 40 15, 45 20 Q 50 15, 55 20 Q 60 15, 65 20 Q 70 15, 75 20 Q 80 15, 85 20"
                        fill="none" stroke="currentColor" stroke-width="2"/>
                  <path d="M 15 25 Q 20 22, 25 25 Q 30 22, 35 25 Q 40 22, 45 25 Q 50 22, 55 25 Q 60 22, 65 25 Q 70 22, 75 25 Q 80 22, 85 25"
                        fill="none" stroke="currentColor" stroke-width="2"/>
                  <line x1="30" y1="30" x2="30" y2="100" stroke="currentColor" stroke-width="2"/>
                  <line x1="40" y1="30" x2="40" y2="100" stroke="currentColor" stroke-width="2"/>
                  <line x1="50" y1="30" x2="50" y2="100" stroke="currentColor" stroke-width="2"/>
                  <line x1="60" y1="30" x2="60" y2="100" stroke="currentColor" stroke-width="2"/>
                  <line x1="70" y1="30" x2="70" y2="100" stroke="currentColor" stroke-width="2"/>
                  <rect x="20" y="100" width="60" height="4" fill="currentColor"/>
                  <rect x="15" y="105" width="70" height="4" fill="currentColor"/>
                  <rect x="10" y="110" width="80" height="5" fill="currentColor"/>
                </svg>
              </div>
              <div class="logo-texto">
                <h1>ANNA LAURA ROCHA GOMES</h1>
                <p class="logo-subtitle">ADVOCACIA E CONSULTORIA</p>
                <p class="logo-areas">CÍVEL - CRIMINAL - FAMÍLIA</p>
              </div>
            </div>
            <pre class="contrato-texto">${textoEditavel.replace(/<[^>]*>/g, '')}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const handleUploadArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!tiposPermitidos.includes(file.type)) {
      toast.error('Formato não permitido', {
        description: 'Apenas arquivos PDF, JPG ou PNG são aceitos.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;

      if (contratoAtual.id) {
        atualizarContrato(contratoAtual.id, {
          arquivoAssinado: {
            nome: file.name,
            url: url,
            dataUpload: getLocalDateTimeString(),
          },
        });
        toast.success('Documento anexado!', {
          description: `${file.name} foi anexado ao contrato.`,
        });

        const contratoAtualizado = contratos.find(c => c.id === contratoAtual.id);
        if (contratoAtualizado) {
          setContratoAtual(contratoAtualizado);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const contratosFiltrados = contratos.filter(c => {
    if (!termoBusca.trim()) return true;
    return (
      (c.numeroProcesso && c.numeroProcesso.toLowerCase().includes(termoBusca.toLowerCase())) ||
      c.clienteNome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.clienteDocumento.includes(termoBusca)
    );
  });

  const processosDisponiveis = processos;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-0">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div>
            <h2 className="text-xl md:text-2xl text-[#2d1f16] flex items-center gap-2">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-[#a16535]" />
              Contratos de Honorários
            </h2>
            <p className="text-sm text-[#6b5544]">Gere, edite e gerencie contratos de honorários advocatícios</p>
          </div>
          {modoVisualizacao === 'lista' ? (
            <Button
              variant="outline"
              onClick={onVoltar}
              className="w-full sm:w-auto !bg-white !text-[#a16535] border-2 border-[#955d30] hover:!bg-[#a16535] hover:!text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Página Inicial
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setModoVisualizacao('lista');
                setContratoAtual(null);
                setTextoEditavel('');
                setProcessoSelecionado('');
              }}
              className="w-full sm:w-auto border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
        </div>
      </div>

      {/* Lista de Contratos */}
      {modoVisualizacao === 'lista' && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button
              onClick={() => setModoVisualizacao('gerar')}
              className="bg-[#a16535] hover:bg-[#8b5329] text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Contrato
            </Button>
          </div>

          <Card className="bg-white border-2 border-[#d4c4b0] shadow-sm mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b5544]" />
                <Input
                  type="text"
                  placeholder="Buscar por processo, cliente ou documento..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-[#d4c4b0] shadow-sm">
            <CardHeader className="border-b-2 border-[#d4c4b0] bg-gradient-to-r from-[#f6f3ee] to-white p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl text-[#2d1f16]">Contratos Cadastrados</CardTitle>
              <CardDescription className="text-sm text-[#6b5544]">
                {contratosFiltrados.length} contrato(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              {contratosFiltrados.length > 0 ? (
                contratosFiltrados.map((contrato) => {
                  const processoAtual = processos.find(p => p.id === contrato.processoId);
                  const numeroProcessoAtual = processoAtual?.numeroProcesso || contrato.numeroProcesso;

                  return (
                    <Card key={contrato.id} className="bg-gradient-to-br from-[#f6f3ee] to-white border-2 border-[#d4c4b0] hover:border-[#a16535] hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 sm:gap-0">
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <h4 className="text-base sm:text-lg text-[#2d1f16]">
                                {numeroProcessoAtual || <span className="text-[#6b5544] italic">Contrato sem número de processo</span>}
                              </h4>
                              {contrato.arquivoAssinado && (
                                <Badge className="bg-green-100 text-green-700 border-green-300 hover:bg-green-100">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Assinado
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-[#4a3629]">
                              <strong>Cliente:</strong> {contrato.clienteNome} ({contrato.clienteDocumento})
                            </p>
                            {processoAtual && (
                              <p className="text-sm text-[#6b5544]">
                                <strong>Tipo de Ação:</strong> {processoAtual.tipoAcao}
                              </p>
                            )}
                            <p className="text-sm text-[#6b5544]">
                              Criado em: {formatDateTimeBR(contrato.dataCriacao)}
                            </p>
                            {contrato.arquivoAssinado && (
                              <p className="text-green-700 text-sm mt-1">
                                {contrato.arquivoAssinado.nome}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 self-end sm:self-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setContratoAtual(contrato);
                                setTextoEditavel(contrato.textoContrato);
                                setModoVisualizacao('visualizar');
                              }}
                              className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setContratoAtual(contrato);
                                setTextoEditavel(contrato.textoContrato);
                                setModoVisualizacao('editar');
                              }}
                              className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-[#d4c4b0] mx-auto mb-4" />
                  <p className="text-[#6b5544]">
                    {termoBusca
                      ? 'Nenhum contrato encontrado com os filtros aplicados.'
                      : 'Nenhum contrato cadastrado ainda. Clique em "Novo Contrato" para começar.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Gerar Novo Contrato */}
      {modoVisualizacao === 'gerar' && (
        <Card className="bg-white border-2 border-[#d4c4b0] shadow-sm">
          <CardHeader className="border-b-2 border-[#d4c4b0] bg-gradient-to-r from-[#f6f3ee] to-white p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl text-[#2d1f16]">Gerar Novo Contrato</CardTitle>
            <CardDescription className="text-sm text-[#6b5544]">
              Selecione um processo para gerar o contrato de honorários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6">
            <div className="space-y-2">
              <Label className="text-[#4a3629]">Selecione o Processo</Label>
              <Select value={processoSelecionado} onValueChange={setProcessoSelecionado}>
                <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                  <SelectValue placeholder="Escolha um processo" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#d4c4b0] max-h-[300px]">
                  {processosDisponiveis.map((processo) => (
                    <SelectItem key={processo.id} value={processo.id} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                      {processo.numeroProcesso || '(Sem número)'} - {processo.tipoAcao} - {processo.clienteNome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleGerarContrato}
                className="bg-[#a16535] hover:bg-[#8b5329] text-white shadow-md"
              >
                <FileText className="w-4 h-4 mr-2" />
                Gerar Contrato
              </Button>
              <Button
                variant="outline"
                onClick={() => setModoVisualizacao('lista')}
                className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor de Contrato */}
      {modoVisualizacao === 'editar' && contratoAtual && (
        <Card className="bg-white border-2 border-[#d4c4b0] shadow-sm">
          <CardHeader className="border-b-2 border-[#d4c4b0] bg-gradient-to-r from-[#f6f3ee] to-white p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl text-[#2d1f16]">
              {contratoAtual?.id ? 'Editar Contrato' : 'Novo Contrato'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6">
            <div className="space-y-2">
              <Label className="text-[#4a3629]">Texto do Contrato</Label>
              <Textarea
                value={textoEditavel}
                onChange={(e) => setTextoEditavel(e.target.value)}
                rows={30}
                className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] resize-none text-sm"
                style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.8' }}
              />
            </div>

            <Separator className="bg-[#d4c4b0]" />

            {contratoAtual?.id && (
              <div className="space-y-2">
                <Label className="text-[#4a3629]">Anexar Contrato Assinado</Label>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {contratoAtual.arquivoAssinado ? 'Substituir' : 'Upload PDF/Imagem'}
                  </Button>
                  {contratoAtual.arquivoAssinado && (
                    <span className="text-green-700 flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      {contratoAtual.arquivoAssinado.nome}
                    </span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleUploadArquivo}
                  className="hidden"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleSalvarContrato}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button
                onClick={handleImprimirContrato}
                className="bg-[#a16535] hover:bg-[#8b5329] text-white shadow-md"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button
                variant="outline"
                onClick={() => setModoVisualizacao('lista')}
                className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visualizar Contrato */}
      {modoVisualizacao === 'visualizar' && contratoAtual && (
        <Card className="bg-white border-2 border-[#d4c4b0] shadow-sm">
          <CardHeader className="border-b-2 border-[#d4c4b0] bg-gradient-to-r from-[#f6f3ee] to-white p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl text-[#2d1f16]">Visualizar Contrato</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-white p-8 rounded-lg border-2 border-[#d4c4b0] shadow-inner">
              <div className="mb-8 pb-6 border-b-2 border-[#a16535] text-center">
                <h1 className="text-2xl tracking-wider text-[#2d1f16]" style={{ fontFamily: 'Georgia, serif' }}>
                  ANNA LAURA ROCHA GOMES
                </h1>
                <p className="text-base text-[#4a3629]" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.15em' }}>
                  ADVOCACIA E CONSULTORIA
                </p>
              </div>
              <pre className="whitespace-pre-wrap text-[#2d1f16] text-sm leading-relaxed" style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.8', textAlign: 'justify' }}>
                {textoEditavel}
              </pre>
            </div>

            {contratoAtual.arquivoAssinado && (
              <div className="mt-6 bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <div>
                    <p><strong>Contrato Assinado Anexado</strong></p>
                    <p className="text-sm">{contratoAtual.arquivoAssinado.nome}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleImprimirContrato}
                className="bg-[#a16535] hover:bg-[#8b5329] text-white"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button
                onClick={() => setModoVisualizacao('editar')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={() => setModoVisualizacao('lista')}
                className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}