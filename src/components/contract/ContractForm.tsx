import { useState } from "React";

import { FileText, Search, DollarSign, AlertCircle, X, Settings } from 'lucide-react';
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
import { formatCurrency, formatPercentage, formatNumeroContrato, formatNumeroProcesso, formatCPF, formatCNPJ } from '@/utils/formatters'
import { Process, useProcesses } from "@/contexts/ProcessesContext";
import { Client, useClients } from "@/contexts/ClientsContext";
import { generateContractTemplate } from "@/utils/generateContract";

interface ContractFormProps = {

}

export function ContractForm() {

    const { processes } = useProcesses();
    const { clients } = useClients();

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

    const [selectedClient, setSelectedClient] = useState<Client>();
    const [selectedProcess, setSelectedProcess] = useState<Process>();

    const handleProcessSelect = (value: string) => {
        setProcess(value);
        const item = processes.filter(item => item.id === process)[0];

        setSelectedProcess(item);

        if (selectedProcess) {
            const client = clients.filter(item => item.id === selectedProcess.client)[0];

            setSelectedClient(client);
        }
    }
    
    const template = generateContractTemplate(selectedClient, selectedProcess, contract)

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

    return (
        <>
            <div className="space-y-2">
                <Label className="text-[#4a3629]">Selecione o Processo</Label>
                <Select value={process} onValueChange={handleProcessSelect}>
                    <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                        <SelectValue placeholder="Escolha um processo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#d4c4b0] max-h-[300px]">
                        {processes.map((process) => (
                            <SelectItem key={process.id} value={process.id} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                                {process.processNumber || '(Sem número)'} - {process.actionType} - {process.client}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* DADOS FINANCEIROS */}
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
                                const formatted = formatNumeroContrato(e.target.value);
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
            </div>
        </>
    )
}