import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FileText, Edit } from 'lucide-react';
import { formatDateTimeBR, normalize } from '@/utils/formatters';

import { useContracts } from '@/contexts/ContractsContext';
import { TabsContent } from '../ui/tabs';
import { useProcesses } from '@/contexts/ProcessesContext';
import { useAppStore } from '@/store/useAppStore';


export function ContractList() {

  const { contracts } = useContracts();
  const { processes } = useProcesses();
  const { setContractsTab, setSelectedContract } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');

  const processMap = useMemo(() => {
    const map = new Map();
    processes.forEach(p => map.set(p.id, p));
    return map;
  }, [processes]);

  const filteredContracts = useMemo(() => {
    if (!searchTerm) {
      return contracts.map(c => ({
        contract: c,
        process: processMap.get(c.process)
      }));
    }

    const term = normalize(searchTerm);

    return contracts
      .map(contract => {
        const process = processMap.get(contract.process);
        return { contract, process };
      })
      .filter(({ process }) => {
        if (!process) return false;

        return (
          normalize(process.client.name).includes(term) ||
          process.client.document === term ||
          normalize(process.processNumber).includes(term)
        );
      });
  }, [contracts, processMap, searchTerm]);

  return (
    <>
      <TabsContent value="list">
        <Card className="bg-white border-2 border-[#d4c4b0]">
          <CardHeader>
            <CardTitle className="text-[#2d1f16]">Buscar Contratos</CardTitle>
            <CardDescription className="text-[#6b5544]">
              Pesquise por número do processo, CPF, CNPJ ou nome do cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Digite o número do processo ou CPF/CNPJ/Nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
              />
            </div>

            {filteredContracts ? (
              <div className="space-y-4">
                <p className="text-[#6b5544]">
                  {filteredContracts.length} contrato(s) encontrado(s)
                </p>
                {filteredContracts.map((contract) => (

                  <Card key={contract.contract.id} className="bg-gradient-to-br from-[#f6f3ee] to-white border-2 border-[#d4c4b0] hover:border-[#a16535] hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 sm:gap-0">
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <h4 className="text-base sm:text-lg text-[#2d1f16]">
                              {contract.process.processNumber || <span className="text-[#6b5544] italic">Contrato sem número de processo</span>}
                            </h4>
                            {/* {contrato.arquivoAssinado && (
                          <Badge className="bg-green-100 text-green-700 border-green-300 hover:bg-green-100">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Assinado
                          </Badge>
                        )} */}
                          </div>
                          <p className="text-sm text-[#4a3629]">
                            <strong>Cliente:</strong> {contract.process.client.name} ({contract.process.client.name})
                          </p>
                          {contract.process && (
                            <p className="text-sm text-[#6b5544]">
                              <strong>Tipo de Ação:</strong> {contract.process.actionType}
                            </p>
                          )}
                          <p className="text-sm text-[#6b5544]">
                            Criado em: {formatDateTimeBR(contract.contract.createdAt)}
                          </p>
                          {/* {contrato.arquivoAssinado && (
                        <p className="text-green-700 text-sm mt-1">
                          {contrato.arquivoAssinado.nome}
                        </p>
                      )} */}
                        </div>
                        <div className="flex gap-2 self-end sm:self-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: make this a modal like the process one
                              setSelectedContract(contract.contract.id);
                              setContractsTab('form');
                            }}
                            className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedContract(contract.contract.id);
                              setContractsTab('form');
                            }}
                            className="text-[#a16535] hover:text-[#8b5329] hover:bg-[#f6f3ee]"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#6b5544]">
                <FileText className="w-12 h-12 mx-auto mb-4 text-[#d4c4b0]" />
                <p>Nenhum processo encontrado.</p>
                <p className="text-sm">Tente buscar por número do processo ou documento do cliente.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}