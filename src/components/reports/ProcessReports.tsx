import { FileText, Users, Search, Eye, Edit, Download, X, Mail, Phone, MapPin, Calendar, FileCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TabsContent } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { exportProcessesReport } from '@/utils/export';
import { Process, useProcesses } from '@/contexts/ProcessesContext';
import { useMemo, useState } from 'react';
import { capitalizeFirstLetter, normalize } from '@/utils/formatters';
import { useProceduralStages } from '@/contexts/ProceduralStagesContext';
import { useStatus } from '@/contexts/StatusContext';
import { getPriorityBadge, getStatusBadge } from '../process/Badges';

interface ProcessReportsProps {
    handleEditProcess: (process: Process) => void
    handleViewProcess: (process: Process) => void
}

export function ProcessReports({ handleEditProcess, handleViewProcess }: ProcessReportsProps) {
    const { processes } = useProcesses();

    const [processSearch, setProcessSearch] = useState('');
    const [filterPhase, setFilterPhase] = useState<string>('todos');
    const [filterStatus, setFilterStatus] = useState<string>('todos');
    const [filterPriority, setFilterPriority] = useState<string>('todos');
    const [filterActionType, setFilterActionType] = useState<string>('todos');

    const filteredProcesses = useMemo(() => {
        return processes.filter((proc: Process) => {
            const normalizedSearch = normalize(processSearch);

            const matchSearch =
                (proc.processNumber?.includes(processSearch)) ||
                normalize(proc.client.name).includes(normalizedSearch) ||
                proc.client.document?.includes(normalizedSearch);

            const matchPhase =
                filterPhase === 'todos' || proc.proceduralStage?.id === filterPhase;

            const matchStatus =
                filterStatus === 'todos' || proc.status?.id === filterStatus;

            const matchPriority =
                filterPriority === 'todos' || proc.priority === filterPriority;

            const matchActionType =
                filterActionType === 'todos' || proc.actionType === filterActionType;

            return (
                matchSearch &&
                matchPhase &&
                matchStatus &&
                matchPriority &&
                matchActionType
            );
        });
    }, [
        processes,
        processSearch,
        filterPhase,
        filterStatus,
        filterPriority,
        filterActionType
    ]);

    const { proceduralStages } = useProceduralStages();
    const { status } = useStatus();

    const uniquePriorities = Array.from(new Set(processes.map(p => capitalizeFirstLetter(p.priority))))
        .filter((s): s is string => Boolean(s))
        .sort();

    const uniqueActionTypes = Array.from(new Set(processes.map(p => p.actionType)))
        .filter((s): s is string => Boolean(s))
        .sort();

    return (
        <>
            <TabsContent value="processes">
                <Card className="bg-white border-[#d4c4b0] shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-[#2d1f16] text-lg sm:text-xl">Processos Cadastrados</CardTitle>
                                <CardDescription className="text-[#6b5544] text-sm">
                                    Total de {filteredProcesses.length} processo(s)
                                </CardDescription>
                            </div>
                            <Button onClick={() => exportProcessesReport(filteredProcesses)} disabled={filteredProcesses.length === 0}
                                className="bg-[#a16535] hover:bg-[#8b5329] text-white w-full sm:w-auto text-sm">
                                <Download className="w-4 h-4 mr-2" />
                                Exportar CSV
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Filtros */}
                        <div className="mb-5 space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5544] w-4 h-4" />
                                <Input
                                    placeholder="Buscar por número, cliente ou ação..."
                                    value={processSearch}
                                    onChange={e => setProcessSearch(e.target.value)}
                                    className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] focus:border-[#2567f7] text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* Fase */}
                                <div className="space-y-1">
                                    <Label className="text-[#6b5544] text-xs">Fase</Label>
                                    <Select value={filterPhase} onValueChange={setFilterPhase}>
                                        <SelectTrigger className={`
                        bg-[#f6f3ee] border-[#d4c4b0] text-sm h-9 transition-all duration-200
                        focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                        ${filterPhase !== 'todos'
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'hover:bg-blue-500/10 hover:text-blue-600'
                                            }
                      `}>
                                            <SelectValue placeholder="Todas" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                                            <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                                                Todas
                                            </SelectItem>
                                            {proceduralStages.map(p => (
                                                <SelectItem key={p.id} value={p.id} className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status */}
                                <div className="space-y-1">
                                    <Label className="text-[#6b5544] text-xs">Status</Label>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className={`
                        bg-[#f6f3ee] border-[#d4c4b0] text-sm h-9 transition-all duration-200
                        focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                        ${filterStatus !== 'todos'
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'hover:bg-blue-500/10 hover:text-blue-600'
                                            }
                      `}>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                                            <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                                                Todos
                                            </SelectItem>
                                            {status.map(s => (
                                                <SelectItem key={s.id} value={s.id} className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Prioridade */}
                                <div className="space-y-1">
                                    <Label className="text-[#6b5544] text-xs">Prioridade</Label>
                                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                                        <SelectTrigger className={`
                        bg-[#f6f3ee] border-[#d4c4b0] text-sm h-9 transition-all duration-200
                        focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                        ${filterPriority !== 'todos'
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'hover:bg-blue-500/10 hover:text-blue-600'
                                            }
                      `}>
                                            <SelectValue placeholder="Todas" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                                            <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                                                Todas
                                            </SelectItem>
                                            {uniquePriorities.map(p => (
                                                <SelectItem key={p} value={p.toLowerCase()} className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                                                    {p}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Tipo de Ação */}
                                <div className="space-y-1">
                                    <Label className="text-[#6b5544] text-xs">Tipo de Ação</Label>
                                    <Select value={filterActionType} onValueChange={setFilterActionType}>
                                        <SelectTrigger className={`
                        bg-[#f6f3ee] border-[#d4c4b0] text-sm h-9 transition-all duration-200
                        focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                        ${filterActionType !== 'todos'
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'hover:bg-blue-500/10 hover:text-blue-600'
                                            }
                      `}>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                                            <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                                                Todos
                                            </SelectItem>
                                            {uniqueActionTypes.map(a => (
                                                <SelectItem key={a} value={a} className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                                                    {a}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {(filterPhase !== 'todos' || filterStatus !== 'todos' || filterPriority !== 'todos' || filterActionType !== 'todos') && (
                                <Button variant="ghost" size="sm" onClick={() => {
                                    setFilterPhase('todos');
                                    setFilterStatus('todos');
                                    setFilterPriority('todos');
                                    setFilterActionType('todos');
                                }} className="text-[#a16535] text-sm">
                                    <X className="w-4 h-4 mr-1" /> Limpar
                                </Button>
                            )}
                        </div>

                        {/* Mobile: Cards - PROCESSOS */}
                        <div className="sm:hidden space-y-4">
                            {filteredProcesses.length === 0 ? (
                                <div className="text-center py-16 text-[#6b5544] bg-white rounded-xl border border-[#d4c4b0]/30">
                                    <FileText className="w-10 h-10 mx-auto mb-3 text-[#a16535]/50" />
                                    <p className="font-medium">Nenhum processo encontrado</p>
                                </div>
                            ) : (
                                filteredProcesses.map((process: Process) => (
                                    <div key={process.id} className="bg-white border border-[#d4c4b0]/40 rounded-2xl p-5 shadow-sm hover:shadow transition-all duration-200">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-mono text-lg font-bold text-[#2d1f16] tracking-tight truncate">
                                                    {process.processNumber || '(Sem número)'}
                                                </p>
                                                <p className="text-sm text-[#6b5544] mt-0.5 truncate">{process.client.name}</p>
                                            </div>
                                            <div className="flex gap-1.5 ml-3">
                                                <Button variant="ghost" size="icon" onClick={() => handleViewProcess(process)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee] rounded-lg">
                                                    <Eye className="w-4.5 h-4.5" />
                                                </Button>
                                                {/* <Button variant="ghost" size="icon" onClick={() => handleEditProcess(process)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee] rounded-lg">
                                                    <Edit className="w-4.5 h-4.5" />
                                                </Button> */}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex-1">
                                                <span className="text-xs font-medium text-[#6b5544]">Ação:</span>
                                                <p className="text-sm font-medium text-[#2d1f16] truncate mt-0.5">{process.actionType}</p>
                                            </div>
                                            <div className="flex items-center ml-4">
                                                <span className="text-xs font-medium text-[#6b5544] mr-2">Fase:</span>
                                                <Badge variant="outline" className="text-xs px-3 py-1 border-[#a16535] text-[#a16535] font-medium rounded-full">
                                                    {process.proceduralStage?.name}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium text-[#6b5544] mr-2">Status:</span>
                                                {process.status && getStatusBadge(process.status.name)}
                                            </div>
                                            <div className="flex items-center ml-4">
                                                <span className="text-xs font-medium text-[#6b5544] mr-2">Prioridade:</span>
                                                {process.priority && getPriorityBadge(process.priority)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop: Tabela */}
                        <div className="hidden sm:block border border-[#d4c4b0] rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#f6f3ee]">
                                        <TableHead className="text-[#4a3629]">Número</TableHead>
                                        <TableHead className="text-[#4a3629]">Cliente</TableHead>
                                        <TableHead className="text-[#4a3629]">Tipo de Ação</TableHead>
                                        <TableHead className="text-[#4a3629]">Fase</TableHead>
                                        <TableHead className="text-[#4a3629]">Status</TableHead>
                                        <TableHead className="text-[#4a3629]">Prioridade</TableHead>
                                        <TableHead className="text-[#4a3629] text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProcesses.length === 0 ? (
                                        <TableRow><TableCell colSpan={7} className="text-center text-[#6b5544] py-8">Nenhum processo</TableCell></TableRow>
                                    ) : (
                                        filteredProcesses.map((process: Process) => (
                                            <TableRow key={process.id} className="hover:bg-[#f6f3ee]/50">
                                                <TableCell className="text-[#2d1f16] font-medium font-mono max-w-[120px] truncate">
                                                    {process.processNumber || <span className="text-[#6b5544] italic">(Sem número)</span>}
                                                </TableCell>
                                                <TableCell className="text-[#6b5544] max-w-[200px] truncate">{process.client.name}</TableCell>
                                                <TableCell className="text-[#6b5544] max-w-[150px] truncate">{process.actionType}</TableCell>
                                                <TableCell><Badge variant="outline" className="border-[#a16535] text-[#a16535] text-xs px-3 py-1 rounded-full">{process.proceduralStage?.name}</Badge></TableCell>
                                                <TableCell>{process.status && getStatusBadge(process.status.name)}</TableCell>
                                                <TableCell>{process.priority && getPriorityBadge(process.priority)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        <Button variant="ghost" size="sm" onClick={() => handleViewProcess(process)} className="text-[#a16535] hover:bg-[#f6f3ee] h-8 w-8 p-0">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        {/* <Button variant="ghost" size="sm" onClick={() => handleEditProcess(process)} className="text-[#a16535] hover:bg-[#f6f3ee] h-8 w-8 p-0">
                                                            <Edit className="w-4 h-4" />
                                                        </Button> */}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </>
    )
}