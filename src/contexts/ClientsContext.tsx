import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/api/axios";
import axios from "axios";

// ------------------------
// Zod Schema
// ------------------------
export const clientSchema = z.object({
  id: z.uuid(),
  type: z.enum(["CPF", "CNPJ"]),
  document: z.string().max(14).optional().nullable(),
  name: z.string().min(1),

  // Person fields
  birthDate: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),

  // Enterprise fields
  fantasyName: z.string().optional().nullable(),
  representativeName: z.string().optional().nullable(),

  // Contact fields
  email: z.email(),
  phones: z.array(z.string())
    .optional()
    .nullable(),
  address: z
    .object({
      zipCode: z.string().max(10),
      state: z.string().min(2).max(2),
      city: z.string().min(3),
      neighborhood: z.string().min(3),
      street: z.string().min(3),
      number: z.string().min(1),
      complement: z.string().optional(),
    }).optional(),

  // System fields
  lastUpdatedBy: z.uuid(),
  lastUpdatedAt: z.coerce.date().optional(),
  createdBy: z.uuid(),
  createdAt: z.coerce.date().optional(),
});

export type Client = z.infer<typeof clientSchema>;
export type NewClientInput = Omit<Client, "id" | "createdAt" | "createdBy" | "lastUpdatedAt" | "lastUpdatedBy">;

// ------------------------
// API Functions
// ------------------------
async function fetchClients(): Promise<Client[]> {
  try {
    const { data } = await api.get("/clients");

    return z.array(clientSchema).parse(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
    }

    throw error;
  }
}

async function createClient(client: NewClientInput) {
  try {
    const { data } = await api.post("/clients", client);
    return clientSchema.parse(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
    }

    throw error;
  }
}

async function updateClient(id: string, client: NewClientInput) {
  try {
    const { data } = await api.patch(`/clients/${id}`, client);
    return clientSchema.parse(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
    }

    throw error;
  }
}


// ------------------------
// Context Type
// ------------------------
export interface ClientsContextType {
  clients: Client[];
  loading: boolean;
  error: unknown;
  addClientMutation: ReturnType<typeof useMutation<Client, unknown, NewClientInput>>;
  updateClientMutation: ReturnType<typeof useMutation<Client, unknown, { id: string, client: NewClientInput }>>;
}

// ------------------------
// Context
// ------------------------
const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

// ------------------------
// Provider
// ------------------------
export function ClientsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: clients = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  const addClientMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      toast.success("Cliente cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar cliente.");
      console.log(error);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, client }: { id: string; client: NewClientInput }) =>
      updateClient(id, client),
    onSuccess: () => {
      toast.success("Cliente atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar cliente.");
    },
  });

  return (
    <ClientsContext.Provider
      value={{
        clients,
        loading,
        error,
        addClientMutation,
        updateClientMutation,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
}

// ------------------------
// Hook
// ------------------------
export function useClients() {
  const context = useContext(ClientsContext);
  if (!context)
    throw new Error("useClients must be used within a ClientsProvider");
  return context;
}

