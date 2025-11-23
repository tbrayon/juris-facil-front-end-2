import { CheckCircle, Scale, TrendingUp } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useProcesses } from "@/contexts/ProcessesContext";
import { CustomLabel, CustomTooltip } from "./CustomLabel";

export function SuccessAnalysis() {

    const { processes } = useProcesses();

    const filterByStatus = (status: string): number => {
        return processes.filter(
            (p) =>
                p.status?.name === status
        ).length;
    }

    const finishedTotal = processes.filter(p => p.status?.name.includes("Finalizado")).length
    const favorableTotal = filterByStatus("Finalizado procedente") + filterByStatus("Finalizado parcialmente procedente") + filterByStatus("Finalizado acordo")

    const successRate =
        finishedTotal > 0
            ? (
                (favorableTotal /
                    finishedTotal) *
                100
            ).toFixed(1)
            : 0;

    const finishedByStatus = [
        {
            name: 'Finalizado Procedente',
            value:
                (filterByStatus('Finalizado procedente') || 0),
            fill: '#a16535',
        },
        {
            name: 'Finalizado Improcedente',
            value:
                (filterByStatus('Finalizado improcedente') || 0),
            fill: '#6b5544',
        },
    ].filter((item) => item.value > 0);

    // ---------- Processos por fase ----------
    const processesByProceduralStage = processes.reduce((acc, p) => {
        const fase = p.proceduralStage?.name || 'Não definido';
        acc[fase] = (acc[fase] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const proceduralStageData = Object.entries(processesByProceduralStage).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    return (
        <>
            {finishedTotal > 0 && (
                <div className="bg-gradient-to-r from-[#f6f3ee] to-white border-2 border-[#a16535] rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#a16535] p-3 rounded-full">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-[#2d1f16] text-xl">Análise de Desempenho Processual</h3>
                            <p className="text-[#6b5544] text-sm">Resultados dos processos finalizados</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <Card className="bg-white border-[#d4c4b0]">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-3xl text-[#a16535] mb-1">{finishedTotal}</div>
                                    <div className="text-xs text-[#6b5544]">Total Finalizados</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-300">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-3xl text-green-700 mb-1">{filterByStatus("Finalizado procedente")}</div>
                                    <div className="text-xs text-green-600">Procedentes</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-yellow-50 border-yellow-300">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-3xl text-yellow-700 mb-1">{filterByStatus("Finalizado parcialmente procedente")}</div>
                                    <div className="text-xs text-yellow-600">Parcial</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-blue-300">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-3xl text-blue-700 mb-1">{filterByStatus("Finalizado acordo")}</div>
                                    <div className="text-xs text-blue-600">Acordos</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-red-50 border-red-300">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-3xl text-red-700 mb-1">{filterByStatus("Finalizado improcedente")}</div>
                                    <div className="text-xs text-red-600">Improcedentes</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-4 p-4 bg-[#a16535]/10 rounded-lg border border-[#a16535]/30">
                        <div className="flex items-center justify-between">
                            <span className="text-[#4a3629]">Taxa de Sucesso do Escritório:</span>
                            <div className="flex items-center gap-2">
                                <div className="text-2xl text-[#a16535]">{successRate}%</div>
                                <Badge className="bg-[#a16535] text-white hover:bg-[#8b5329]">
                                    {favorableTotal} casos favoráveis
                                </Badge>
                            </div>
                        </div>
                        <p className="text-xs text-[#6b5544] mt-2">
                            * Considera procedentes, parcialmente procedentes e acordos como resultados favoráveis
                        </p>
                    </div>
                </div>
            )}

            {/* ---------- Gráficos: Taxa de Sucesso + Processos por Fase ---------- */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Taxa de Sucesso (Pizza) */}
                {finishedByStatus.length > 0 && (
                    <Card className="bg-white border-[#d4c4b0]">
                        <CardHeader>
                            <CardTitle className="text-[#2d1f16] flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-[#a16535]" />
                                Taxa de Sucesso do Escritório
                            </CardTitle>
                            <CardDescription className="text-[#6b5544]">
                                Procedentes vs Improcedentes (processos finalizados)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={finishedByStatus}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={CustomLabel}
                                        outerRadius={90}
                                        dataKey="value"
                                    >
                                        {finishedByStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Processos por Fase (Barra) */}
                <Card className="bg-white border-[#d4c4b0]">
                    <CardHeader>
                        <CardTitle className="text-[#2d1f16] flex items-center gap-2">
                            <Scale className="w-5 h-5 text-[#a16535]" />
                            Processos por Fase Processual
                        </CardTitle>
                        <CardDescription className="text-[#6b5544]">Distribuição por fase do processo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={proceduralStageData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#d4c4b0" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#6b5544', fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={120}
                                />
                                <YAxis tick={{ fill: '#6b5544' }} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" fill="#a16535" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}