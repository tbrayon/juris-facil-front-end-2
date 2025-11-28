import { useEffect, useState } from 'react';
import { FileText, Search, AlertCircle, X, Settings } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { TabsContent } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { formatCurrency, formatNumeroProcesso, formatCPF, formatCNPJ, convertToIsoDate } from '@/utils/formatters'
import { Expense, Notification, Process, ProcessInput, useProcess, useProcesses } from '@/contexts/ProcessesContext';
import { states } from '@/utils/states';
import { useProceduralStages } from '@/contexts/ProceduralStagesContext';
import { Client, useClients } from '@/contexts/ClientsContext';
import { SelectData, SelectFields, ManageSelectOptions } from './ManageSelectOptions';
import { useStatus } from '@/contexts/StatusContext';
import { useCompetencies } from '@/contexts/CompetenciesContext';
import { useCourtTypes } from '@/contexts/CourtTypesContext';
import { useCourts } from '@/contexts/CourtsContext';
import { useJurisdictions } from '@/contexts/JurisdictionsContext';
import { toast } from 'sonner';
import { Notifications } from './Notifications';
import { useAppStore } from '@/store/useAppStore';
import { Expenses } from './Expenses';

interface ProcessFormProps {
    setActiveTab: (tab: "add" | "search") => void
}

