
import { useState, useMemo } from 'react';
import { FileText, Edit, Eye } from 'lucide-react';

import { getPriorityBadge, getStatusBadge } from './Badges';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { TabsContent } from '../ui/tabs';
import { Separator } from '../ui/separator';

import { formatDateBR, normalize } from '@/utils/formatters';
import { Process, useProcess, useProcesses } from '@/contexts/ProcessesContext';
import { ProcessModal } from './ProcessModal';
import { useAppStore } from '@/store/useAppStore';

interface ProcessSearchProps {
    setActiveTab: (tab: "add" | "search") => void
    setEditProcess: (process: Process | undefined) => void
}

export function ProcessSearch({ setActiveTab, setEditProcess }: ProcessSearchProps) {
    const { processes } = useProcesses();
    const { setSelectedProcess } = useAppStore();

    const [searchTerm, setSearchTerm] = useState('');

    const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
    const [focusedProcess, setFocusedProcess] = useState<Process>()

    const filteredProcesses = useMemo(() => {
        if (!searchTerm) return processes;

        const term = normalize(searchTerm);

        return processes.filter((process) => {

            const matchesName = normalize(process.client.name).includes(term);
            const matchesDocument = process.client.document === term;

            return matchesName || matchesDocument;
        });
    }, [processes, searchTerm]);

    const handleProcessView = (process: Process) => {
        setFocusedProcess(process);
        setIsProcessModalOpen(true);
    }

    const handleProcessEdit = (id: string) => {
        setSelectedProcess(id);
        setActiveTab("add");
    }

    return (
        <>
            <TabsContent value="search">
                {focusedProcess && (
                    <ProcessModal
                        process={focusedProcess}
                        isProcessModalOpen={isProcessModalOpen}
                        setProcessModalOpen={setIsProcessModalOpen}
                    />
                )}
                <Card className="bg-white border-2 border-[#d4c4b0]">
                    <CardHeader>
                        <CardTitle className="text-[#2d1f16]">Buscar Processos</CardTitle>
                        <CardDescription className="text-[#6b5544]">
                            Pesquise por número do processo, CPF, CNPJ ou nome do cliente
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Digite o número do processo ou CPF/CNPJ/Nome..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                            />
                            {/* <Button
                                onClick={() => console.log("Buscar processos")}
                                className="bg-[#a16535] hover:bg-[#8b5329] text-white shadow-lg shadow-[#a16535]/30"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Buscar
                            </Button> */}
                        </div>

                        {/* Resultados da pesquisa */}
                        {filteredProcesses ? (
                            <div className="space-y-4">
                                <p className="text-[#6b5544]">
                                    {filteredProcesses.length} processo(s) encontrado(s)
                                </p>
                                {filteredProcesses.map((process) => (
                                    <Card key={process.id} className="bg-[#a16535]/5 border-[#d4c4b0] hover:border-[#a16535]/50 transition-colors">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-[#2d1f16]">
                                                            {process.processNumber || <span className="text-[#6b5544] italic">Processo sem número</span>}
                                                        </h4>
                                                        {process.status && getStatusBadge(process.status?.name)}
                                                        {process.priority && getPriorityBadge(process.priority)}
                                                    </div>
                                                    <p className="text-[#4a3629]">
                                                        <strong>Cliente:</strong> {process.client.name}
                                                    </p>
                                                    <p className="text-[#4a3629]">
                                                        <strong>Tipo de Ação:</strong> {process.actionType}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleProcessView(process)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleProcessEdit(process.id)}
                                                        className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#a16535]/10"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <Separator className="my-3 bg-[#d4c4b0]" />

                                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                                <div>
                                                    <span className="text-[#6b5544]">Tribunal:</span>{' '}
                                                    <span className="text-[#4a3629]">{process.court?.name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[#6b5544]">Comarca:</span>{' '}
                                                    <span className="text-[#4a3629]">{process.district}</span>
                                                </div>
                                                <div>
                                                    <strong className="text-[#6b5544]">Fase:</strong>{' '}
                                                    <strong className="text-[#4a3629]">{process.proceduralStage?.name}</strong>
                                                </div>
                                                <div>
                                                    <span className="text-[#6b5544]">Advogado:</span>{' '}
                                                    <span className="text-[#4a3629]">{process.responsibleAttorney}</span>
                                                </div>
                                                {/* {contract.contractValue && (
                                                    <div>
                                                        <span className="text-[#6b5544]">Valor Contrato:</span>{' '}
                                                        <span className="text-green-600">{contract.contractValue}</span>
                                                    </div>
                                                )} */}
                                                {process.nextDeadline && (
                                                    <div>
                                                        <strong className="text-[#6b5544]">Próximo Prazo:</strong>{' '}
                                                        <strong className="text-[#a16535]">
                                                            {formatDateBR(process.nextDeadline)}
                                                        </strong>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-[#6b5544]">
                                <FileText className="w-12 h-12 mx-auto mb-4 text-[#d4c4b0]" />
                                <p>Nenhum processo encontrado.</p>
                                <p className="text-sm">Tente buscar por número do processo ou documento do cliente.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </>
    );
}
