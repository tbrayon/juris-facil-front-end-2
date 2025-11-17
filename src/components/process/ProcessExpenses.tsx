import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { formatCurrency } from '@/utils/formatters'
import { Expense, Process } from '@/contexts/ProcessesContext';

interface ProcessExpensesFormProps {
    process: Process
    expenses: Expense[]
}

export function ProcessExpensesForm({ process, expenses }: ProcessExpensesFormProps) {
    const [currentExpenses, setCurrentExpenses] = useState<Expense[]>(expenses);
    return (
        <>
            {/* Despesas Processuais - Múltiplas */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-[#4a3629]">
                        Despesas Processuais
                    </Label>
                    <Button
                        type="button"
                        onClick={addExpenses}
                        size="sm"
                        className="bg-[#a16535] hover:bg-[#8b5329] text-white h-8"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Despesa
                    </Button>
                </div>

                {expenses.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-[#d4c4b0] rounded-lg bg-[#f6f3ee]/50">
                        <p className="text-[#6b5544] text-sm">
                            Nenhuma despesa cadastrada. Clique em "Adicionar Despesa" para incluir.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {expenses.map((expense) => (
                            <div key={expense.id} className="grid grid-cols-12 gap-3 p-3 border border-[#d4c4b0] rounded-lg bg-white">
                                <div className="col-span-3 space-y-2">
                                    <Label htmlFor={`despesa-valor-${expense.id}`} className="text-[#4a3629] text-sm">
                                        Valor
                                    </Label>
                                    <Input
                                        id={`despesa-valor-${expense.id}`}
                                        type="text"
                                        placeholder="R$ 0,00"
                                        value={expense.amount}
                                        onChange={(e) => updateExpense(expense.id, 'amount', formatCurrency(e.target.value))}
                                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                    />
                                </div>
                                <div className="col-span-8 space-y-2">
                                    <Label htmlFor={`despesa-finalidade-${expense.id}`} className="text-[#4a3629] text-sm">
                                        Finalidade / Descrição
                                    </Label>
                                    <Input
                                        id={`despesa-finalidade-${expense.id}`}
                                        type="text"
                                        placeholder="Ex: Custas judiciais, perícia técnica, etc."
                                        value={expense.purpose}
                                        onChange={(e) => updateExpense(expense.id, 'purpose', e.target.value)}
                                        className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                                    />
                                </div>
                                {/* <div className="col-span-1 flex items-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeExpense(expense.id)}
                                        className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        title="Remover despesa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div> */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}