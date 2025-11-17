import { useState } from 'react';
import { Button } from './ui/button';
import { FileText, Search, Plus, ArrowLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { AppView } from '@/types/navigation';
import { Contract } from '@/contexts/ContractsContext';
import { ContractForm } from './contract/ContractForm';
import { ContractSearch } from './contract/ContractSearch';

interface ContractsViewProps {
  onNavigate: (view: AppView) => void;
}

export function ContractsView({ onNavigate }: ContractsViewProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'search'>('search');

  const [editingContract, setEditingContract] = useState<Contract>();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl text-[#2d1f16] flex items-center gap-2">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-[#a16535]" />
              Contratos de Honorários
            </h2>
            <p className="text-sm text-[#6b5544]">Gere, edite e gerencie contratos de honorários advocatícios</p>
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
            Consultar Contratos
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full h-full transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Contrato
          </TabsTrigger>
        </TabsList>
        <ContractSearch setEditContract={setEditingContract} setActiveTab={setActiveTab} />
        <ContractForm editingContract={editingContract} setEditingContract={setEditingContract} setActiveTab={setActiveTab} />
      </Tabs>
    </div>
  );
}
