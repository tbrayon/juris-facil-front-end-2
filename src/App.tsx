import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Container from './components/Container';

import { UsersProvider } from './contexts/UsersContext';
import { ClientsProvider } from './contexts/ClientsContext';
import { ProcessosProvider } from './contexts/ProcessosContext';
import { ContratosProvider } from './contexts/ContratosContext';
import { Toaster } from './components/ui/sonner';
import { ClientesProvider } from './contexts/ClientesContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersProvider>
        <ClientesProvider>
          <ClientsProvider>
            <ProcessosProvider>
              <ContratosProvider>
                <Toaster position="top-right" richColors />
                <Container />
              </ContratosProvider>
            </ProcessosProvider>
          </ClientsProvider>
        </ClientesProvider>
      </UsersProvider>
    </QueryClientProvider>
  );
}

export default App;
