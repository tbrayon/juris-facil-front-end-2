import { useEffect, useState } from "react";

import { FileText, DollarSign, AlertCircle, X } from 'lucide-react';
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
import { formatCurrency, formatPercentage, formatNumeroContrato } from '@/utils/formatters'
import { Process, useProcesses } from "@/contexts/ProcessesContext";
import { generateContractTemplate } from "@/utils/generateContract";
import { Contract, ContractInput, useContracts } from "@/contexts/ContractsContext";
import { Client, useClients } from "@/contexts/ClientsContext";

interface ContractFormProps {
    editingContract: Contract | undefined
    setEditingContract: (contract: Contract | undefined) => void
    setActiveTab: (tab: "add" | "search") => void
}

export function ContractForm({ editingContract, setEditingContract, setActiveTab }: ContractFormProps) {
    const { processes } = useProcesses();
    const { clients } = useClients();
    const { addContractMutation, updateContractMutation } = useContracts();

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



    console.log(selectedProcess);

    const handlePrintContract = (template: string) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.body.insertAdjacentHTML("beforeend", `
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
            <pre class="contrato-texto">${template.replace(/<[^>]*>/g, '')}</pre>
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => printWindow.print(), 250);
        }
    };

    useEffect(() => {
        if (editingContract) {
            handleEditContract(editingContract);
            setActiveTab('add');
            toast.info('Contrato carregado para edição');
        }
    }, [editingContract]);

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

            if (editingContract && !!editingContract.id) {
                updateContractMutation.mutate({ id: editingContract.id, contract: data }, {
                    onSuccess: () => {
                        setEditingContract(undefined);
                        clearForm();
                        setActiveTab("search");
                    }
                });

                if (data.contractTemplate) {
                    handlePrintContract(data.contractTemplate);
                }

            } else {
                const template = generateContractTemplate(selectedProcess, data, selectedClient);
                data.contractTemplate = template;

                handlePrintContract(template);

                addContractMutation.mutate(data, {
                    onSuccess: () => {
                        clearForm();
                        setActiveTab("search");
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
            <TabsContent value="add">
                <Card className="bg-white border-[#d4c4b0]">
                    <CardHeader>
                        <CardTitle className="text-[#2d1f16]">
                            {editingContract ? 'Editar Contrato' : 'Novo Contrato'}
                        </CardTitle>
                        <CardDescription className="text-[#6b5544]">
                            {editingContract
                                ? 'Atualize as informações do contrato'
                                : 'Primeiro, pesquise o processo para vincular ao contrato'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {editingContract && (
                            <Alert className="mb-6 bg-[#a16535]/10 border-[#a16535]/50">
                                <AlertCircle className="w-4 h-4 text-[#a16535]" />
                                <AlertDescription className="text-[#a16535] flex items-center justify-between">
                                    <span>Você está editando o contrato: <strong>{editingContract.contractNumber}</strong></span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setEditingContract(undefined);
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
                                {editingContract &&
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
                                    {editingContract ? 'Atualizar & Gerar Contrato' : 'Cadastrar & Gerar Contrato'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={clearForm}
                                    className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-hite transition-all duration-200"
                                >
                                    Limpar Formulário
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent >
        </>
    )
}