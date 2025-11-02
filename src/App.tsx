import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Container from './components/Container';

import { UsersProvider } from './contexts/UsersContext';
import { ClientesProvider } from './contexts/ClientesContext';
import { ProcessosProvider } from './contexts/ProcessosContext';
import { ContratosProvider } from './contexts/ContratosContext';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersProvider>
        <ClientesProvider>
          <ProcessosProvider>
            <ContratosProvider>
              <Toaster position="top-right" richColors />
              <Container />
            </ContratosProvider>
          </ProcessosProvider>
        </ClientesProvider>
      </UsersProvider>
    </QueryClientProvider>
  );
}

export default App;
