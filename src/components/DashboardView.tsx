import { TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Metrics } from './dashboard/Metrics';
import { SuccessAnalysis } from './dashboard/SuccessAnalysis';
import { AreasAnalysis } from './dashboard/AreasAnalysis';
import { Alerts } from './dashboard/Alerts';
import { AppView } from '@/types/navigation';

interface DashboardViewProps {
  onNavigate: (view: AppView) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ---------- Cabeçalho ---------- */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl text-[#2d1f16] flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#a16535]" />
              Dashboard - Visão Geral
            </h2>
            <p className="text-[#6b5544]">Métricas e indicadores para tomada de decisão</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onNavigate("home")}
              className="w-full sm:w-auto !bg-white !text-[#a16535] border-2 border-[#955d30] hover:!bg-[#a16535] hover:!text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Página Inicial
            </Button>
          </div>
        </div>
      </div>

      {/* ---------- Métricas ---------- */}
      <Metrics />

      {/* ---------- Análise de Sucesso ---------- */}
      <SuccessAnalysis />

      {/* ---------- Foco nas Áreas ---------- */}
      <AreasAnalysis />

      {/* ---------- Alertas ---------- */}
      <Alerts />

    </div>
  );
}