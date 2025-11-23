import { useMemo } from 'react';
import { Calendar, DollarSign, FileText, Users } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import { useClients } from '@/contexts/ClientsContext';
import { useProcesses } from '@/contexts/ProcessesContext';
import { formatCurrencyFloat } from '@/utils/formatters';
import { useContracts } from '@/contexts/ContractsContext';

export function Metrics() {
    const { clients } = useClients();
    const { processes } = useProcesses();
    const { contracts } = useContracts();

    // Do I need this?
    // const totalClientsCPF = useMemo(() => {
    //     return clients.filter(c => c.type === "CPF").length
    // }, [clients]);

    // const totalClientsCNPJ = useMemo(() => {
    //     return clients.filter(c => c.type === "CNPJ").length
    // }, [clients]);

    // ---------- Valor total em contratos ----------
    const totalContractsValue = contracts.reduce((acc, c) => {
        let value = 0;
        if (c.contractValue) {
            value = parseFloat(c.contractValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        }

        return acc + value;
    }, 0);

    // ---------- Processos urgentes ----------
    const urgentProcesses = processes.filter(
        (p) => p.priority === 'urgente' || p.priority === 'alta'
    ).length;

    // ---------- Prazos próximos ----------
    const today = new Date();
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7);

    const nextDeadlines = processes.filter((p) => {
        if (!p.nextDeadline) return false;
        const deadlineDate = new Date(p.nextDeadline);
        return deadlineDate >= today && deadlineDate <= nextWeek;
    }).length;

    return (
        <>
            {/* ---------- Cards de métricas ---------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white border-[#d4c4b0]">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[#6b5544]">Total de Clientes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl text-[#a16535]">{clients.length}</div>
                                <div className="text-sm text-[#6b5544] mt-1">
                                    {clients.filter(c => c.type === "CPF").length} PF • {clients.filter(c => c.type === "CNPJ").length} PJ
                                </div>
                            </div>
                            <Users className="w-10 h-10 text-[#a16535] opacity-20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-[#d4c4b0]">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[#6b5544]">Total de Processos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl text-[#a16535]">{processes.length}</div>
                                <div className="text-sm text-[#6b5544] mt-1">{urgentProcesses} urgentes</div>
                            </div>
                            <FileText className="w-10 h-10 text-[#a16535] opacity-20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-[#d4c4b0]">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[#6b5544]">Valor em Contratos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl text-[#a16535]">{formatCurrencyFloat(totalContractsValue)}</div>
                                <div className="text-sm text-[#6b5544] mt-1">Total de honorários</div>
                            </div>
                            <DollarSign className="w-10 h-10 text-[#a16535] opacity-20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-[#d4c4b0]">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[#6b5544]">Prazos Próximos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl text-[#a16535]">{nextDeadlines}</div>
                                <div className="text-sm text-[#6b5544] mt-1">Próximos 7 dias</div>
                            </div>
                            <Calendar className="w-10 h-10 text-[#a16535] opacity-20" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}