import { Client } from "@/contexts/ClientsContext";
import { getLocalDateString } from "./formatters";
import { Process } from "@/contexts/ProcessesContext";

// === FUNÇÕES AUXILIARES ===
const getClientType = (type: 'CPF' | 'CNPJ') => type === 'CPF' ? 'Pessoa Física' : 'Pessoa Jurídica';

// === EXPORTAÇÃO CSV ===
export const exportClientsReport = (clients: Client[]) => {
    const csv = [
        ['Nome', 'Tipo', 'Cidade', 'Estado'].join(';'),
        ...clients.map(c => [c.name, getClientType(c.type), c.address?.city || '', c.address?.state || ''].join(';'))
    ].join('\n');
    downloadCSV(csv, `relatorio_clientes_${getLocalDateString()}.csv`);
};

export const exportProcessesReport = (processes: Process[]) => {
    const csv = [
        ['Número', 'Cliente', 'Tipo de Ação', 'Fase', 'Status', 'Prioridade', 'Tribunal', 'Valor da Causa'].join(';'),
        ...processes.map(p => [
            p.processNumber || '(Sem número)',
            p.client.name,
            p.actionType,
            p.proceduralStage?.name,
            p.status?.name,
            p.priority,
            p.court?.name || '',
            p.claimValue || ''
        ].join(';'))
    ].join('\n');
    downloadCSV(csv, `relatorio_processos_${getLocalDateString()}.csv`);
};

const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};
