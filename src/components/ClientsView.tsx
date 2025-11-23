import { useMemo, useState } from 'react';
import { Search, UserPlus, Users, CheckCircle, X, Plus, Edit, ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { formatCPF, formatCNPJ, formatDateTimeBR, formatPhone, formatCEP, normalize } from '@/utils/formatters';
import { states } from '@/utils/states';
import { AppView } from '@/types/navigation';
import { useClients, Client, NewClientInput } from '@/contexts/ClientsContext';
import { useAppStore } from '@/store/useAppStore';

interface ClientsViewProps {
  onNavigate: (view: AppView) => void;
}

export function ClientsView({ onNavigate }: ClientsViewProps) {
  const { addClientMutation, updateClientMutation, clients } = useClients();

  const { clientsTab, setClientsTab } = useAppStore();

  // Search state
  const [searchName, setSearchName] = useState("");
  const [searchCPF, setSearchCPF] = useState("");
  const [searchCNPJ, setSearchCNPJ] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const filteredClients = useMemo(() => {
    if (!searchName && !searchCPF && !searchCNPJ) {
      return [];
    }

    const name = normalize(searchName);

    return clients.filter(client => {
      const matchesName =
        searchName &&
        normalize(client.name).includes(name);

      const matchesCPF = searchCPF && client.document === searchCPF;
      const matchesCNPJ = searchCNPJ && client.document === searchCNPJ;

      return matchesName || matchesCPF || matchesCNPJ;
    });
  }, [clients, searchName, searchCPF, searchCNPJ]);


  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
  };

  // Edit state
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form fields
  const [clientType, setClientType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [name, setName] = useState('');
  const [cpf, setCPF] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [nationality, setNationality] = useState('');
  const [profession, setProfession] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [cnpj, setCNPJ] = useState('');
  const [fantasyName, setFantasyName] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [phones, setPhones] = useState<string[]>(['']);
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');

  // Phone handlers
  const addPhoneField = () => setPhones([...phones, '']);
  const removePhoneField = (index: number) => {
    const updated = phones.filter((_, i) => i !== index);
    setPhones(updated.length ? updated : ['']);
  };
  const updatePhone = (index: number, value: string) => {
    const updated = [...phones];
    updated[index] = formatPhone(value);
    setPhones(updated);
  };

  // Add/Edit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filteredPhones = phones.filter(p => p.trim() !== '');

    const clientData: NewClientInput = {
      name,
      document: clientType === 'CPF' ? cpf : cnpj,
      type: clientType,
      phones: filteredPhones,
      email,
      address: {
        zipCode,
        state,
        city,
        neighborhood,
        street,
        number,
        complement,
      },
      ...(clientType === 'CPF' && {
        birthDate,
        maritalStatus,
        nationality,
        profession,
        company,
        position,
      }),
      ...(clientType === 'CNPJ' && {
        fantasyName,
        responsibleName,
      }),
    };

    if (editingClient && !!editingClient.id) {
      updateClientMutation.mutate({ id: editingClient.id, client: clientData }, {
        onSuccess: () => {
          setEditingClient(null);
          clearForm();
          setClientsTab("list");
        }
      });

    } else {
      addClientMutation.mutate(clientData, {
        onSuccess: () => {
          clearForm();
          setClientsTab("list");
        }
      });
    }
  };

  const handleUpdate = (client: Client) => {
    setEditingClient(client);
    setClientType(client.type);
    setName(client.name);
    setEmail(client.email || '');
    setPhones(client.phones ? client.phones : ['']);
    setZipCode(client.address?.zipCode || '');
    setState(client.address?.state || '');
    setCity(client.address?.city || '');
    setNeighborhood(client.address?.neighborhood || '');
    setStreet(client.address?.street || '');
    setNumber(client.address?.number || '');
    setComplement(client.address?.complement || '');

    if (client.type === 'CPF') {
      setCPF(client.document || '');
      setBirthDate(client.birthDate || '');
      setMaritalStatus(client.maritalStatus || '');
      setNationality(client.nationality || '');
      setProfession(client.occupation || '');
      // setCompany(client.company || '');
      // setPosition(client.position || '');
    } else {
      setCNPJ(client.document || '');
      setFantasyName(client.fantasyName || '');
      setResponsibleName(client.representativeName || '');
    }

    setClientsTab('form');
  };

  const cancelEdit = () => {
    setEditingClient(null);
    clearForm();
  };

  const clearForm = () => {
    setName('');
    setCPF('');
    setBirthDate('');
    setMaritalStatus('');
    setNationality('');
    setProfession('');
    setCompany('');
    setPosition('');
    setCNPJ('');
    setFantasyName('');
    setResponsibleName('');
    setPhones(['']);
    setEmail('');
    setZipCode('');
    setState('');
    setCity('');
    setNeighborhood('');
    setStreet('');
    setNumber('');
    setComplement('');
  };

  const clearSearch = () => {
    setSearchCPF('');
    setSearchCNPJ('');
    setSearchName('');
    setSearchPerformed(false);
  };

  return (
    <div className="max-w-xl mx-auto md:max-w-4xl px-4 sm:px-0">
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
            onClick={() => onNavigate("home")}
            className="w-full sm:w-auto !bg-white !text-[#a16535] border-2 border-[#955d30] hover:!bg-[#a16535] hover:!text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Página Inicial
          </Button>
        </div>
      </div>

      <Tabs value={clientsTab} onValueChange={(value) => setClientsTab(value as 'list' | 'form')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#f6f3ee] border-2 border-[#d4c4b0] p-1 rounded-full h-11 sm:h-14">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full h-full transition-all text-sm"
          >
            <Search className="w-4 h-4 mr-2" />
            <span className="sm:hidden">Consultar</span>
            <span className="hidden sm:inline">Consultar Cliente</span>
          </TabsTrigger>
          <TabsTrigger
            value="form"
            className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full h-full transition-all text-sm"
          >
            {editingClient ? <Edit className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
            <span className="sm:hidden">{editingClient ? 'Editar' : 'Incluir'}</span>
            <span className="hidden sm:inline">{editingClient ? 'Editar Cliente' : 'Incluir Cliente'}</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Consultar */}
        <TabsContent value="list">
          <Card className="bg-white border-2 border-[#d4c4b0]">
            <CardHeader>
              <CardTitle className="text-[#2d1f16]">Consultar Cliente</CardTitle>
              <CardDescription className="text-[#6b5544]">
                Informe pelo menos um dos campos abaixo para realizar a consulta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                {/* Inputs de consulta empilhados em mobile */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="consulta-cpf" className="text-[#4a3629]">CPF</Label>
                    <Input
                      id="consulta-cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={searchCPF}
                      onChange={(e) => setSearchCPF(formatCPF(e.target.value))}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consulta-cnpj" className="text-[#4a3629]">CNPJ</Label>
                    <Input
                      id="consulta-cnpj"
                      type="text"
                      placeholder="00.000.000/0000-00"
                      value={searchCNPJ}
                      onChange={(e) => setSearchCNPJ(formatCNPJ(e.target.value))}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consulta-name" className="text-[#4a3629]">Nome</Label>
                    <Input
                      id="consulta-name"
                      type="text"
                      placeholder="Digite o nome do cliente"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
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
                  {searchPerformed && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearSearch}
                      className="flex-1 bg-[#f6f3ee] border-[#d4c4b0] text-[#6b5544] hover:bg-[#d4c4b0] hover:text-[#2d1f16]"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpar
                    </Button>
                  )}
                </div>
              </form>

              {/* Resultados da Consulta */}
              {searchPerformed && (
                <div className="mt-6 pt-6 border-t border-[#d4c4b0]">
                  <h3 className="text-[#2d1f16] mb-4 text-lg">
                    Resultados da Consulta ({filteredClients.length})
                  </h3>

                  {filteredClients.length === 0 ? (
                    <Alert className="bg-[#a16535]/10 border-[#a16535]/30">
                      <AlertDescription className="text-[#4a3629]">
                        Nenhum cliente encontrado com os critérios informados.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {filteredClients.map((client) => (
                        <Card key={client.id} className="bg-[#a16535]/5 border-[#d4c4b0]">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                              <div className="flex-1 space-y-1">
                                <p className="text-[#2d1f16] font-semibold">{client.name}</p>
                                <p className="text-sm text-[#6b5544]">
                                  {client.type}: {client.document}
                                </p>
                                {client.type === 'CPF' && (
                                  <>
                                    {/* @ts-ignore - Propriedades específicas de PF */}
                                    {client.maritalStatus && (
                                      <p className="text-sm text-[#6b5544]">Estado Civil: {client.maritalStatus}</p>
                                    )}
                                    {/* @ts-ignore */}
                                    {client.occupation && (
                                      <p className="text-sm text-[#6b5544]">Profissão: {client.occupation}</p>
                                    )}
                                  </>
                                )}
                                {client.email && (
                                  <p className="text-sm text-[#6b5544]">E-mail: {client.email}</p>
                                )}
                                {client.phones && client.phones.length > 0 && (
                                  <p className="text-sm text-[#6b5544]">
                                    Telefone: {client.phones.join(', ')}
                                  </p>
                                )}
                                {client.createdAt && (
                                  <p className="text-xs text-[#8b5329] pt-1">
                                    Cadastrado em: {formatDateTimeBR(client.createdAt.toISOString())}
                                  </p>)
                                }
                              </div>
                              <div className="w-full sm:w-auto flex justify-end items-center gap-2 mt-2 sm:mt-0">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleUpdate(client)}
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
        <TabsContent value="form">
          <Card className="bg-white border-2 border-[#d4c4b0]">
            <CardHeader>
              <CardTitle className="text-[#2d1f16] text-xl">
                {editingClient ? 'Editar Cliente' : 'Incluir Novo Cliente'}
              </CardTitle>
              <CardDescription className="text-[#6b5544] text-sm">
                Preencha os dados básicos. Campos obrigatórios são marcados com *
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editingClient && (
                <Alert className="mb-4 bg-[#a16535]/10 border-[#a16535]/50">
                  <Edit className="w-4 h-4 text-[#a16535]" />
                  <AlertDescription className="text-[#a16535]">
                    Você está editando o cliente: <span className="font-semibold">{editingClient.name}</span>
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de Documento */}
                <div className="space-y-3">
                  <Label className="text-[#4a3629]">Tipo de Documento *</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={() => setClientType('CPF')}
                      // Estilo responsivo para botões de tipo
                      className={`flex-1 sm:flex-none h-11 px-6 transition-all duration-200 ${clientType === 'CPF'
                        ? 'bg-[#a16535] hover:bg-[#8b5329] text-white border-2 border-[#a16535] shadow-md'
                        : 'bg-white hover:bg-[#f6f3ee] text-[#a16535] border-2 border-[#a16535]'
                        }`}
                    >
                      <span className={clientType === 'CPF' ? 'font-semibold' : 'font-medium'}>
                        CPF (Pessoa Física)
                      </span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setClientType('CNPJ')}
                      // Estilo responsivo para botões de tipo
                      className={`flex-1 sm:flex-none h-11 px-6 transition-all duration-200 ${clientType === 'CNPJ'
                        ? 'bg-[#a16535] hover:bg-[#8b5329] text-white border-2 border-[#a16535] shadow-md'
                        : 'bg-white hover:bg-[#f6f3ee] text-[#a16535] border-2 border-[#a16535]'
                        }`}
                    >
                      <span className={clientType === 'CNPJ' ? 'font-semibold' : 'font-medium'}>
                        CNPJ (Pessoa Jurídica)
                      </span>
                    </Button>
                  </div>
                </div>

                {/* --- SEÇÃO PESSOA FÍSICA --- */}
                {clientType === 'CPF' ? (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg text-[#a16535] font-semibold">Dados Pessoais</h3>

                      <div className="space-y-2">
                        <Label htmlFor="incluir-name" className="text-[#4a3629]">Nome Completo *</Label>
                        <Input
                          id="incluir-name"
                          type="text"
                          placeholder="Digite o nome completo"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                            value={cpf}
                            onChange={(e) => setCPF(formatCPF(e.target.value))}
                            required
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>

                        {/*
                        <div className="space-y-2">
                          <Label htmlFor="incluir-rg" className="text-[#4a3629]">RG *</Label>
                          <Input
                            id="incluir-rg"
                            type="text"
                            placeholder="00.000.000-0"
                            value={rg}
                            onChange={(e) => setRG(e.target.value)}
                            required
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>
                        */}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="incluir-data-nascimento" className="text-[#4a3629]">Data de Nascimento *</Label>
                        <Input
                          id="incluir-data-nascimento"
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          required
                          className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="incluir-state-civil" className="text-[#4a3629]">Estado Civil</Label>
                          <Input
                            id="incluir-state-civil"
                            type="text"
                            placeholder="Ex: Solteiro(a)"
                            value={maritalStatus}
                            onChange={(e) => setMaritalStatus(e.target.value)}
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="incluir-nacionalidade" className="text-[#4a3629]">Nacionalidade</Label>
                          <Input
                            id="incluir-nacionalidade"
                            type="text"
                            placeholder="Ex: Brasileira"
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-[#d4c4b0]" />

                    {/* Dados Profissionais */}
                    {/*
                    <div className="space-y-4">
                      <h3 className="text-lg text-[#a16535] font-semibold">Dados Profissionais</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="incluir-empresa" className="text-[#4a3629]">Empresa / Local de Trabalho</Label>
                          <Input
                            id="incluir-empresa"
                            type="text"
                            placeholder="Nome da empresa"
                            value={}
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
                    */}
                  </>
                ) : (
                  /* --- SEÇÃO PESSOA JURÍDICA --- */
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg text-[#a16535] font-semibold">Dados da Empresa</h3>

                      <div className="space-y-2">
                        <Label htmlFor="incluir-name-empresa" className="text-[#4a3629]">Nome da Empresa (Razão Social) *</Label>
                        <Input
                          id="incluir-name-empresa"
                          type="text"
                          placeholder="Digite a razão social"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                            value={cnpj}
                            onChange={(e) => setCNPJ(formatCNPJ(e.target.value))}
                            required
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="incluir-name-fantasia" className="text-[#4a3629]">Nome Fantasia</Label>
                          <Input
                            id="incluir-name-fantasia"
                            type="text"
                            placeholder="Digite o name fantasia (opcional)"
                            value={fantasyName}
                            onChange={(e) => setFantasyName(e.target.value)}
                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="incluir-name-responsavel" className="text-[#4a3629]">Nome do Responsável *</Label>
                        <Input
                          id="incluir-name-responsavel"
                          type="text"
                          placeholder="Digite o name do responsável"
                          value={responsibleName}
                          onChange={(e) => setResponsibleName(e.target.value)}
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
                      onClick={addPhoneField}
                      className="bg-[#a16535] text-white hover:bg-[#8b5329] px-3 py-2"
                    >
                      {/* ALTERAÇÃO: Adicionado mr-2 base e texto "Adicionar" visível apenas em mobile */}
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="sm:hidden">Adicionar</span>
                      <span className="hidden sm:inline">Adicionar Telefone</span>
                    </Button>
                  </div>

                  {phones.map((phone, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`telefone-${index}`} className="text-[#4a3629]">
                          Telefone {index + 1} {index === 0 && '*'}
                        </Label>
                        <Input
                          id={`telefone-${index}`}
                          type="text"
                          placeholder="(00) 00000-0000"
                          value={phone}
                          onChange={(e) => updatePhone(index, e.target.value)}
                          required={index === 0}
                          className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                        />
                      </div>
                      {phones.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePhoneField(index)}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                        value={zipCode}
                        onChange={(e) => setZipCode(formatCEP(e.target.value))}
                        required
                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incluir-uf" className="text-[#4a3629]">UF *</Label>
                      <Select value={state} onValueChange={setState} required>
                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#d4c4b0] max-h-[300px]">
                          {states.map((state) => (
                            <SelectItem
                              key={state.acronym}
                              value={state.acronym}
                              className="text-[#2d1f16] hover:bg-[#f6f3ee]"
                            >
                              {state.acronym} - {state.name}
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
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
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
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
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
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
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
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
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
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                    />
                  </div>
                </div>

                {/* Observações
                <Separator className="bg-[#d4c4b0]" />

                <div className="space-y-4">
                  <h3 className="text-lg text-[#a16535] font-semibold">Observações</h3>

                  <div className="space-y-2">
                    <Label htmlFor="incluir-observacoes-cpf" className="text-[#4a3629]">Observações</Label>
                    <Textarea
                      id="incluir-observacoes-cpf"
                      placeholder="Digite observações adicionais sobre o cliente (opcional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 resize-none"
                    />
                  </div>
                </div>
                */}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                  {editingClient && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                      className="flex-1 sm:flex-none border-[#d4c4b0] text-[#6b5544] hover:bg-[#d4c4b0] hover:text-[#2d1f16]"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="flex-1 sm:flex-none bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30"
                  >
                    {editingClient ? (
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