export function ProcessForm({ setActiveTab }: ProcessFormProps) {
    const { addProcessMutation, updateProcessMutation } = useProcesses();
    const { clients } = useClients();

    const { status } = useStatus();
    const { courtTypes } = useCourtTypes();
    const { courts } = useCourts();
    const { jurisdictions } = useJurisdictions();
    const { competencies } = useCompetencies();
    const { proceduralStages } = useProceduralStages();

    const [documentType, setDocumentType] = useState<"CPF" | "CNPJ">("CPF");
    const [documentSearch, setDocumentSearch] = useState("");
    const [selectedClient, setSelectedClient] = useState<Client>();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const { selectedProcess, setSelectedProcess } = useAppStore();
    const { data: editingProcess } = useProcess(selectedProcess);


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const client = clients.find(item => item.document === documentSearch);

        setSelectedClient(client);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedClient) {
            const payloadNotifications = notifications.map((n) => ({
                ...n,
                sentAt: convertToIsoDate(n.sentAt),
                receivedAt: convertToIsoDate(n.receivedAt),
            }));

            const data: { process: ProcessInput, notifications: Notification[], expenses: Expense[] } = {
                process: {
                    client: selectedClient.id,
                    processNumber,
                    distributionDate: distributionDate || null,
                    proceduralHub,
                    opposingParty,
                    actionType,
                    actionObject,
                    claimValue,
                    proceduralStage,
                    courtType,
                    court,
                    state,
                    jurisdiction,
                    branch,
                    competence,
                    district,
                    status: processStatus,
                    priority,
                    responsibleAttorney,
                    nextDeadline: nextDeadline || null,
                    processLink,
                    note,

                },
                notifications: payloadNotifications,
                expenses,
            };

            console.log(data);

            if (selectedProcess) {
                updateProcessMutation.mutate({ id: selectedProcess, data }, {
                    onSuccess: () => {
                        setSelectedProcess(null);
                        clearForm();
                        setActiveTab("search");
                    }
                });

            } else {
                addProcessMutation.mutate(data, {
                    onSuccess: () => {
                        clearForm();
                        setActiveTab("search");
                    }
                });
            }
        }
    };

    // TODO: Make these into tables
    const [proceduralHubs] = useState([
        'Autor / Requerente / Reclamante',
        'Réu / Requerido / Reclamado',
        'Terceiro Interessado',
    ].sort((a, b) => a.localeCompare(b, 'pt-BR')));

    const [actionTypes] = useState([
        'Ação Civil Pública',
        'Ação de Alimentos',
        'Ação de Cobrança',
        'Ação de Despejo',
        'Ação de Divórcio',
        'Ação de Indenização',
        'Ação Trabalhista',
        'Execução Fiscal',
        'Habeas Corpus',
        'Mandado de Segurança',
    ].sort((a, b) => a.localeCompare(b, 'pt-BR')));

    // Process data
    const [processNumber, setProcessNumber] = useState("");
    const [distributionDate, setDistributionDate] = useState("");
    const [responsibleAttorney, setResponsibleAttorney] = useState("");
    const [proceduralHub, setProceduralHub] = useState("");
    const [opposingParty, setOpposingParty] = useState("");
    const [actionType, setActionType] = useState("");
    const [actionObject, setActionObject] = useState("");
    const [claimValue, setClaimValue] = useState("");
    const [proceduralStage, setProceduralStage] = useState("");
    const [courtType, setCourtType] = useState("");
    const [court, setCourt] = useState("");
    const [state, setState] = useState("");

    const [district, setDistrict] = useState("");
    const [branch, setBranch] = useState("");
    const [jurisdiction, setJurisdiction] = useState("");
    const [competence, setCompetence] = useState("");

    const [processStatus, setProcessStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [nextDeadline, setNextDeadline] = useState("");
    const [processLink, setProcessLink] = useState("");
    const [note, setProcessNotes] = useState("");

    useEffect(() => {
        if (editingProcess) {
            handleEditProcess(editingProcess);
            setActiveTab('add');
            toast.info('Processo carregado para edição');
        }
    }, [editingProcess]);

    const handleEditProcess = (process: Process) => {
        setSelectedClient(process.client);

        setProcessNumber(process.processNumber || "");
        setDistributionDate(process.distributionDate || "");
        setResponsibleAttorney(process.responsibleAttorney || "");
        setProceduralHub(process.proceduralHub || "");
        setOpposingParty(process.opposingParty || "");
        setActionType(process.actionType || "");
        setActionObject(process.actionObject || "");
        setClaimValue(process.claimValue || "");
        setProceduralStage(process.proceduralStage?.id || "");
        setCourtType(process.courtType?.id || "");
        setCourt(process.court?.id || "");
        setState(process.state || "");

        setDistrict(process.district || "");
        setBranch(process.branch || "");
        setJurisdiction(process.jurisdiction?.id || "");
        setCompetence(process.competence?.id || "");

        setProcessStatus(process.status?.id || "");
        setPriority(process.priority || "");
        setNextDeadline(process.nextDeadline || "");
        setProcessLink(process.processLink || "");
        setProcessNotes(process.note || "");

        setExpenses(process.expenses || []);
        setNotifications(process.notifications || []);

    }


    const clearForm = () => {
        setProcessNumber("");
        setDistributionDate("");
        setResponsibleAttorney("");
        setProceduralHub("");
        setOpposingParty("");
        setActionType("");
        setActionObject("");
        setClaimValue("");
        setProceduralStage("");
        setCourtType("");
        setCourt("");
        setState("");

        setDistrict("");
        setBranch("");
        setJurisdiction("");
        setCompetence("");

        setProcessStatus("");
        setPriority("");
        setNextDeadline("");
        setProcessLink("");
        setProcessNotes("");

        setExpenses([]);
        setNotifications([]);
    };


    const [managementDialogOpen, setManagementDialogOpen] = useState(false)
    const [fieldToManage, setFieldToManage] = useState<SelectFields | undefined>()
    const [fieldData, setFieldData] = useState<SelectData[]>([])

    const openManagementDialog = (field: SelectFields, data: SelectData[]) => {
        setFieldToManage(field);
        setFieldData(data);

        setManagementDialogOpen(true);
    }

    return (
        <>
            <ManageSelectOptions
                isOpen={managementDialogOpen}
                setIsOpen={setManagementDialogOpen}
                field={fieldToManage}
                data={fieldData}
            />
            <TabsContent value="add">
                <Card className="bg-white border-[#d4c4b0]">
                    <CardHeader>
                        <CardTitle className="text-[#2d1f16]">
                            {editingProcess ? 'Editar Processo' : 'Novo Processo'}
                        </CardTitle>
                        <CardDescription className="text-[#6b5544]">
                            {editingProcess
                                ? 'Atualize as informações do processo'
                                : 'Primeiro, pesquise o cliente pelo CPF ou CNPJ para vincular ao processo'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {editingProcess && (
                            <Alert className="mb-6 bg-[#a16535]/10 border-[#a16535]/50">
                                <AlertCircle className="w-4 h-4 text-[#a16535]" />
                                <AlertDescription className="text-[#a16535] flex items-center justify-between">
                                    <span>Você está editando o processo: <strong>{editingProcess.processNumber}</strong></span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedProcess(null);
                                            clearForm();
                                        }}
                                        className="text-[#a16535] hover:text-[#8b5329]"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Cancelar Edição
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Pesquisa de Cliente */}
                        <div className="space-y-4 mb-6 pb-6 border-b border-[#d4c4b0]">
                            <h3 className="text-[#a16535]">Vincular Cliente</h3>

                            <div className="space-y-2">
                                <Label className="text-[#4a3629]">Tipo de Documento</Label>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => setDocumentType('CPF')}
                                        className={`h-10 px-6 transition-all duration-200 ${documentType === 'CPF'
                                            ? 'bg-[#a16535] hover:bg-[#8b5329] text-white border-2 border-[#a16535] shadow-md'
                                            : 'bg-white hover:bg-[#f6f3ee] text-[#a16535] border-2 border-[#a16535]'
                                            }`}
                                    >
                                        <span className={documentType === 'CPF' ? 'font-semibold' : 'font-medium'}>
                                            CPF
                                        </span>
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setDocumentType('CNPJ')}
                                        className={`h-10 px-6 transition-all duration-200 ${documentType === 'CNPJ'
                                            ? 'bg-[#a16535] hover:bg-[#8b5329] text-white border-2 border-[#a16535] shadow-md'
                                            : 'bg-white hover:bg-[#f6f3ee] text-[#a16535] border-2 border-[#a16535]'
                                            }`}
                                    >
                                        <span className={documentType === 'CNPJ' ? 'font-semibold' : 'font-medium'}>
                                            CNPJ
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="documento-pesquisa" className="text-[#4a3629]">
                                    {documentType}
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="documento-pesquisa"
                                        type="text"
                                        placeholder={documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                                        value={documentSearch}
                                        onChange={(e) => {
                                            const formatted = documentType === 'CPF'
                                                ? formatCPF(e.target.value)
                                                : formatCNPJ(e.target.value);
                                            setDocumentSearch(formatted);
                                        }}
                                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleSearch}
                                        className="bg-[#a16535] hover:bg-[#8b5329] text-white"
                                    >
                                        <Search className="w-4 h-4 mr-2" />
                                        Pesquisar
                                    </Button>
                                </div>
                            </div>

                            {selectedClient && (
                                <Alert className="bg-green-500/10 border-green-500/50">
                                    <AlertDescription className="text-green-500">
                                        <strong>Cliente selecionado:</strong> {selectedClient.name} - {selectedClient.document}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Formulário do Processo */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-[#a16535]">Dados do Processo</h3>

                                {/* Informações Básicas */}
                                <Alert className="bg-blue-50 border-blue-200">
                                    <AlertCircle className="h-4 w-4 text-blue-600" />
                                    <AlertDescription className="text-blue-800 text-sm">
                                        <strong>Processo Pré-processual:</strong> O número do processo é opcional. Para processos ainda não ajuizados, deixe o campo vazio e selecione o status "Em elaboração" ou "Pendente de distribuição". Após ajuizar, edite o processo para adicionar o número.
                                    </AlertDescription>
                                </Alert>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="numero-processo" className="text-[#4a3629]">
                                                Número do Processo <span className="text-[#6b5544] text-sm">(opcional)</span>
                                            </Label>
                                        </div>
                                        <Input
                                            id="numero-processo"
                                            type="text"
                                            placeholder="0000000-00.0000.0.00.0000 (deixe vazio se ainda não ajuizado)"
                                            value={processNumber}
                                            onChange={(e) => setProcessNumber(formatNumeroProcesso(e.target.value))}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="data-distribuicao" className="text-[#4a3629]">
                                                Data de Distribuição/Ajuizamento <span className="text-[#6b5544] text-sm">(opcional)</span>
                                            </Label>
                                        </div>
                                        <Input
                                            id="data-distribuicao"
                                            type="date"
                                            value={distributionDate}
                                            onChange={(e) => setDistributionDate(e.target.value)}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="h-6 flex items-center">
                                        <Label htmlFor="advogado-responsavel" className="text-[#4a3629]">
                                            Advogado Responsável
                                        </Label>
                                    </div>
                                    <Input
                                        id="advogado-responsavel"
                                        type="text"
                                        placeholder="Nome do advogado"
                                        value={responsibleAttorney}
                                        onChange={(e) => setResponsibleAttorney(e.target.value)}
                                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                    />
                                </div>
                            </div>

                            <Separator className="bg-[#d4c4b0]" />

                            {/* PARTES E TIPO DE AÇÃO */}
                            <div className="space-y-4">
                                <h3 className="text-[#a16535]">Partes e Tipo de Ação</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between h-6">
                                            <Label htmlFor="polo" className="text-[#4a3629]">
                                                Polo Processual
                                            </Label>
                                        </div>
                                        <Select
                                            value={proceduralHub}
                                            onValueChange={(value) => {
                                                setProceduralHub(value);
                                            }}
                                        >
                                            <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                                                <SelectValue placeholder="Selecione o polo" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#d4c4b0]">
                                                {proceduralHubs.map((option) => (
                                                    <SelectItem key={option} value={option} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="parte-contraria" className="text-[#4a3629]">
                                                Parte Contrária
                                            </Label>
                                        </div>
                                        <Input
                                            id="parte-contraria"
                                            type="text"
                                            placeholder="Nome da parte adversa"
                                            value={opposingParty}
                                            onChange={(e) => setOpposingParty(e.target.value)}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between h-6">
                                            <Label htmlFor="tipo-acao" className="text-[#4a3629]">
                                                Tipo de Ação
                                            </Label>
                                        </div>
                                        <Select
                                            value={actionType}
                                            onValueChange={(value) => {
                                                setActionType(value);
                                            }}
                                        >
                                            <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                                                <SelectValue placeholder="Selecione o tipo de ação" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#d4c4b0]">
                                                {actionTypes.map((option) => (
                                                    <SelectItem key={option} value={option} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="valor-causa" className="text-[#4a3629]">
                                                Valor da Causa
                                            </Label>
                                        </div>
                                        <Input
                                            id="valor-causa"
                                            type="text"
                                            placeholder="R$ 0,00"
                                            value={claimValue}
                                            onChange={(e) => setClaimValue(formatCurrency(e.target.value))}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="objeto-acao" className="text-[#4a3629]">
                                        Objeto da Ação / Pedido Principal
                                    </Label>
                                    <Textarea
                                        id="objeto-acao"
                                        placeholder="Descreva resumidamente o objeto da ação e o pedido principal..."
                                        value={actionObject}
                                        onChange={(e) => setActionObject(e.target.value)}
                                        rows={2}
                                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 resize-none"
                                    />
                                </div>
                            </div>

                            <Separator className="bg-[#d4c4b0]" />

                            {/* LOCALIZAÇÃO E COMPETÊNCIA */}
                            <div className="space-y-4">
                                <h3 className="text-[#a16535]">Localização e Competência</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="tipo-tribunal" className="text-[#4a3629]">
                                                Tipo de Tribunal
                                            </Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openManagementDialog('courtTypes', courtTypes)}
                                                className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                                            >
                                                <Settings className="w-3 h-3 mr-1" />
                                                Gerenciar
                                            </Button>
                                        </div>
                                        <Select
                                            value={courtType}
                                            onValueChange={(value) => {
                                                setCourtType(value);
                                                setCourt(''); // Limpa o tribunal específico ao mudar o tipo
                                            }}
                                        >
                                            <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                                                <SelectValue placeholder="Selecione o tipo de tribunal" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#d4c4b0] max-h-[300px]">
                                                {courtTypes.map((option) => (
                                                    <SelectItem key={option.id} value={option.id} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="tribunal" className="text-[#4a3629]">
                                                Tribunal Específico
                                            </Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openManagementDialog('courts', courts)}
                                                className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                                            >
                                                <Settings className="w-3 h-3 mr-1" />
                                                Gerenciar
                                            </Button>
                                        </div>
                                        <Select
                                            value={court}
                                            onValueChange={setCourt}
                                            disabled={!courtType}
                                        >
                                            <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                                <SelectValue placeholder={courtType ? "Selecione o tribunal" : "Primeiro selecione o tipo"} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#d4c4b0] max-h-[300px]">
                                                {courtType && courts.filter(item => item.courtType === courtType).map((court) => (
                                                    <SelectItem key={court.id} value={court.id} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                                                        {court.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="estado" className="text-[#4a3629]">
                                                Estado
                                            </Label>
                                        </div>
                                        <Select value={state} onValueChange={setState}>
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

                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="comarca" className="text-[#4a3629]">
                                                Comarca
                                            </Label>
                                        </div>
                                        <Input
                                            id="comarca"
                                            type="text"
                                            placeholder="Ex: São Paulo"
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="vara" className="text-[#4a3629]">
                                                Vara
                                            </Label>
                                        </div>
                                        <Input
                                            id="vara"
                                            type="text"
                                            placeholder="Ex: 1ª Vara Cível"
                                            value={branch}
                                            onChange={(e) => setBranch(e.target.value)}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between h-6">
                                            <Label htmlFor="tipo-jurisdicao" className="text-[#4a3629]">
                                                Tipo de Jurisdição
                                            </Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openManagementDialog('jurisdiction', jurisdictions)}
                                                className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                                            >
                                                <Settings className="w-3 h-3 mr-1" />
                                                Gerenciar
                                            </Button>
                                        </div>
                                        <Select
                                            value={jurisdiction}
                                            onValueChange={(value) => {
                                                setJurisdiction(value);
                                            }}
                                        >
                                            <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#d4c4b0]">
                                                {jurisdictions.map((option) => (
                                                    <SelectItem
                                                        key={option.id}
                                                        value={option.id}
                                                        className="text-[#2d1f16] hover:bg-[#f6f3ee]"
                                                    >
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between h-6">
                                            <Label htmlFor="competencia" className="text-[#4a3629]">
                                                Competência
                                            </Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openManagementDialog('competence', competencies)}
                                                className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                                            >
                                                <Settings className="w-3 h-3 mr-1" />
                                                Gerenciar
                                            </Button>
                                        </div>
                                        <Select
                                            value={competence}
                                            onValueChange={(value) => {
                                                setCompetence(value);
                                            }}
                                        >
                                            <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#d4c4b0]">
                                                {competencies.map((option) => (
                                                    <SelectItem
                                                        key={option.id}
                                                        value={option.id}
                                                        className="text-[#2d1f16] hover:bg-[#f6f3ee]"
                                                    >
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-[#d4c4b0]" />

                            {/* STATUS E ACOMPANHAMENTO */}
                            <div className="space-y-4">
                                <h3 className="text-[#a16535]">Status e Acompanhamento</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between h-6">
                                            <Label htmlFor="status" className="text-[#4a3629]">
                                                Status do Processo
                                            </Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openManagementDialog("status", status)}
                                                className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                                            >
                                                <Settings className="w-3 h-3 mr-1" />
                                                Gerenciar
                                            </Button>
                                        </div>
                                        <Select
                                            value={processStatus}
                                            onValueChange={(value) => {
                                                setProcessStatus(value);
                                            }}
                                        >
                                            <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                                                <SelectValue placeholder="Selecione o status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#d4c4b0]">
                                                {status.map((option) => (
                                                    <SelectItem
                                                        key={option.id}
                                                        value={option.id}
                                                        className="text-[#2d1f16] hover:bg-[#f6f3ee]"
                                                    >
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between h-6">
                                            <Label className="text-[#4a3629]">
                                                Fase Processual
                                            </Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    openManagementDialog("stage", proceduralStages)
                                                }}
                                                className="h-6 text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                                            >
                                                <Settings className="w-3 h-3 mr-1" />
                                                Gerenciar
                                            </Button>
                                        </div>
                                        <Select
                                            value={proceduralStage}
                                            onValueChange={(value) => {
                                                setProceduralStage(value);
                                            }}
                                        >
                                            <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                                                <SelectValue placeholder="Selecione o status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#d4c4b0]">
                                                {proceduralStages.map((option) => (
                                                    <SelectItem
                                                        key={option.id}
                                                        value={option.id}
                                                        className="text-[#2d1f16] hover:bg-[#f6f3ee]"
                                                    >
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="prioridade" className="text-[#4a3629]">
                                                Prioridade
                                            </Label>
                                        </div>
                                        <Select value={priority} onValueChange={setPriority}>
                                            <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                                                <SelectValue placeholder="Selecione a prioridade" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#d4c4b0]">
                                                <SelectItem value="urgente" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🔴 Urgente</SelectItem>
                                                <SelectItem value="alta" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🟠 Alta</SelectItem>
                                                <SelectItem value="normal" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🟡 Normal</SelectItem>
                                                <SelectItem value="baixa" className="text-[#2d1f16] hover:bg-[#f6f3ee]">🟢 Baixa</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="proximo-prazo" className="text-[#4a3629]">
                                                Próximo Prazo
                                            </Label>
                                        </div>
                                        <Input
                                            id="proximo-prazo"
                                            type="date"
                                            value={nextDeadline}
                                            onChange={(e) => setNextDeadline(e.target.value)}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="link-processo" className="text-[#4a3629]">
                                                Link do Processo
                                            </Label>
                                        </div>
                                        <Input
                                            id="link-processo"
                                            type="url"
                                            placeholder="https://..."
                                            value={processLink}
                                            onChange={(e) => setProcessLink(e.target.value)}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="observacoes-processo" className="text-[#4a3629]">
                                        Observações
                                    </Label>
                                    <Textarea
                                        id="observacoes-processo"
                                        placeholder="Observações adicionais sobre o processo..."
                                        value={note}
                                        onChange={(e) => setProcessNotes(e.target.value)}
                                        rows={3}
                                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 resize-none"
                                    />
                                </div>
                            </div>

                            <Separator className="bg-[#d4c4b0]" />

                            {/* Despesas processuais */}
                            <Expenses expenses={expenses} setExpenses={setExpenses} process={editingProcess?.id} />

                            <Separator className="bg-[#d4c4b0]" />

                            {/* Notificações */}
                            <Notifications notifications={notifications} setNotifications={setNotifications} process={editingProcess?.id} />

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    className="bg-[#a16535] hover:bg-[#8b5329] text-white shadow-md"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    {editingProcess ? 'Atualizar Processo' : 'Cadastrar Processo'}
                                </Button>
                                {/* <Button
                                    type="button"
                                    variant="outline"
                                    onClick={clearForm}
                                    className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200"
                                >
                                    Limpar Formulário
                                </Button> */}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </>
    )
}