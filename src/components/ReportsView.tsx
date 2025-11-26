import { useState } from 'react';
import { Button } from './ui/button';
import { FileText, Users, Mail, Phone, MapPin, Calendar, FileCheck, ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { formatDateBR } from '@/utils/formatters';
import { AppView } from '@/types/navigation';
import { Client } from '@/contexts/ClientsContext';
import { Process } from '@/contexts/ProcessesContext';
import { ClientReports } from './reports/ClientReports';
import { ProcessReports } from './reports/ProcessReports';
import { getPriorityBadge, getStatusBadge } from './process/Badges';


interface ReportsViewProps {
  onNavigate: (view: AppView) => void;
}

export function ReportsView({ onNavigate }: ReportsViewProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);

  // === FUNÇÕES AUXILIARES ===
  const getClientType = (type: 'CPF' | 'CNPJ') => type === 'CPF' ? 'Pessoa Física' : 'Pessoa Jurídica';

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setClientDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    // onEditarCliente(cliente.id);

    onNavigate("clientes");
  };

  const handleViewProcess = (process: Process) => {
    setSelectedProcess(process);
    setProcessDialogOpen(true);
  };

  const handleEditProcess = (process: Process) => {
    // onEditarProcesso(processo.id);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[#2d1f16] flex items-center gap-2 text-xl sm:text-2xl font-bold">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#a16535]" />
              Relatórios
            </h2>
            <p className="text-[#6b5544] text-sm sm:text-base">Visualize e exporte relatórios de clientes e processos</p>
          </div>
          <Button
            variant="outline"
            onClick={() => onNavigate("home")}
            className="!bg-white !text-[#a16535] border-2 border-[#955d30] hover:!bg-[#a16535] hover:!text-white transition-all duration-200 w-full sm:w-auto text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Página Inicial
          </Button>
        </div>
      </div>

      <Tabs defaultValue="clients" className="space-y-5">
        <TabsList className="grid w-full grid-cols-2 bg-[#f6f3ee] border-2 border-[#d4c4b0] p-1 rounded-full h-12">
          <TabsTrigger value="clients" className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full text-xs sm:text-sm">
            <Users className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Relatório de </span>Clientes
          </TabsTrigger>
          <TabsTrigger value="processes" className="data-[state=active]:bg-[#a16535] data-[state=active]:text-white text-[#6b5544] hover:text-[#a16535] rounded-full text-xs sm:text-sm">
            <FileText className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Relatório de </span>Processos
          </TabsTrigger>
        </TabsList>

        {/* === CLIENTES === */}
        <ClientReports handleEditClient={handleEditClient} handleViewClient={handleViewClient} />

        {/* === PROCESSOS === */}
        <ProcessReports handleEditProcess={handleEditProcess} handleViewProcess={handleViewProcess} />
      </Tabs>

      {/* === DIALOG CLIENTE === */}
      <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
        <DialogContent className="bg-white border-2 border-[#d4c4b0] max-w-3xl w-[95vw] max-h-[85vh] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16] flex items-center gap-2 text-lg sm:text-xl">
              <Users className="w-5 h-5 text-[#a16535]" />
              Detalhes do Cliente
            </DialogTitle>
            <DialogDescription className="text-[#6b5544] text-sm">
              Visualização completa dos dados cadastrais
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold text-base sm:text-lg">
                    <Users className="w-4 h-4 text-[#a16535]" />
                    Dados Pessoais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="md:col-span-2">
                      <Label className="text-[#6b5544] text-sm font-medium">Nome</Label>
                      <p className="text-[#2d1f16] font-medium text-base">{selectedClient.name}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Tipo</Label>
                      <p className="text-[#2d1f16] text-sm">{getClientType(selectedClient.type)}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">{selectedClient.type}</Label>
                      <p className="text-[#2d1f16] font-mono text-sm">
                        {selectedClient.document}
                      </p>
                    </div>
                    <div className="break-words">
                      <Label className="text-[#6b5544] text-sm font-medium">Email</Label>
                      <p className="text-[#2d1f16] flex items-center gap-1 break-all text-sm">
                        <Mail className="w-3 h-3 text-[#a16535] flex-shrink-0" />
                        {selectedClient.email || '—'}
                      </p>
                    </div>
                    <div className="break-words">
                      <Label className="text-[#6b5544] text-sm font-medium">Telefone</Label>
                      <p className="text-[#2d1f16] flex items-center gap-1 break-all text-sm">
                        <Phone className="w-3 h-3 text-[#a16535] flex-shrink-0" />
                        {selectedClient.phones || '—'}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold text-base sm:text-lg">
                    <MapPin className="w-4 h-4 text-[#a16535]" />
                    Endereço
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Logradouro</Label>
                      <p className="text-[#2d1f16] text-sm break-words">{selectedClient.address?.street || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Número</Label>
                      <p className="text-[#2d1f16] text-sm">{selectedClient.address?.number || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Bairro</Label>
                      <p className="text-[#2d1f16] text-sm break-words">{selectedClient.address?.neighborhood || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Cidade/UF</Label>
                      <p className="text-[#2d1f16] text-sm">{selectedClient.address?.city}/{selectedClient.address?.state}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <div className="flex flex-row gap-2">
            <Button variant="outline" onClick={() => setClientDialogOpen(false)} className="text-sm">
              Fechar
            </Button>
            {/* <Button onClick={() => selectedClient && handleEditClient(selectedClient)} className="text-sm bg-[#a16535] hover:bg-[#8b5329]">
              Editar
            </Button> */}
          </div>
        </DialogContent>
      </Dialog>

      {/* === DIALOG PROCESSO === */}
      <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
        <DialogContent className="bg-white border-2 border-[#d4c4b0] max-w-4xl w-[95vw] max-h-[85vh] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16] flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="w-5 h-5 text-[#a16535]" />
              Detalhes do Processo
            </DialogTitle>
            <DialogDescription className="text-[#6b5544] text-sm">
              Visualização completa dos dados do processo
            </DialogDescription>
          </DialogHeader>
          {selectedProcess && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold text-base sm:text-lg">
                    <FileCheck className="w-4 h-4 text-[#a16535]" />
                    Dados Básicos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="md:col-span-2">
                      <Label className="text-[#6b5544] text-sm font-medium">Número do Processo</Label>
                      <p className="text-[#2d1f16] font-mono text-base">{selectedProcess.processNumber || '(Sem número)'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Cliente</Label>
                      <p className="text-[#2d1f16] text-sm break-words">{selectedProcess.client.name}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Tipo de Ação</Label>
                      <p className="text-[#2d1f16] text-sm break-words">{selectedProcess.actionType}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Fase Processual</Label>
                      <Badge variant="outline" className="border-[#a16535] text-[#a16535] text-xs px-3 py-1 rounded-full mt-1">
                        {selectedProcess.proceduralStage?.name}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Status</Label>
                      <div className="mt-1">{selectedProcess.status && getStatusBadge(selectedProcess.status.name)}</div>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Prioridade</Label>
                      <div className="mt-1">{selectedProcess.priority && getPriorityBadge(selectedProcess.priority)}</div>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Tribunal</Label>
                      <p className="text-[#2d1f16] text-sm break-words">{selectedProcess.court?.name || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Valor da Causa</Label>
                      <p className="text-[#2d1f16] text-sm">{selectedProcess.claimValue || '—'}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-[#4a3629] mb-3 flex items-center gap-2 font-semibold text-base sm:text-lg">
                    <Calendar className="w-4 h-4 text-[#a16535]" />
                    Datas Importantes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-[#6b5544] text-sm font-medium">Distribuição</Label>
                      <p className="text-[#2d1f16] text-sm">{selectedProcess.distributionDate ? formatDateBR(selectedProcess.distributionDate) : '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <div className="flex flex-row gap-2">
            <Button variant="outline" onClick={() => setProcessDialogOpen(false)} className="text-sm">
              Fechar
            </Button>
            {/* <Button onClick={() => selectedProcess && handleEditProcess(selectedProcess)} className="text-sm bg-[#a16535] hover:bg-[#8b5329]">
              Editar
            </Button> */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
