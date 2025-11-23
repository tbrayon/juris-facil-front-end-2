import { useProcesses } from "@/contexts/ProcessesContext";
import { Briefcase, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "./CustomLabel";
import { Badge } from '../ui/badge';

export function AreasAnalysis() {
    const { processes } = useProcesses();
    const total = processes.length;
    // ---------- Áreas prioritárias ----------
    const priorityAreas = {
        "Ação Trabalhista": 0,
        "Ação de Indenização": 0,
        "Ação de Alimentos": 0,
        "Ação de Divórcio": 0,
        "Ação de Cobrança": 0,
        "Ação de Despejo": 0,
        "Outros": 0,
    };

    processes.forEach((p) => {
        const type = p.actionType || "Outros";
        if (type in priorityAreas) {
            priorityAreas[type as keyof typeof priorityAreas]++;
        } else {
            priorityAreas["Outros"]++;
        }
    });

    const mainProcesses =
        priorityAreas["Ação Trabalhista"] +
        priorityAreas["Ação de Indenização"] +
        priorityAreas["Ação de Alimentos"] +
        priorityAreas["Ação de Divórcio"] +
        priorityAreas["Ação de Cobrança"];

    const focusPercentage = total > 0 ? ((mainProcesses / total) * 100).toFixed(1) : 0;

    const distributionData = [
        { name: "Ação Trabalhista", value: priorityAreas["Ação Trabalhista"], fill: "#a16535", prioridade: 1 },
        { name: "Ação de Indenização", value: priorityAreas["Ação de Indenização"], fill: "#d4a574", prioridade: 2 },
        { name: "Ação de Alimentos", value: priorityAreas["Ação de Alimentos"], fill: "#e8b882", prioridade: 3 },
        { name: "Ação de Divórcio", value: priorityAreas["Ação de Divórcio"], fill: "#8b5329", prioridade: 4 },
        { name: "Ação de Cobrança", value: priorityAreas["Ação de Cobrança"], fill: "#6b5544", prioridade: 5 },
        { name: "Ação de Despejo", value: priorityAreas["Ação de Despejo"], fill: "#9d7f66", prioridade: 6 },
        { name: "Outros", value: priorityAreas["Outros"], fill: "#d4c4b0", prioridade: 7 },
    ]
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value);


    return (
        <>
            {total > 0 && (
                <div className="bg-gradient-to-r from-white to-[#f6f3ee] border-2 border-[#a16535] rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#a16535] p-3 rounded-full">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-[#2d1f16] text-xl">Foco nas Áreas de Especialização</h3>
                            <p className="text-[#6b5544] text-sm">Distribuição de todos os processos por tipo de ação</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                        <Card className="bg-[#a16535]/10 border-[#a16535]">
                            <CardContent className="p-3">
                                <div className="text-center">
                                    <div className="text-2xl text-[#a16535] mb-1">{priorityAreas["Ação Trabalhista"]}</div>
                                    <div className="text-xs text-[#4a3629]">⚖️Trabalhista</div>
                                    <Badge className="mt-1 bg-[#a16535] text-white text-[10px] px-2 py-0">Prioridade 1</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#d4a574]/20 border-[#d4a574]">
                            <CardContent className="p-3">
                                <div className="text-center">
                                    <div className="text-2xl text-[#8b5329] mb-1">{priorityAreas["Ação de Indenização"]}</div>
                                    <div className="text-xs text-[#4a3629]">💰Indenização</div>
                                    <Badge className="mt-1 bg-[#d4a574] text-white text-[10px] px-2 py-0">Prioridade 2</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#e8b882]/20 border-[#e8b882]">
                            <CardContent className="p-3">
                                <div className="text-center">
                                    <div className="text-2xl text-[#8b5329] mb-1">{priorityAreas["Ação de Alimentos"]}</div>
                                    <div className="text-xs text-[#4a3629]">🍽️Alimentos</div>
                                    <Badge className="mt-1 bg-[#e8b882] text-white text-[10px] px-2 py-0">Prioridade 3</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#8b5329]/20 border-[#8b5329]">
                            <CardContent className="p-3">
                                <div className="text-center">
                                    <div className="text-2xl text-[#6b5544] mb-1">{priorityAreas["Ação de Divórcio"]}</div>
                                    <div className="text-xs text-[#4a3629]">💔Divórcio</div>
                                    <Badge className="mt-1 bg-[#8b5329] text-white text-[10px] px-2 py-0">Prioridade 4</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#6b5544]/20 border-[#6b5544]">
                            <CardContent className="p-3">
                                <div className="text-center">
                                    <div className="text-2xl text-[#4a3629] mb-1">{priorityAreas["Ação de Cobrança"]}</div>
                                    <div className="text-xs text-[#4a3629]"> 💵 Cobrança</div>
                                    <Badge className="mt-1 bg-[#6b5544] text-white text-[10px] px-2 py-0">Prioridade 5</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-4 p-4 bg-[#a16535]/10 rounded-lg border border-[#a16535]/30">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[#4a3629]">Processos nas 5 Áreas Prioritárias:</span>
                            <div className="flex items-center gap-2">
                                <div className="text-2xl text-[#a16535]">{focusPercentage}%</div>
                                <Badge
                                    className={`${Number(focusPercentage) >= 70
                                        ? "bg-green-600"
                                        : Number(focusPercentage) >= 50
                                            ? "bg-yellow-600"
                                            : "bg-red-600"
                                        } text-white hover:opacity-90`}
                                >
                                    {mainProcesses} de {total} processos
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 mt-2">
                            <Briefcase className="w-4 h-4 text-[#a16535] mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-[#6b5544]">
                                {Number(focusPercentage) >= 70
                                    ? "Excelente! O escritório está altamente focado nas suas áreas de especialização."
                                    : Number(focusPercentage) >= 50
                                        ? "Atenção! Considere redirecionar esforços para as áreas prioritárias."
                                        : "Alerta! Muitos processos fora das áreas de especialização. Revise a estratégia."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* ---------- Distribuição por Tipo de Ação (Barra vertical) ---------- */}
            {distributionData.length > 0 && (
                <Card className="bg-white border-[#d4c4b0]">
                    <CardHeader>
                        <CardTitle className="text-[#2d1f16] flex items-center gap-2">
                            <Target className="w-5 h-5 text-[#a16535]" />
                            Distribuição de Processos por Tipo de Ação
                        </CardTitle>
                        <CardDescription className="text-[#6b5544]">
                            5 áreas prioritárias: Trabalhista, Indenização, Alimentos, Divórcio e Cobrança ({total}{' '}
                            processos)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={distributionData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#d4c4b0" />
                                <XAxis type="number" tick={{ fill: '#6b5544' }} allowDecimals={false} />
                                <YAxis dataKey="name" type="category" tick={{ fill: '#6b5544', fontSize: 13 }} width={180} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4 p-3 bg-[#f6f3ee] rounded-lg border border-[#d4c4b0]">
                            <p className="text-xs text-[#6b5544]">
                                <strong className="text-[#a16535]">Insight:</strong> As 5 primeiras categorias representam as
                                áreas prioritárias do escritório.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}