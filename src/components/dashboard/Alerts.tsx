import { AlertCircle } from "lucide-react";
import { useProcesses } from "@/contexts/ProcessesContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from '../ui/badge';

export function Alerts() {
  const { processes } = useProcesses();

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
    (urgentProcesses > 0 || nextDeadlines > 0) && (
      <Card className="bg-[#a16535]/10 border-[#a16535]">
        <CardHeader>
          <CardTitle className="text-[#2d1f16] flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#a16535]" />
            Alertas Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {urgentProcesses > 0 && (
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500/30 text-red-700 border-red-600">Atenção</Badge>
              <p className="text-[#4a3629]">
                Existem <strong>{urgentProcesses}</strong> processo(s) com prioridade urgente ou alta
              </p>
            </div>
          )}
          {nextDeadlines > 0 && (
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500/30 text-yellow-700 border-yellow-600">Prazo</Badge>
              <p className="text-[#4a3629]">
                <strong>{nextDeadlines}</strong> prazo(s) vencendo nos próximos 7 dias
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  )
}