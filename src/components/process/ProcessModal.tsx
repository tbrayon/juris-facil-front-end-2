
import { DollarSign } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Separator } from "../ui/separator";

import { Process } from '@/contexts/ProcessesContext';
import { formatDateBR } from '@/utils/formatters';
import { getPriorityBadge, getStatusBadge } from './Badges';
import { useContracts } from '@/contexts/ContractsContext';

interface ProcessModalProps {
    process: Process
    isProcessModalOpen: boolean
    setProcessModalOpen: (value: boolean) => void
}

export function ProcessModal({ process, isProcessModalOpen, setProcessModalOpen }: ProcessModalProps) {
    const { contracts } = useContracts();

    const contract = contracts.find(item => item.process.id === process.id);

    return (
        <Dialog open={isProcessModalOpen} onOpenChange={() => setProcessModalOpen(false)}>
            <DialogContent className="bg-white border-[#d4c4b0] max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#2d1f16]">Detalhes do Processo</DialogTitle>
                    <DialogDescription className="text-[#6b5544]">
                        {process.processNumber || 'Processo sem número (pré-processual)'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* Dados do Cliente */}
                    <div>
                        <h4 className="text-[#a16535] mb-3">Cliente</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-[#6b5544]">Nome:</span>{' '}
                                <span className="text-[#2d1f16]">{process.client.name}</span>
                            </div>
                            <div>
                                <span className="text-[#6b5544]">Documento:</span>{' '}
                                <span className="text-[#2d1f16]">{process.client.document}</span>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-[#d4c4b0]" />

                    {/* Dados do Processo */}
                    <div>
                        <h4 className="text-[#a16535] mb-3">Dados Processuais</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {process.distributionDate &&
                                <div>
                                    <span className="text-[#6b5544]">Data Distribuição:</span>{' '}
                                    <span className="text-[#2d1f16]">
                                        {formatDateBR(process.distributionDate)}
                                    </span>
                                </div>
                            }
                            <div>
                                <span className="text-[#6b5544]">Polo:</span>{' '}
                                <span className="text-[#2d1f16]">{process.proceduralHub}</span>
                            </div>
                            <div>
                                <span className="text-[#6b5544]">Parte Contrária:</span>{' '}
                                <span className="text-[#2d1f16]">{process.opposingParty}</span>
                            </div>
                            <div>
                                <span className="text-[#6b5544]">Tipo de Ação:</span>{' '}
                                <span className="text-[#2d1f16]">{process.actionType}</span>
                            </div>
                            <div>
                                <span className="text-[#6b5544]">Valor da Causa:</span>{' '}
                                <span className="text-[#2d1f16]">{process.claimValue}</span>
                            </div>
                            <div>
                                <span className="text-[#6b5544]">Fase:</span>{' '}
                                <span className="text-[#2d1f16]">{process.proceduralStage?.name}</span>
                            </div>
                            <div>
                                <span className="text-[#6b5544]">Tribunal:</span>{' '}
                                <span className="text-[#2d1f16]">{process.court?.name}</span>
                            </div>
                            <div>
                                <span className="text-[#6b5544]">Comarca:</span>{' '}
                                <span className="text-[#2d1f16]">{process.district}</span>
                            </div>
                            <div>
                                <span className="text-[#6b5544]">Vara:</span>{' '}
                                <span className="text-[#2d1f16]">{process.branch}</span>
                            </div>
                            <div>
                                <span className="text-[#6b5544]">Jurisdição:</span>{' '}
                                <span className="text-[#2d1f16] capitalize">{process.jurisdiction?.name}</span>
                            </div>
                            <div>
                                <span className="text-[#6b5544]">Competência:</span>{' '}
                                <span className="text-[#2d1f16] capitalize">{process.competence?.name}</span>
                            </div>
                            <div>
                                <span className="text-[#6b5544]">Status:</span>{' '}
                                {process.status && getStatusBadge(process.status.name)}
                            </div>
                            {process.priority &&
                                <div>
                                    <span className="text-[#6b5544]">Prioridade:</span>{' '}
                                    {getPriorityBadge(process.priority)}
                                </div>
                            }
                            <div>
                                <span className="text-[#6b5544]">Advogado:</span>{' '}
                                <span className="text-[#2d1f16]">{process.responsibleAttorney}</span>
                            </div>
                        </div>
                        {process.actionObject && (
                            <div className="mt-4">
                                <span className="text-[#6b5544]">Objeto da Ação:</span>
                                <p className="text-[#2d1f16] mt-1">{process.actionObject}</p>
                            </div>
                        )}
                        {process.processNotes && (
                            <div className="mt-4">
                                <span className="text-[#6b5544]">Observações:</span>
                                <p className="text-[#2d1f16] mt-1">{process.processNotes}</p>
                            </div>
                        )}
                    </div>

                    {/* Dados Financeiros */}
                    {contract && (
                        <>
                            <Separator className="bg-[#d4c4b0]" />
                            <div>
                                <h4 className="text-[#a16535] mb-3 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Dados Financeiros
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {contract.contractValue && (
                                        <div>
                                            <span className="text-[#6b5544]">Valor Contrato:</span>{' '}
                                            <span className="text-green-600">{contract.contractValue}</span>
                                        </div>
                                    )}
                                    {contract.attorneyFees && (
                                        <div>
                                            <span className="text-[#6b5544]">Honorários:</span>{' '}
                                            <span className="text-green-600">{contract.attorneyFees}</span>
                                        </div>
                                    )}
                                    {contract.paymentMethod && (
                                        <div>
                                            <span className="text-[#6b5544]">Forma Pagamento:</span>{' '}
                                            <span className="text-[#2d1f16]">{contract.paymentMethod}</span>
                                        </div>
                                    )}
                                    {contract.financialStatus && (
                                        <div>
                                            <span className="text-[#6b5544]">Status Financeiro:</span>{' '}
                                            <span className="text-[#2d1f16] capitalize">{contract.financialStatus}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Despesas Processuais
                                {process.expenses && process.expenses.length > 0 && (
                                    <div className="mt-4">
                                        <span className="text-[#6b5544]">Despesas Processuais:</span>
                                        <div className="mt-2 space-y-2">
                                            {process.expenses.map((expense, index) => (
                                                <div key={expense.id} className="flex justify-between items-center p-2 bg-[#f6f3ee] rounded border border-[#d4c4b0]">
                                                    <div className="flex-1">
                                                        <span className="text-[#2d1f16]">{expense.purpose || 'Despesa não especificada'}</span>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <span className="text-red-600">{expense.amount}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                */}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}