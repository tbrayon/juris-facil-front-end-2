import { Badge } from '../ui/badge';

export const getPriorityBadge = (priority: string) => {
    switch (priority) {
        case 'urgente':
            return <Badge className="bg-red-500/30 text-red-700 border-red-600 font-medium">🔴 Urgente</Badge>;
        case 'alta':
            return <Badge className="bg-orange-500/30 text-orange-700 border-orange-600 font-medium">🟠 Alta</Badge>;
        case 'normal':
            return <Badge className="bg-yellow-500/30 text-yellow-700 border-yellow-600 font-medium">🟡 Normal</Badge>;
        case 'baixa':
            return <Badge className="bg-green-500/30 text-green-700 border-green-600 font-medium">🟢 Baixa</Badge>;
        default:
            return <Badge>{priority}</Badge>;
    }
};

export const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; label: string } } = {
        'Em elaboração': { color: 'bg-purple-500/30 text-purple-700 border-purple-600 font-medium', label: 'Em elaboração' },
        'Pendente de distribuição': { color: 'bg-indigo-500/30 text-indigo-700 border-indigo-600 font-medium', label: 'Pendente de distribuição' },
        'Ativo': { color: 'bg-green-500/30 text-green-700 border-green-600 font-medium', label: 'Ativo' },
        'Suspenso': { color: 'bg-yellow-500/30 text-yellow-700 border-yellow-600 font-medium', label: 'Suspenso' },
        'Finalizado acordo': { color: 'bg-[#6b5544]/30 text-[#4a3629] border-[#6b5544] font-medium', label: 'Finalizado Acordo' },
        'Finalizado procedente': { color: 'bg-green-600/30 text-green-800 border-green-700 font-medium', label: 'Finalizado Procedente' },
        'Finalizado parcialmente procedente': { color: 'bg-blue-600/30 text-blue-800 border-blue-700 font-medium', label: 'Finalizado Parcialmente Procedente' },
        'Finalizado improcedente': { color: 'bg-red-600/30 text-red-800 border-red-700 font-medium', label: 'Finalizado Improcedente' },
    };

    const s = statusMap[status] || { color: '', label: status };
    return <Badge className={s.color}>{s.label}</Badge>;
};