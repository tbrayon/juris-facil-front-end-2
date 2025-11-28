import { Expense } from "@/contexts/ProcessesContext"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { DollarSign, Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import { formatCurrency } from "@/utils/formatters"

interface ExpensesProps {
    expenses: Expense[]
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
    process: string | undefined
}

export function Expenses({ expenses, setExpenses, process }: ExpensesProps) {

    return (
        <>
            <div className="space-y-4">
                <h3 className="text-[#a16535] flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Despesas Processuais
                </h3>
                <div className="space-y-3">
                    {expenses.map((expense, idx) => (
                        <div key={idx} className="bg-[#f6f3ee] border border-[#d4c4b0] rounded-lg p-4">
                            <div className="flex items-end justify-end mb-3">
                                {!expense.id &&
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setExpenses(prev =>
                                                prev.filter((_, i) => i !== idx)
                                            );
                                        }}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 px-2"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                }
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-2">
                                <div className="space-y-1">
                                    <Label htmlFor={`despesa-valor-${idx}`} className="text-[#4a3629] text-sm">
                                        Valor
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="R$ 0,00"
                                        value={expense.amount || ""}
                                        onChange={(e) => {
                                            setExpenses(prev =>
                                                prev.map((n, i) =>
                                                    i === idx ? { ...n, amount: formatCurrency(e.target.value) } : n
                                                )
                                            );
                                        }}
                                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor={`despesa-finalidade-${idx}`} className="text-[#4a3629] text-sm">
                                        Finalidade / Descrição
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Ex: Custas judiciais, perícia técnica, etc."
                                        value={expense.purpose || ""}
                                        onChange={(e) => {
                                            setExpenses(prev =>
                                                prev.map((n, i) =>
                                                    i === idx ? { ...n, purpose: e.target.value } : n
                                                )
                                            );
                                        }}
                                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <>
                        {expenses.length === 0 && (
                            <div className="text-center text-[#6b5544] py-4 bg-[#f6f3ee] border border-dashed border-[#d4c4b0] rounded-lg">
                                Nenhuma despesa processual cadastrada
                            </div>
                        )}
                    </>
                    < Button
                        type="button"
                        onClick={() => {
                            setExpenses((prev: Expense[]) => [...prev, {
                                id: null,
                                process: process,
                                amount: '',
                                purpose: '',
                            }]);
                        }}
                        size="sm"
                        className="bg-[#a16535] hover:bg-[#8b5329] text-white h-8"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Despesa
                    </Button>
                </div>
            </div>
        </>
    )
}