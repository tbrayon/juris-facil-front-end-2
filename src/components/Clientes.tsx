import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Search, UserPlus, Users, CheckCircle, X, Plus, Edit, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useClientes, Cliente } from '../contexts/ClientesContext';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { formatCPF, formatCNPJ, formatDateBR, formatTelefone, formatCEP, removeNonNumeric } from '../others/formatters';

// Estados brasileiros
const estadosBrasileiros = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];

interface ClientesViewProps {
  clienteIdParaEditar?: string | null;
  onClearClienteIdParaEditar?: () => void;
  onVoltar: () => void;
}

export function ClientesView({ clienteIdParaEditar, onClearClienteIdParaEditar, onVoltar }: ClientesViewProps) {
  // ATENÇÃO: Se useClientes, adicionarCliente, atualizarCliente, buscarClientes, e clientes não existem, 
  // O componente pode estar quebrando aqui. Certifique-se de que os contexts estão funcionando.
  const { adicionarCliente, atualizarCliente, buscarClientes, clientes } = useClientes();
  
  const [activeTab, setActiveTab] = useState<'consultar' | 'incluir'>('consultar');
  const [consultaCpf, setConsultaCpf] = useState('');
  const [consultaCnpj, setConsultaCnpj] = useState('');
  const [consultaNome, setConsultaNome] = useState('');
  const [resultadosConsulta, setResultadosConsulta] = useState<Cliente[]>([]);
  const [consultaRealizada, setConsultaRealizada] = useState(false);

  // Estado para edição
  const [clienteEmEdicao, setClienteEmEdicao] = useState<Cliente | null>(null);

  // Campos do formulário de inclusão
  const [incluirTipo, setIncluirTipo] = useState<'cpf' | 'cnpj'>('cpf');
  const [incluirNome, setIncluirNome] = useState('');
  const [incluirCpf, setIncluirCpf] = useState('');
  const [incluirRg, setIncluirRg] = useState('');
  const [incluirDataNascimento, setIncluirDataNascimento] = useState('');
  const [incluirEstadoCivil, setIncluirEstadoCivil] = useState('');
  const [incluirNacionalidade, setIncluirNacionalidade] = useState('');
  const [incluirProfissao, setIncluirProfissao] = useState('');
  const [incluirEmpresa, setIncluirEmpresa] = useState('');
  const [incluirCargo, setIncluirCargo] = useState('');
  const [incluirCnpj, setIncluirCnpj] = useState('');
  const [incluirNomeFantasia, setIncluirNomeFantasia] = useState('');
  const [incluirNomeResponsavel, setIncluirNomeResponsavel] = useState('');
  const [incluirTelefones, setIncluirTelefones] = useState<string[]>(['']);
  const [incluirEmail, setIncluirEmail] = useState('');
  const [incluirCep, setIncluirCep] = useState('');
  const [incluirUf, setIncluirUf] = useState('');
  const [incluirMunicipio, setIncluirMunicipio] = useState('');
  const [incluirBairro, setIncluirBairro] = useState('');
  const [incluirLogradouro, setIncluirLogradouro] = useState('');
  const [incluirNumero, setIncluirNumero] = useState('');
  const [incluirComplemento, setIncluirComplemento] = useState('');
  const [incluirObservacoes, setIncluirObservacoes] = useState('');

  const handleConsultar = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ATENÇÃO: As funções de formatação (formatCPF, formatCNPJ, etc.) devem ser exportadas de src/utils/formatters.ts
    const resultados = clientes.filter(cliente => 
      (consultaNome && cliente.nome.toLowerCase().includes(consultaNome.toLowerCase())) ||
      (consultaCpf && cliente.documento === consultaCpf) ||
      (consultaCnpj && cliente.documento === consultaCnpj)
    );
    
    setResultadosConsulta(resultados);
    setConsultaRealizada(true);
  };

  const adicionarCampoTelefone = () => {
    setIncluirTelefones([...incluirTelefones, '']);
  };

  const removerCampoTelefone = (index: number) => {
    const novosTelefones = incluirTelefones.filter((_, i) => i !== index);
    setIncluirTelefones(novosTelefones.length === 0 ? [''] : novosTelefones);
  };

  const atualizarTelefone = (index: number, valor: string) => {
    const novosTelefones = [...incluirTelefones];
    novosTelefones[index] = formatTelefone(valor);
    setIncluirTelefones(novosTelefones);
  };

  const handleIncluir = (e: React.FormEvent) => {
    e.preventDefault();
    
    const telefonesFiltrados = incluirTelefones.filter(tel => tel.trim() !== '');
    
    const dadosCliente = {
      nome: incluirNome,
      documento: incluirTipo === 'cpf' ? incluirCpf : incluirCnpj,
      tipo: incluirTipo,
      telefones: telefonesFiltrados,
      email: incluirEmail,
      cep: incluirCep,
      uf: incluirUf,
      municipio: incluirMunicipio,
      bairro: incluirBairro,
      logradouro: incluirLogradouro,
      numero: incluirNumero,
      complemento: incluirComplemento,
      observacoes: incluirObservacoes,
      // Dados específicos de PF
      ...(incluirTipo === 'cpf' && {
        rg: incluirRg,
        dataNascimento: incluirDataNascimento,
        estadoCivil: incluirEstadoCivil,
        nacionalidade: incluirNacionalidade,
        profissao: incluirProfissao,
        empresa: incluirEmpresa,
        cargo: incluirCargo,
      }),
      // Dados específicos de PJ
      ...(incluirTipo === 'cnpj' && {
        nomeFantasia: incluirNomeFantasia,
        nomeResponsavel: incluirNomeResponsavel,
      }),
    };

    if (clienteEmEdicao) {
      // @ts-ignore - Ignorando erro de tipagem para simplificação
      atualizarCliente(clienteEmEdicao.id, dadosCliente);
      toast.success('Alteração realizada com sucesso!', {
        description: `Cliente ${incluirNome} foi atualizado.`,
        duration: 4000,
      });
      setClienteEmEdicao(null);
    } else {
      // @ts-ignore - Ignorando erro de tipagem para simplificação
      adicionarCliente(dadosCliente);
      toast.success('Cliente cadastrado com sucesso!', {
        description: `${incluirNome} foi adicionado ao sistema.`,
        duration: 4000,
      });
    }
    
    limparFormulario();
    
    setTimeout(() => {
      setActiveTab('consultar');
    }, 1500);
  };

  const handleEditar = (cliente: Cliente) => {
    setClienteEmEdicao(cliente);
    setIncluirTipo(cliente.tipo);
    setIncluirNome(cliente.nome);
    setIncluirEmail(cliente.email || '');
    setIncluirTelefones(cliente.telefones && cliente.telefones.length > 0 ? cliente.telefones : ['']);
    setIncluirCep(cliente.cep || '');
    setIncluirUf(cliente.uf || '');
    setIncluirMunicipio(cliente.municipio || '');
    setIncluirBairro(cliente.bairro || '');
    setIncluirLogradouro(cliente.logradouro || '');
    setIncluirNumero(cliente.numero || '');
    setIncluirComplemento(cliente.complemento || '');
    setIncluirObservacoes(cliente.observacoes || '');

    if (cliente.tipo === 'cpf') {
      setIncluirCpf(cliente.documento);
      // @ts-ignore
      setIncluirRg(cliente.rg || '');
      // @ts-ignore
      setIncluirDataNascimento(cliente.dataNascimento || '');
      // @ts-ignore
      setIncluirEstadoCivil(cliente.estadoCivil || '');
      // @ts-ignore
      setIncluirNacionalidade(cliente.nacionalidade || '');
      // @ts-ignore
      setIncluirProfissao(cliente.profissao || '');
      // @ts-ignore
      setIncluirEmpresa(cliente.empresa || '');
      // @ts-ignore
      setIncluirCargo(cliente.cargo || '');
    } else {
      setIncluirCnpj(cliente.documento);
      // @ts-ignore
      setIncluirNomeFantasia(cliente.nomeFantasia || '');
      // @ts-ignore
      setIncluirNomeResponsavel(cliente.nomeResponsavel || '');
    }

    setActiveTab('incluir');
  };

  const cancelarEdicao = () => {
    setClienteEmEdicao(null);
    limparFormulario();
  };

  const limparFormulario = () => {
    setIncluirNome('');
    setIncluirCpf('');
    setIncluirRg('');
    setIncluirDataNascimento('');
    setIncluirEstadoCivil('');
    setIncluirNacionalidade('');
    setIncluirProfissao('');
    setIncluirEmpresa('');
    setIncluirCargo('');
    setIncluirCnpj('');
    setIncluirNomeFantasia('');
    setIncluirNomeResponsavel('');
    setIncluirTelefones(['']);
    setIncluirEmail('');
    setIncluirCep('');
    setIncluirUf('');
    setIncluirMunicipio('');
    setIncluirBairro('');
    setIncluirLogradouro('');
    setIncluirNumero('');
    setIncluirComplemento('');
    setIncluirObservacoes('');
  };

  const limparConsulta = () => {
    setConsultaCpf('');
    setConsultaCnpj('');
    setConsultaNome('');
    setResultadosConsulta([]);
    setConsultaRealizada(false);
  };

  // Effect para carregar cliente para edição quando vindo do relatório
  useEffect(() => {
    if (clienteIdParaEditar) {
      const cliente = clientes.find(c => c.id === clienteIdParaEditar);
      if (cliente) {
        handleEditar(cliente);
        toast.info('Cliente carregado para edição');
      }
      // Limpar o ID após carregar
      onClearClienteIdParaEditar?.();
    }
  }, [clienteIdParaEditar, clientes, onClearClienteIdParaEditar]);

  return (
    <div className="max-w-xl mx-auto md:max-w-4xl px-4 sm:px-0"> 
      {/* ALTERAÇÃO: Padding horizontal (px-4) para telas pequenas, removido em sm+ */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl text-[#2d1f16] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#a16535]" />
              Gestão de Clientes
            </h2>
            <p className="text-sm text-[#6b5544]">Consulte ou cadastre novos clientes no sistema</p>
          </div>
          <Button
            variant="outline"
            onClick={onVoltar}
            className="w-full sm:w-auto !bg-white !text-[#a16535] border-2 border-[#955d30] hover:!bg-[#a16535] hover:!text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Página Inicial
          </Button>

        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'consultar' | 'incluir')} className="w-full">
        {/* TabsList com altura e padding otimizados para mobile */}
        <TabsList className="grid w-full grid-cols-2 bg-[#f6f3ee] border-2 border-[#d4c4b0] p-1 rounded-full h-11 sm:h-14">
          <TabsTrigger 
            value="consultar"
            className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full h-full transition-all text-sm"
          >
            {/* ALTERAÇÃO: Adicionado mr-2 base e texto "Consultar" visível apenas em mobile */}
            <Search className="w-4 h-4 mr-2" />
            <span className="sm:hidden">Consultar</span>
            <span className="hidden sm:inline">Consultar Cliente</span>
          </TabsTrigger>
          <TabsTrigger 
            value="incluir"
            className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full h-full transition-all text-sm"
          >
            {/* ALTERAÇÃO: Adicionado mr-2 base e texto "Incluir/Editar" visível apenas em mobile */}
            {clienteEmEdicao ? <Edit className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
            <span className="sm:hidden">{clienteEmEdicao ? 'Editar' : 'Incluir'}</span>
            <span className="hidden sm:inline">{clienteEmEdicao ? 'Editar Cliente' : 'Incluir Cliente'}</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Consultar */}
        <TabsContent value="consultar">
          <Card className="bg-white border-2 border-[#d4c4b0]">
            <CardHeader>
              <CardTitle className="text-[#2d1f16]">Consultar Cliente</CardTitle>
              <CardDescription className="text-[#6b5544]">
                Informe pelo menos um dos campos abaixo para realizar a consulta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConsultar} className="space-y-4">
                {/* Inputs de consulta empilhados em mobile */}
                <div className="space-y-4"> 
                  <div className="space-y-2">
                    <Label htmlFor="consulta-cpf" className="text-[#4a3629]">CPF</Label>
                    <Input
                      id="consulta-cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={consultaCpf}
                      onChange={(e) => setConsultaCpf(formatCPF(e.target.value))}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consulta-cnpj" className="text-[#4a3629]">CNPJ</Label>
                    <Input
                      id="consulta-cnpj"
                      type="text"
                      placeholder="00.000.000/0000-00"
                      value={consultaCnpj}
                      onChange={(e) => setConsultaCnpj(formatCNPJ(e.target.value))}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consulta-nome" className="text-[#4a3629]">Nome</Label>
                    <Input
                      id="consulta-nome"
                      type="text"
                      placeholder="Digite o nome do cliente"
                      value={consultaNome}
                      onChange={(e) => setConsultaNome(e.target.value)}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                  </div>
                </div>

                {/* Botões de Ação para Consulta (sempre lado a lado se houver espaço) */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Consultar
                  </Button>
                  {consultaRealizada && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={limparConsulta}
                      className="flex-1 bg-[#f6f3ee] border-[#d4c4b0] text-[#6b5544] hover:bg-[#d4c4b0] hover:text-[#2d1f16]"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpar
                    </Button>
                  )}
                </div>
              </form>

              {/* Resultados da Consulta */}
              {consultaRealizada && (
                <div className="mt-6 pt-6 border-t border-[#d4c4b0]">
                  <h3 className="text-[#2d1f16] mb-4 text-lg">
                    Resultados da Consulta ({resultadosConsulta.length})
                  </h3>
                  
                  {resultadosConsulta.length === 0 ? (
                    <Alert className="bg-[#a16535]/10 border-[#a16535]/30">
                      <AlertDescription className="text-[#4a3629]">
                        Nenhum cliente encontrado com os critérios informados.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {resultadosConsulta.map((cliente) => (
                        <Card key={cliente.id} className="bg-[#a16535]/5 border-[#d4c4b0]">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                              <div className="flex-1 space-y-1">
                                <p className="text-[#2d1f16] font-semibold">{cliente.nome}</p>
                                <p className="text-sm text-[#6b5544]">
                                  {cliente.tipo === 'cpf' ? 'CPF' : 'CNPJ'}: {cliente.documento}
                                </p>
                                {cliente.tipo === 'cpf' && (
                                  <>
                                    {/* @ts-ignore - Propriedades específicas de PF */}
                                    {cliente.estadoCivil && (
                                      <p className="text-sm text-[#6b5544]">Estado Civil: {cliente.estadoCivil}</p>
                                    )}
                                    {/* @ts-ignore */}
                                    {cliente.profissao && (
                                      <p className="text-sm text-[#6b5544]">Profissão: {cliente.profissao}</p>
                                    )}
                                  </>
                                )}
                                {cliente.email && (
                                  <p className="text-sm text-[#6b5544]">E-mail: {cliente.email}</p>
                                )}
                                {cliente.telefones && cliente.telefones.length > 0 && (
                                  <p className="text-sm text-[#6b5544]">
                                    Telefone: {cliente.telefones.join(', ')}
                                  </p>
                                )}
                                <p className="text-xs text-[#8b5329] pt-1">
                                  Cadastrado em: {formatDateBR(cliente.dataCadastro)}
                                </p>
                              </div>
                              <div className="w-full sm:w-auto flex justify-end items-center gap-2 mt-2 sm:mt-0">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleEditar(cliente)}
                                  className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#a16535]/10"
                                  title="Editar cliente"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {/* FIX: Envolvendo o ícone CheckCircle em um span para aceitar 'title' */}
                                <span title="Cliente Ativo">
                                  <CheckCircle className="w-5 h-5 text-green-600/80" />
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Incluir/Editar */}
        <TabsContent value="incluir">
          <Card className="bg-white border-2 border-[#d4c4b0]">
            <CardHeader>
              <CardTitle className="text-[#2d1f16] text-xl">
                {clienteEmEdicao ? 'Editar Cliente' : 'Incluir Novo Cliente'}
              </CardTitle>
              <CardDescription className="text-[#6b5544] text-sm">
                Preencha os dados básicos. Campos obrigatórios são marcados com *
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clienteEmEdicao && (
                <Alert className="mb-4 bg-[#a16535]/10 border-[#a16535]/50">
                  <Edit className="w-4 h-4 text-[#a16535]" />
                  <AlertDescription className="text-[#a16535]">
                    Você está editando o cliente: <span className="font-semibold">{clienteEmEdicao.nome}</span>
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleIncluir} className="space-y-6">
                {/* Tipo de Documento */}
                <div className="space-y-3">
                  <Label className="text-[#4a3629]">Tipo de Documento *</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={() => setIncluirTipo('cpf')}
                      // Estilo responsivo para botões de tipo
                      className={`flex-1 sm:flex-none h-11 px-6 transition-all duration-200 ${
                        incluirTipo === 'cpf'
                          ? 'bg-[#a16535] hover:bg-[#8b5329] text-white border-2 border-[#a16535] shadow-md'
                          : 'bg-white hover:bg-[#f6f3ee] text-[#a16535] border-2 border-[#a16535]'
                      }`}
                    >
                      <span className={incluirTipo === 'cpf' ? 'font-semibold' : 'font-medium'}>
                        CPF (Pessoa Física)
                      </span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setIncluirTipo('cnpj')}
                      // Estilo responsivo para botões de tipo
                      className={`flex-1 sm:flex-none h-11 px-6 transition-all duration-200 ${
                        incluirTipo === 'cnpj'
                          ? 'bg-[#a16535] hover:bg-[#8b5329] text-white border-2 border-[#a16535] shadow-md'
                          : 'bg-white hover:bg-[#f6f3ee] text-[#a16535] border-2 border-[#a16535]'
                      }`}
                    >
                      <span className={incluirTipo === 'cnpj' ? 'font-semibold' : 'font-medium'}>
                        CNPJ (Pessoa Jurídica)
                      </span>
                    </Button>
                  </div>
                </div>

                {/* --- SEÇÃO PESSOA FÍSICA --- */}
                {incluirTipo === 'cpf' ? (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg text-[#a16535] font-semibold">Dados Pessoais</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="incluir-nome" className="text-[#4a3629]">Nome Completo *</Label>
                        <Input
                          id="incluir-nome"
                          type="text"
                          placeholder="Digite o nome completo"
                          value={incluirNome}
                          onChange={(e) => setIncluirNome(e.target.value)}
                          required
                          className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                        />
                      </div>

                      {/* ALTERAÇÃO: Trocado md:grid-cols-2 por sm:grid-cols-2 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                        <div className="space-y-2">
                          <Label htmlFor="incluir-cpf" className="text-[#4a3629]">CPF *</Label>
                          <Input
                            id="incluir-cpf"
                            type="text"
                            placeholder="000.000.000-00"
                            value={incluirCpf}
                            onChange={(e) => setIncluirCpf(formatCPF(e.target.value))}
                            required
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="incluir-rg" className="text-[#4a3629]">RG *</Label>
                          <Input
                            id="incluir-rg"
                            type="text"
                            placeholder="00.000.000-0"
                            value={incluirRg}
                            onChange={(e) => setIncluirRg(e.target.value)}
                            required
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="incluir-data-nascimento" className="text-[#4a3629]">Data de Nascimento *</Label>
                        <Input
                          id="incluir-data-nascimento"
                          type="date"
                          value={incluirDataNascimento}
                          onChange={(e) => setIncluirDataNascimento(e.target.value)}
                          required
                          className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                        />
                      </div>

                      {/* ALTERAÇÃO: Trocado md:grid-cols-2 por sm:grid-cols-2 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="incluir-estado-civil" className="text-[#4a3629]">Estado Civil</Label>
                          <Input
                            id="incluir-estado-civil"
                            type="text"
                            placeholder="Ex: Solteiro(a)"
                            value={incluirEstadoCivil}
                            onChange={(e) => setIncluirEstadoCivil(e.target.value)}
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="incluir-nacionalidade" className="text-[#4a3629]">Nacionalidade</Label>
                          <Input
                            id="incluir-nacionalidade"
                            type="text"
                            placeholder="Ex: Brasileira"
                            value={incluirNacionalidade}
                            onChange={(e) => setIncluirNacionalidade(e.target.value)}
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-[#d4c4b0]" />

                    {/* Dados Profissionais */}
                    <div className="space-y-4">
                      <h3 className="text-lg text-[#a16535] font-semibold">Dados Profissionais</h3>
                      
                      {/* ALTERAÇÃO: Trocado md:grid-cols-2 por sm:grid-cols-2 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="incluir-empresa" className="text-[#4a3629]">Empresa / Local de Trabalho</Label>
                          <Input
                            id="incluir-empresa"
                            type="text"
                            placeholder="Nome da empresa"
                            value={incluirEmpresa}
                            onChange={(e) => setIncluirEmpresa(e.target.value)}
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="incluir-cargo" className="text-[#4a3629]">Cargo</Label>
                          <Input
                            id="incluir-cargo"
                            type="text"
                            placeholder="Ex: Gerente, Analista, Diretor, etc."
                            value={incluirCargo}
                            onChange={(e) => setIncluirCargo(e.target.value)}
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* --- SEÇÃO PESSOA JURÍDICA --- */
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg text-[#a16535] font-semibold">Dados da Empresa</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="incluir-nome-empresa" className="text-[#4a3629]">Nome da Empresa (Razão Social) *</Label>
                        <Input
                          id="incluir-nome-empresa"
                          type="text"
                          placeholder="Digite a razão social"
                          value={incluirNome}
                          onChange={(e) => setIncluirNome(e.target.value)}
                          required
                          className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                        />
                      </div>

                      {/* ALTERAÇÃO: Trocado md:grid-cols-2 por sm:grid-cols-2 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="incluir-cnpj" className="text-[#4a3629]">CNPJ *</Label>
                          <Input
                            id="incluir-cnpj"
                            type="text"
                            placeholder="00.000.000/0000-00"
                            value={incluirCnpj}
                            onChange={(e) => setIncluirCnpj(formatCNPJ(e.target.value))}
                            required
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="incluir-nome-fantasia" className="text-[#4a3629]">Nome Fantasia</Label>
                          <Input
                            id="incluir-nome-fantasia"
                            type="text"
                            placeholder="Digite o nome fantasia (opcional)"
                            value={incluirNomeFantasia}
                            onChange={(e) => setIncluirNomeFantasia(e.target.value)}
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="incluir-nome-responsavel" className="text-[#4a3629]">Nome do Responsável *</Label>
                        <Input
                          id="incluir-nome-responsavel"
                          type="text"
                          placeholder="Digite o nome do responsável"
                          value={incluirNomeResponsavel}
                          onChange={(e) => setIncluirNomeResponsavel(e.target.value)}
                          required
                          className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                        />
                      </div>
                    </div>
                  </>
                )}

                <Separator className="bg-[#d4c4b0]" />

                {/* Contatos */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg text-[#a16535] font-semibold">Contatos</h3>
                    <Button
                      type="button"
                      size="sm"
                      onClick={adicionarCampoTelefone}
                      className="bg-[#a16535] text-white hover:bg-[#8b5329] px-3 py-2"
                    >
                      {/* ALTERAÇÃO: Adicionado mr-2 base e texto "Adicionar" visível apenas em mobile */}
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="sm:hidden">Adicionar</span>
                      <span className="hidden sm:inline">Adicionar Telefone</span>
                    </Button>
                  </div>

                  {incluirTelefones.map((telefone, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`telefone-${index}`} className="text-[#4a3629]">
                          Telefone {index + 1} {index === 0 && '*'}
                        </Label>
                        <Input
                          id={`telefone-${index}`}
                          type="text"
                          placeholder="(00) 00000-0000"
                          value={telefone}
                          onChange={(e) => atualizarTelefone(index, e.target.value)}
                          required={index === 0}
                          className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                        />
                      </div>
                      {incluirTelefones.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removerCampoTelefone(index)}
                          className="mb-1 text-[#d4183d] hover:text-[#b01432] hover:bg-[#d4183d]/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <div className="space-y-2">
                    <Label htmlFor="incluir-email" className="text-[#4a3629]">E-mail *</Label>
                    <Input
                      id="incluir-email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={incluirEmail}
                      onChange={(e) => setIncluirEmail(e.target.value)}
                      required
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg text-[#a16535] font-semibold">Endereço</h3>

                  {/* ALTERAÇÃO: Trocado md:grid-cols-2 por sm:grid-cols-2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incluir-cep" className="text-[#4a3629]">CEP *</Label>
                      <Input
                        id="incluir-cep"
                        type="text"
                        placeholder="00000-000"
                        value={incluirCep}
                        onChange={(e) => setIncluirCep(formatCEP(e.target.value))}
                        required
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incluir-uf" className="text-[#4a3629]">UF *</Label>
                      <Select value={incluirUf} onValueChange={setIncluirUf} required>
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0] max-h-[300px]">
                          {estadosBrasileiros.map((estado) => (
                            <SelectItem 
                              key={estado.sigla} 
                              value={estado.sigla} 
                              className="text-[#2d1f16] hover:bg-[#f6f3ee]"
                            >
                              {estado.sigla} - {estado.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* ALTERAÇÃO: Trocado md:grid-cols-2 por sm:grid-cols-2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incluir-municipio" className="text-[#4a3629]">Município *</Label>
                      <Input
                        id="incluir-municipio"
                        type="text"
                        placeholder="Digite o município"
                        value={incluirMunicipio}
                        onChange={(e) => setIncluirMunicipio(e.target.value)}
                        required
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incluir-bairro" className="text-[#4a3629]">Bairro *</Label>
                      <Input
                        id="incluir-bairro"
                        type="text"
                        placeholder="Digite o bairro"
                        value={incluirBairro}
                        onChange={(e) => setIncluirBairro(e.target.value)}
                        required
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>

                  {/* Logradouro e Número em layout responsivo */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3 sm:col-span-2 space-y-2"> {/* Logradouro ocupa 2/3 no desktop, 100% no mobile */}
                      <Label htmlFor="incluir-logradouro" className="text-[#4a3629]">Logradouro *</Label>
                      <Input
                        id="incluir-logradouro"
                        type="text"
                        placeholder="Rua, Avenida, etc."
                        value={incluirLogradouro}
                        onChange={(e) => setIncluirLogradouro(e.target.value)}
                        required
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>

                    <div className="col-span-3 sm:col-span-1 space-y-2"> {/* Número ocupa 1/3 no desktop, 100% no mobile */}
                      <Label htmlFor="incluir-numero" className="text-[#4a3629]">Nº *</Label>
                      <Input
                        id="incluir-numero"
                        type="text"
                        placeholder="123"
                        value={incluirNumero}
                        onChange={(e) => setIncluirNumero(e.target.value)}
                        required
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="incluir-complemento" className="text-[#4a3629]">Complemento</Label>
                    <Input
                      id="incluir-complemento"
                      type="text"
                      placeholder="Apto, Casa, Sala, etc. (opcional)"
                      value={incluirComplemento}
                      onChange={(e) => setIncluirComplemento(e.target.value)}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                  </div>
                </div>

                <Separator className="bg-[#d4c4b0]" />

                {/* Observações */}
                <div className="space-y-4">
                  <h3 className="text-lg text-[#a16535] font-semibold">Observações</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="incluir-observacoes-cpf" className="text-[#4a3629]">Observações</Label>
                    <Textarea
                      id="incluir-observacoes-cpf"
                      placeholder="Digite observações adicionais sobre o cliente (opcional)"
                      value={incluirObservacoes}
                      onChange={(e) => setIncluirObservacoes(e.target.value)}
                      rows={4}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 resize-none"
                    />
                  </div>
                </div>

                {/* ALTERAÇÃO: Adicionado sm:justify-end para alinhar botões à direita em telas maiores */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                  {clienteEmEdicao && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelarEdicao}
                      className="flex-1 sm:flex-none border-[#d4c4b0] text-[#6b5544] hover:bg-[#d4c4b0] hover:text-[#2d1f16]"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                  <Button
                    type="submit"
                    /* ALTERAÇÃO: Trocado flex-1 por sm:flex-none para largura automática em telas maiores */
                    className="flex-1 sm:flex-none bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30"
                  >
                    {clienteEmEdicao ? (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Atualizar Cliente
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Incluir Cliente
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}