import { useEffect, useRef, useState } from "react";

import { FileText, DollarSign, AlertCircle, X, Printer } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { TabsContent } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { formatCurrency, formatPercentage, formatContractNumber } from '@/utils/formatters'
import { Process, useProcesses } from "@/contexts/ProcessesContext";
import { generateContractTemplate } from "@/utils/generateContract";
import { Contract, ContractInput, useContracts } from "@/contexts/ContractsContext";
import { Client, useClients } from "@/contexts/ClientsContext";
import { useAppStore } from "@/store/useAppStore";
import { printContract } from "@/utils/printContract";


export function ContractForm() {
    const { processes } = useProcesses();
    const { clients } = useClients();
    const { contracts } = useContracts();
    const { addContractMutation, updateContractMutation } = useContracts();
    const { setContractsTab, setSelectedContract, selectedContract } = useAppStore();

    // Contract
    const [process, setProcess] = useState("");
    const [contractNumber, setContractNumber] = useState("");
    const [contractValue, setContractValue] = useState("");
    const [contractPercentage, setContractPercentage] = useState("");
    const [attorneyFees, setAttorneyFees] = useState("");
    const [sucumbencyFees, setSucumbencyFees] = useState("");

    const [amountToReceive, setAmountToReceive] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [financialStatus, setFinancialStatus] = useState("");
    const [installmentsNumber, setInstallmentsNumber] = useState("");
    const [paymentDate, setPaymentDate] = useState("");

    const [contractTemplate, setContractTemplate] = useState("");

    const [selectedProcess, setSelectedProcess] = useState<Process>();
    const [selectedClient, setSelectedClient] = useState<Client>();


    useEffect(() => {
        if (!process) {
            setSelectedProcess(undefined);
            return;
        }

        const item = processes.find((p) => p.id === process);
        const client = clients.find((c) => c.id === item?.client.id);

        setSelectedProcess(item || undefined);
        setSelectedClient(client || undefined);
    }, [process, processes, clients]);

    const lastIdRef = useRef<string | null>(null);
    useEffect(() => {
        if (!selectedContract || lastIdRef.current === selectedContract) return;

        const contract = contracts.find(c => c.id === selectedContract);
        if (!contract) return;

        if (contract) {
            lastIdRef.current = selectedContract;
            handleEditContract(contract);
        }
    }, [selectedContract, contracts]);

    const handleEditContract = (contract: Contract) => {
        setProcess(contract.process || "");
        setContractNumber(contract.contractNumber || "");
        setContractValue(contract.contractValue || "");
        setContractPercentage(contract.contractPercentage || "");
        setAttorneyFees(contract.attorneyFees || "");
        setSucumbencyFees(contract.sucumbencyFees || "");

        setAmountToReceive(contract.amountToReceive || "");
        setDueDate(contract.dueDate || "");
        setPaymentMethod(contract.paymentMethod || "");
        setFinancialStatus(contract.financialStatus || "");
        setInstallmentsNumber(contract.installmentsNumber || "");
        setPaymentDate(contract.paymentDate || "");

        setContractTemplate(contract.contractTemplate || "");
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProcess && selectedClient) {
            const data: ContractInput = {
                process: process || "",
                contractNumber: contractNumber || "",
                contractValue: contractValue || "",
                contractPercentage: contractPercentage || "",
                attorneyFees: attorneyFees || "",
                sucumbencyFees: sucumbencyFees || "",

                amountToReceive: amountToReceive || "",
                dueDate: dueDate || "",
                paymentMethod: paymentMethod || "",
                financialStatus: financialStatus || "",
                installmentsNumber: installmentsNumber || "",
                paymentDate: paymentDate || "",

                contractTemplate: contractTemplate || "",
            };

            if (selectedContract) {
                updateContractMutation.mutate({ id: selectedContract, contract: data }, {
                    onSuccess: () => {
                        setSelectedContract(null);
                        clearForm();
                        setContractsTab("list");
                    }
                });
            } else {
                const template = generateContractTemplate(selectedProcess, data, selectedClient);
                data.contractTemplate = template;

                printContract(template);

                addContractMutation.mutate(data, {
                    onSuccess: () => {
                        clearForm();
                        setContractsTab("list");
                    }
                });
            }
        }
    }

    const clearForm = () => {
        // Contract
        setContractNumber("");
        setContractValue("");
        setContractPercentage("");
        setAttorneyFees("");
        setSucumbencyFees("");

        setAmountToReceive("");
        setDueDate("");
        setPaymentMethod("");
        setFinancialStatus("");
        setInstallmentsNumber("");
        setPaymentDate("");
    }

    const [paymentMethods] = useState([
        'À vista',
        'Boleto',
        'Cartão de Crédito',
        'Parcelado',
        'Pix',
        'Transferência Bancária',
    ].sort((a, b) => a.localeCompare(b, 'pt-BR')));


    return (
        <>
            <TabsContent value="form">
                <Card className="bg-white border-[#d4c4b0]">
                    <CardHeader>
                        <CardTitle className="text-[#2d1f16]">
                            {selectedContract ? 'Editar Contrato' : 'Novo Contrato'}
                        </CardTitle>
                        <CardDescription className="text-[#6b5544]">
                            {selectedContract
                                ? 'Atualize as informações do contrato'
                                : 'Primeiro, pesquise o processo para vincular ao contrato'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedContract && (
                            <Alert className="mb-6 bg-[#a16535]/10 border-[#a16535]/50">
                                <AlertCircle className="w-4 h-4 text-[#a16535]" />
                                <AlertDescription className="text-[#a16535] flex items-center justify-between">
                                    <span>Você está editando o contrato: <strong>{contractNumber}</strong></span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedContract(null);
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
                        <div className="space-y-4 mb-6 pb-6 border-b border-[#d4c4b0]">
                            <Label className="text-[#4a3629]">Selecione o Processo</Label>
                            <Select value={process} onValueChange={setProcess}>
                                <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                                    <SelectValue placeholder="Escolha um processo" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-[#d4c4b0] max-h-[300px]">
                                    {processes.map((process) => (
                                        <SelectItem key={process.id} value={process.id} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                                            {process.processNumber || '(Sem número)'} - {process.actionType} - {process.client.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-[#a16535] flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Dados Financeiros
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="numero-contrato-honorarios" className="text-[#4a3629]">
                                            Nº Contrato Honorários
                                        </Label>
                                        <Input
                                            id="numero-contrato-honorarios"
                                            type="text"
                                            placeholder="000/2025"
                                            value={contractNumber}
                                            onChange={(e) => {
                                                const formatted = formatContractNumber(e.target.value);
                                                setContractNumber(formatted);
                                            }}
                                            onBlur={(e) => {
                                                // const value = e.target.value;
                                                //     const exists = contracts.some(contract =>
                                                //         contract.contractNumber === value &&
                                                //         contract.id !== currentContract.id
                                                //     );
                                                //     if (exists) {
                                                //         toast.error('Número de contrato duplicado', {
                                                //             description: `O número de contrato "${value}" já existe no sistema.`,
                                                //         });
                                                //     }
                                                // }
                                            }}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="valor-contrato" className="text-[#4a3629]">
                                            Valor do Contrato
                                        </Label>
                                        <Input
                                            id="valor-contrato"
                                            type="text"
                                            placeholder="R$ 0,00"
                                            value={contractValue}
                                            onChange={(e) => setContractValue(formatCurrency(e.target.value))}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="percentual-contrato" className="text-[#4a3629]">
                                            Percentual Contrato
                                        </Label>
                                        <Input
                                            id="percentual-contrato"
                                            type="text"
                                            placeholder="0%"
                                            value={contractPercentage}
                                            onChange={(e) => setContractPercentage(formatPercentage(e.target.value))}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="honorarios-advocaticios" className="text-[#4a3629]">
                                            Honorários Advocatícios
                                        </Label>
                                        <Input
                                            id="honorarios-advocaticios"
                                            type="text"
                                            placeholder="R$ 0,00"
                                            value={attorneyFees}
                                            onChange={(e) => setAttorneyFees(formatCurrency(e.target.value))}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-[#d4c4b0]" />
                            {/* VALORES VARIÁVEIS E DESPESAS */}
                            <div className="space-y-4">
                                <h3 className="text-[#a16535]">Valores Variáveis e Despesas</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="honorarios-sucumbencia" className="text-[#4a3629]">
                                        Honorários de Sucumbência
                                    </Label>
                                    <Input
                                        id="honorarios-sucumbencia"
                                        type="text"
                                        placeholder="R$ 0,00"
                                        value={sucumbencyFees}
                                        onChange={(e) => setSucumbencyFees(formatCurrency(e.target.value))}
                                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                    />
                                </div>
                            </div>

                            {/* GESTÃO DE RECEBIMENTO */}
                            <div className="space-y-4">
                                <h3 className="text-[#a16535]">Gestão de Recebimento</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="valor-receber" className="text-[#4a3629]">
                                        Valor a Receber
                                    </Label>
                                    <Input
                                        id="valor-receber"
                                        type="text"
                                        placeholder="R$ 0,00"
                                        value={amountToReceive}
                                        onChange={(e) => setAmountToReceive(formatCurrency(e.target.value))}
                                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between h-6">
                                            <Label htmlFor="forma-pagamento" className="text-[#4a3629]">
                                                Forma de Pagamento
                                            </Label>
                                        </div>
                                        <Select
                                            value={paymentMethod}
                                            onValueChange={(value) => {
                                                setPaymentMethod(value);
                                            }}
                                        >
                                            <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                                                <SelectValue placeholder="Selecione a forma" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#d4c4b0]">
                                                {paymentMethods.map((option) => (
                                                    <SelectItem key={option} value={option} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="numero-parcelas" className="text-[#4a3629]">
                                                Número de Parcelas
                                            </Label>
                                        </div>
                                        <Input
                                            id="numero-parcelas"
                                            type="text"
                                            placeholder="Ex: 12x"
                                            value={installmentsNumber}
                                            onChange={(e) => setInstallmentsNumber(e.target.value)}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="data-vencimento" className="text-[#4a3629]">
                                                Data de Vencimento
                                            </Label>
                                        </div>
                                        <Input
                                            id="data-vencimento"
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-6 flex items-center">
                                            <Label htmlFor="data-pagamento" className="text-[#4a3629]">
                                                Data de Pagamento
                                            </Label>
                                        </div>
                                        <Input
                                            id="data-pagamento"
                                            type="date"
                                            value={paymentDate}
                                            onChange={(e) => setPaymentDate(e.target.value)}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status-financeiro" className="text-[#4a3629]">
                                        Status Financeiro
                                    </Label>
                                    <Select value={financialStatus} onValueChange={setFinancialStatus}>
                                        <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#d4c4b0]">
                                            <SelectItem value="pendente" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Pendente</SelectItem>
                                            <SelectItem value="pago" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Pago</SelectItem>
                                            <SelectItem value="atrasado" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Atrasado</SelectItem>
                                            <SelectItem value="cancelado" className="text-[#2d1f16] hover:bg-[#f6f3ee]">Cancelado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {selectedContract &&
                                    <div className="space-y-2">
                                        <Label className="text-[#4a3629]">Texto do Contrato</Label>
                                        <Textarea
                                            value={contractTemplate}
                                            onChange={(e) => setContractTemplate(e.target.value)}
                                            rows={30}
                                            className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] resize-none text-sm"
                                            style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.8' }}
                                        />
                                    </div>
                                }
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    className="bg-[#a16535] hover:bg-[#8b5329] text-white shadow-md"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    {selectedContract ? 'Atualizar Contrato' : 'Cadastrar Contrato'}
                                </Button>
                                {selectedContract && (
                                    <Button
                                        type="button"
                                        onClick={() => printContract(contractTemplate)}
                                        className="bg-[#a16535] hover:bg-[#8b5329] text-white shadow-md"
                                    >
                                        <Printer className="w-4 h-4 mr-2" />
                                        Imprimir
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        clearForm();
                                        setContractsTab("list");
                                    }}
                                    className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent >
        </>
    )
}