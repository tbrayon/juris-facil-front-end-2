import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { FileText, Search, Plus, DollarSign, AlertCircle, Edit, Eye, X, PlusCircle, Settings, Trash2, Bell, ArrowLeft, Check, ChevronsUpDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { formatDateBR, formatCurrency, formatPercentage, formatNumeroContrato, formatNumeroProcesso, formatCPF, formatCNPJ } from '../utils/formatters';
import { AppView } from '@/types/navigation';
import { useClients } from '@/contexts/ClientsContext';
import { Process, useProcesses } from '@/contexts/ProcessesContext';
import { ProcessForm } from './process/ProcessForm';
import { ProcessSearch } from './process/ProcessSearch';

interface ProcessesViewProps {
  processoIdParaEditar?: string | null;
  onClearProcessoIdParaEditar?: () => void;
  onNavigate: (view: AppView) => void;
}

export function ProcessesView({ onNavigate }: ProcessesViewProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'search'>('search');

  const [editingProcess, setEditingProcess] = useState<Process>()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl text-[#2d1f16] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#a16535]" />
              Gestão de Processos
            </h2>
            <p className="text-[#6b5544]">Cadastre, consulte e gerencie os processos jurídicos</p>
          </div>
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

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'add' | 'search')}>
        <TabsList className="grid w-full grid-cols-2 bg-[#f6f3ee] border-2 border-[#d4c4b0] p-1 rounded-full h-14">
          <TabsTrigger
            value="search"
            className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full h-full transition-all"
          >
            <Search className="w-4 h-4 mr-2" />
            Consultar Processos
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full h-full transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Processo
          </TabsTrigger>
        </TabsList>
        <ProcessSearch setEditProcess={setEditingProcess} setActiveTab={setActiveTab} />
        <ProcessForm editingProcess={editingProcess} setEditingProcess={setEditingProcess} setActiveTab={setActiveTab} />
      </Tabs>
    </div>
  );
}
