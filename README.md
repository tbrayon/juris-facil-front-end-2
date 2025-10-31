# ⚖️ Juris Fácil Front-End


---

## 🧠 Tecnologias utilizadas

- **React + TypeScript + SWC (via Vite)**
- **TailwindCSS + PostCSS + Autoprefixer**
- **Shadcn UI + Radix UI + Lucide**
- **Validação e formulários:** React Hook Form + Zod  
- **Gráficos e componentes dinâmicos:** Recharts, Embla, Sonner, etc.
- **Banco de dados : Context API do React.**

### ✨ Funcionalidades

* 🧑‍🤝‍🧑 **Gestão de Clientes:** Cadastro, consulta e edição de clientes (Pessoa Física e Jurídica).
* ⚖️ **Gestão de Processos:** Detalhamento completo de processos.
* 🗓️ **Controle de Prazos:** Visualização e acompanhamento de prazos e audiências.
* ✍️ **Gestão de Contratos:** Geração automática e edição de contratos de honorários.
* 📊 **Dashboard Analítico:** Gráficos e métricas sobre o status dos processos.
* 📄 **Relatórios:** Geração e exportação de relatórios em formato CSV.

---

## ⚙️ Passo a passo de instalação


**Configurações recomendadas:**

✔ mostra a pasta ```ls``` >> **Front-end-juris-facil**  
✔ entrar na pasta ```cd``` >> **Front-end-juris-facil**  
✔ **npm install vite**  
✔ o **node** deve estar atualizado...

### 1️⃣ Inicializar o NPM
```bash
npm install
```

---

### 2️⃣ Instalar React e React DOM
```bash
npm install react react-dom
```

---

### 3️⃣ Criar projeto com Vite
```bash
npm install vite
```
faca ot teste: 

```bash
npm run dev
```


---

### 4️⃣ Instalar Tailwind CSS e PostCSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

> Isso cria os arquivos `tailwind.config.js` e `postcss.config.js`.

---

### 5️⃣ Instalar Shadcn e utilitários principais
```bash
npm install class-variance-authority tailwind-merge
```

---

### 6️⃣ Instalar Radix UI e Lucide
```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toggle-group @radix-ui/react-tooltip @radix-ui/react-slot lucide-react
```

---

### 7️⃣ Instalar outras bibliotecas usadas no projeto
```bash
npm install react-hook-form @hookform/resolvers zod react-day-picker date-fns recharts embla-carousel-react react-resizable-panels cmdk sonner input-otp vaul
```

---

### 8️⃣ Instalar dependências de desenvolvimento
```bash
npm install -D @vitejs/plugin-react-swc @types/node
```

---

### 9️⃣ Rodar o projeto
```bash
npm run dev
```

---


## 💡 Observações

- O **banco de dados** utiliza a **Context API do React**, permitindo gerenciamento de estado global e simulação de dados locais.
- Para integração futura com um **back-end (API real)**, é possível conectar via Axios ou Fetch.

---


## 🏁 Como executar

1. Clone este repositório:
   ```bash
   git clone https://github.com/tbrayon/juris-facil-front-end.git
   cd juris-facil-front-end
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no navegador:
   ```
   http://localhost:5173
   ```

---


✨ **Juris Fácil — Simplificando o acesso à informação jurídica.**



