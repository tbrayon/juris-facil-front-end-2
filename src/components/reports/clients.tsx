import { useMemo, useState } from 'react';
import { Users, Search, Eye, Edit, Download, X, AlertCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TabsContent } from '../ui/tabs';
import { Client, useClients } from '@/contexts/ClientsContext';
import { normalize } from '@/utils/formatters';
import { states } from '@/utils/states';
import { exportClientsReport } from '@/utils/export';

interface ClientReportsProps {
    handleEditClient: (client: Client) => void
    handleViewClient: (client: Client) => void
}

export function ClientReports({ handleEditClient, handleViewClient }: ClientReportsProps) {
    const { clients } = useClients();

    const getClientType = (type: 'CPF' | 'CNPJ') => type === 'CPF' ? 'Pessoa Física' : 'Pessoa Jurídica';

    // Filtros
    const [searchClientType, setSearchClientType] = useState<string>('todos');
    const [searchCity, setSearchCity] = useState<string>('todos');
    const [searchState, setSearchState] = useState<string>('todos');

    // Search state
    const [searchClient, setSearchClient] = useState("");

    // === FILTROS ÚNICOS ===
    const uniqueCities = Array.from(new Set(clients.map(c => c.address?.city)))
        .filter((s): s is string => Boolean(s))
        .sort();

    const filteredClients = useMemo(() => {
        if (!searchClient && !searchClientType && !searchCity && !searchState) {
            return clients;
        }

        const normalizedSearch = normalize(searchClient);

        return clients.filter(client => {
            const matches =
                searchClient &&
                normalize(client.name).includes(searchClient) || client.document?.includes(normalizedSearch);

            const matchesType = searchClientType === 'todos' || client.type === searchClientType;
            const matchesCity = searchCity === 'todos' || client.address?.city === searchCity;
            const matchesState = searchState === 'todos' || client.address?.state === searchState;

            return matches && matchesType && matchesCity && matchesState;
        });
    }, [clients, searchClient, searchClientType, searchCity, searchState]);



    return (
        <TabsContent value="clients">
            <Card className="bg-white border-[#d4c4b0] shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                            <CardTitle className="text-[#2d1f16] text-lg sm:text-xl">Clientes Cadastrados</CardTitle>
                            <CardDescription className="text-[#6b5544] text-sm">
                                Total de {filteredClients.length} cliente(s)
                            </CardDescription>
                            <p className="text-xs text-[#a16535] flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Dados sensíveis ocultos (LGPD)
                            </p>
                        </div>
                        <Button onClick={() => exportClientsReport(filteredClients)} disabled={filteredClients.length === 0}
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
                                placeholder="Buscar por nome do cliente"
                                value={searchClient}
                                onChange={e => setSearchClient(e.target.value)}
                                className="pl-10 bg-[#f6f3ee] border-[#d4c4b0] focus:border-[#2567f7] text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Filtro Tipo Cliente */}
                            <Select value={searchClientType} onValueChange={setSearchClientType}>
                                <SelectTrigger className={`
                                    bg-[#f6f3ee] border-[#d4c4b0] text-sm transition-all duration-200
                                    focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                                    ${searchClientType !== 'todos'
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'hover:bg-blue-500/10 hover:text-blue-600'
                                    }
                                `}>
                                    <SelectValue placeholder="Tipo de Cliente" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                                    <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                                        Todos
                                    </SelectItem>
                                    <SelectItem value="CPF" className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                                        Pessoa Física
                                    </SelectItem>
                                    <SelectItem value="CNPJ" className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white">
                                        Pessoa Jurídica
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Filtro Cidade */}
                            <Select value={searchCity} onValueChange={setSearchCity}>
                                <SelectTrigger className={`
                                    bg-[#f6f3ee] border-[#d4c4b0] text-sm transition-all duration-200
                                    focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                                    ${searchCity !== 'todos'
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'hover:bg-blue-500/10 hover:text-blue-600'
                                    }
                                `}>
                                    <SelectValue placeholder="Cidade" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-[#d4c4b0] shadow-lg">
                                    <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                                        Todas as Cidades
                                    </SelectItem>
                                    {uniqueCities.map(c => (
                                        <SelectItem
                                            key={c}
                                            value={c}
                                            className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                                        >
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Filtro Estado */}
                            <Select value={searchState} onValueChange={setSearchState}>
                                <SelectTrigger className={`
                                    bg-[#f6f3ee] border-[#d4c4b0] text-sm transition-all duration-200
                                    focus:ring-2 focus:ring-[#2567f7] focus:ring-offset-1 focus:border-[#2567f7]
                                    ${searchState !== 'todos'
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'hover:bg-blue-500/10 hover:text-blue-600'
                                    }
                                `}>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-[#d4c4b0] shadow-lg max-h-60">
                                    <SelectItem value="todos" className="hover:bg-blue-500 hover:text-white transition-colors">
                                        Todos
                                    </SelectItem>
                                    {states.map(s => (
                                        <SelectItem
                                            key={s.acronym}
                                            value={s.acronym}
                                            className="hover:bg-blue-500 hover:text-white transition-colors data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                                        >
                                            {s.acronym} - {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {(searchClientType !== 'todos' || searchCity !== 'todos' || searchState !== 'todos') && (
                            <Button variant="ghost" size="sm"
                                onClick={() => {
                                    setSearchClientType('todos');
                                    setSearchState('todos');
                                    setSearchCity('todos');
                                }}
                                className="text-[#a16535] text-sm">
                                <X className="w-4 h-4 mr-1" /> Limpar
                            </Button>
                        )}
                    </div>

                    {/* Mobile: Cards */}
                    <div className="sm:hidden space-y-4">
                        {filteredClients.length === 0 ? (
                            <div className="text-center py-16 text-[#6b5544] bg-white rounded-xl border border-[#d4c4b0]/30">
                                <Users className="w-10 h-10 mx-auto mb-3 text-[#a16535]/50" />
                                <p className="font-medium">Nenhum cliente encontrado</p>
                            </div>
                        ) : (
                            filteredClients.map((client) => (
                                <div key={client.id} className="bg-white border border-[#d4c4b0]/40 rounded-2xl p-5 shadow-sm hover:shadow transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-[#2d1f16] text-base truncate">{client.name}</h4>
                                            <p className="text-sm text-[#6b5544] mt-0.5 truncate">{client.address?.city}/{client.address?.state}</p>
                                        </div>
                                        <div className="flex gap-1.5 ml-3">
                                            <Button variant="ghost" size="icon" onClick={() => handleViewClient(client)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee] rounded-lg">
                                                <Eye className="w-4.5 h-4.5" />
                                            </Button>
                                            {/* <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)} className="h-9 w-9 text-[#a16535] hover:bg-[#f6f3ee] rounded-lg">
                                                <Edit className="w-4.5 h-4.5" />
                                            </Button> */}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-xs font-medium text-[#6b5544] mr-2">Tipo:</span>
                                            <Badge variant="outline" className="text-xs px-3 py-1 border-[#a16535] text-[#a16535] font-medium rounded-full">
                                                {client.type}
                                            </Badge>
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
                                    <TableHead className="text-[#4a3629]">Nome</TableHead>
                                    <TableHead className="text-[#4a3629]">Tipo</TableHead>
                                    <TableHead className="text-[#4a3629]">Cidade/UF</TableHead>
                                    <TableHead className="text-[#4a3629] text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center text-[#6b5544] py-8">Nenhum cliente</TableCell></TableRow>
                                ) : (
                                    filteredClients.map((client) => (
                                        <TableRow key={client.id} className="hover:bg-[#f6f3ee]/50">
                                            <TableCell className="text-[#2d1f16] font-medium max-w-[200px] truncate">{client.name}</TableCell>
                                            <TableCell><Badge variant="outline" className="border-[#a16535] text-[#a16535] text-xs px-3 py-1 rounded-full">{getClientType(client.type)}</Badge></TableCell>
                                            <TableCell className="text-[#6b5544]">{client.address?.city}/{client.address?.state}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewClient(client)} className="text-[#a16535] hover:bg-[#f6f3ee] h-8 w-8 p-0">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    {/* <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)} className="text-[#a16535] hover:bg-[#f6f3ee] h-8 w-8 p-0">
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
    )
}