import { PlusCircle, Trash2 } from 'lucide-react';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';
import { useCompetencies } from '@/contexts/CompetenciesContext';
import { useJurisdictions } from '@/contexts/JurisdictionsContext';
import { toast } from 'sonner';
import { useCourtTypes } from '@/contexts/CourtTypesContext';
import { useCourts } from '@/contexts/CourtsContext';
import { useProceduralStages } from '@/contexts/ProceduralStagesContext';
import { useStatus } from '@/contexts/StatusContext';

export interface SelectData {
  id: string
  name: string
}

export interface ManageSelectOptionsProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  field: SelectFields | undefined
  data: SelectData[]
}

const fieldLabels = {
  status: 'Status do Processo',
  stage: 'Fase Processual',
  courtTypes: 'Tipo de Tribunal',
  courts: 'Tribunal',
  jurisdiction: 'Tipo de Jurisdição',
  competence: 'Competência',
} as const;

export type SelectFields = keyof typeof fieldLabels;

export function mapField(field: SelectFields): string {
  return fieldLabels[field];
}

export function ManageSelectOptions({ isOpen, setIsOpen, field, data }: ManageSelectOptionsProps) {

  const [newOption, setNewOption] = useState("");
  const [newOptionCourtType, setNewOptionCourtType] = useState("")
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  // const [inactiveOptionDialogOpen, setInactiveDialogOpen] = useState(false)
  // const [optionToInactive, setOptionToInactive] = useState<ManagementData>({ id: "", name: "" });

  const { addCompetenceMutation } = useCompetencies();
  const { addJurisdictionMutation } = useJurisdictions();
  const { addCourtTypeMutation, courtTypes } = useCourtTypes();
  const { addCourtMutation } = useCourts();
  const { addProceduralStageMutation } = useProceduralStages();
  const { addStatusMutation } = useStatus();

  const addOptionMap: Record<SelectFields, (name: string, courtType?: string) => void> = {
    competence: (name: string) => {
      addCompetenceMutation.mutate({ name, active: true }, {
        onSuccess: () => {
          setAddDialogOpen(false);
          setIsOpen(false);
        }
      })
    },
    courtTypes: (name: string) => {
      addCourtTypeMutation.mutate({ name, active: true }, {
        onSuccess: () => {
          setAddDialogOpen(false);
          setIsOpen(false);
        }
      })
    },
    courts: (name: string, courtType: string | undefined) => {
      if (!courtType) {
        return toast.info("Por favor, preencha um Tipo de Tribunal para cadastrar o Tribunal")
      } else {
        addCourtMutation.mutate({ name, courtType, active: true }, {
          onSuccess: () => {
            setAddDialogOpen(false);
            setIsOpen(false);
          }
        })
      }
    },
    jurisdiction: (name: string) => {
      addJurisdictionMutation.mutate({ name, active: true }, {
        onSuccess: () => {
          setAddDialogOpen(false);
          setIsOpen(false);
        }
      })
    },
    stage: (name: string) => {
      addProceduralStageMutation.mutate({ name, active: true }, {
        onSuccess: () => {
          setAddDialogOpen(false);
          setIsOpen(false);
        }
      })
    },
    status: (name: string) => {
      addStatusMutation.mutate({ name, active: true }, {
        onSuccess: () => {
          setAddDialogOpen(false);
          setIsOpen(false);
        }
      })
    },
  } as const;

  const handleAddNewOption = () => {
    field && addOptionMap[field](newOption);
  }

  return (
    <>
      {/* Dialog para adicionar opção customizada */}
      <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-white border-[#d4c4b0]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16]">Adicionar Nova Opção</DialogTitle>
            <DialogDescription className="text-[#6b5544]">
              Digite o nome da nova opção que deseja adicionar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#4a3629]">Nova Opção</Label>
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Digite a nova opção..."
                className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20"
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    handleAddNewOption();
                  }
                }}
              />
            </div>
            {field === "courts" &&
              (<div className="space-y-2">
                <div className="h-6 flex items-center">
                  <Label htmlFor="tipo-tribunal" className="text-[#4a3629]">
                    Tipo de Tribunal
                  </Label>
                </div>
                <Select
                  value={newOptionCourtType}
                  onValueChange={(value) => {
                    setNewOptionCourtType(value);
                  }}
                >
                  <SelectTrigger className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] focus:border-[#a16535] focus:ring-[#a16535]/20">
                    <SelectValue placeholder="Selecione o tipo de tribunal" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#d4c4b0] max-h-[300px]">
                    {courtTypes.map((option) => (
                      <SelectItem key={option.id} value={option.id} className="text-[#2d1f16] hover:bg-[#f6f3ee]">
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>)
            }
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddNewOption}
              className="bg-[#a16535] hover:bg-[#8b5329] text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              className="border-[#d4c4b0] text-[#2d1f16] hover:bg-[#f6f3ee] hover:text-[#2d1f16]"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para gerenciar opções existentes */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white border-[#d4c4b0] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#2d1f16]">
              Gerenciar Opções - {field && mapField(field)}
            </DialogTitle>
            <DialogDescription className="text-[#6b5544]">
              Clique no ícone de lixeira para excluir uma opção.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {data.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-3 bg-[#f6f3ee] border border-[#d4c4b0] rounded-lg hover:bg-[#e8b882]/20 transition-colors"
                >
                  <span className="text-[#2d1f16]">{option.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    // onClick={() => setOptionToInactive(option)}
                    onClick={() => toast.info("Em construção")}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {data.length === 0 && (
                <p className="text-center text-[#6b5544] py-8">
                  Nenhuma opção cadastrada.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-[#a16535] hover:bg-[#8b5329] text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white transition-all duration-200"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para confirmar inativação */}
      {/* 
          <AlertDialog open={inactiveOptionDialogOpen} onOpenChange={setInactiveDialogOpen}>
          <AlertDialogContent className="bg-white border-[#d4c4b0]">
          <AlertDialogHeader>
          <AlertDialogTitle className="text-[#2d1f16]">
          Tem certeza que deseja excluir?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#6b5544]">
          Você está prestes a inativar a opção "<strong className="text-[#a16535]">{optionToInactive.name}</strong>".
          Tem certeza que deseja continuar?
          </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
          <AlertDialogCancel className="border-[#d4c4b0] text-[#2d1f16] hover:bg-[#f6f3ee] hover:text-[#2d1f16]">
          Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
          onClick={() => inactiveOption(optionToInactive)}
          className="bg-red-600 hover:bg-red-700 text-white"
          >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
          </AlertDialogAction>
          </AlertDialogFooter>
          </AlertDialogContent>
          </AlertDialog>
      */}
    </>
  )
}