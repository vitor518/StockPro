# StockPro - Sistema de Gestão de Estoque

Sistema completo de gestão de estoque desenvolvido em Next.js 16 com TypeScript, React 19 e integração com backend Spring Boot.

## 🚀 Funcionalidades

- **Dashboard**: Visão geral com métricas em tempo real (total de vendas, produtos em estoque, produtos ativos, vendas do mês)
- **Gestão de Produtos**: CRUD completo com filtros, paginação, controle de estoque e categorias
- **Vendas**: Registro de vendas com múltiplos produtos, histórico completo e venda rápida no dashboard
- **Clientes**: Cadastro de clientes com validação de CPF/CNPJ, telefone e email
- **Autenticação**: Sistema de login com JWT, proteção de rotas e refresh token
- **Configurações**: Gestão de perfil e alteração de senha

## 🔐 Credenciais de Teste

Para testar o sistema, utilize as seguintes credenciais:

### Usuário Administrador
```
Email: admin@stockpro.com
Senha: admin123
```

### Usuário Vendedor
```
Email: vendedor@stockpro.com
Senha: vendedor123
```

### Usuário Gerente
```
Email: gerente@stockpro.com
Senha: gerente123
```

## ⚙️ Configuração do Projeto

### 1. Pré-requisitos

- Node.js 18+ instalado
- Backend Spring Boot rodando na porta 8080
- npm ou yarn

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
npm install
# ou
yarn install
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# URL da API Backend (Spring Boot)
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Outras configurações opcionais
NEXT_PUBLIC_APP_NAME=StockPro
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 4. Executar o Projeto

#### Modo de Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em `http://localhost:3000`

#### Build de Produção
```bash
npm run build
npm run start
# ou
yarn build
yarn start
```

## 📁 Estrutura do Projeto

```
stockpro-frontend/
├── app/                          # Rotas do Next.js 16 (App Router)
│   ├── login/                    # Página de login
│   ├── dashboard/                # Dashboard principal
│   ├── produtos/                 # Gestão de produtos
│   ├── vendas/                   # Sistema de vendas
│   ├── clientes/                 # Gestão de clientes
│   ├── configuracoes/            # Configurações do usuário
│   └── layout.tsx                # Layout raiz
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (shadcn/ui)
│   ├── layout/                   # Componentes de layout (Sidebar, etc)
│   ├── dashboard/                # Componentes do dashboard
│   ├── produtos/                 # Componentes de produtos
│   ├── vendas/                   # Componentes de vendas
│   └── clientes/                 # Componentes de clientes
├── contexts/                     # Contextos React
│   └── auth-context.tsx          # Contexto de autenticação
├── services/                     # Serviços de API
│   ├── auth.service.ts           # Serviço de autenticação
│   ├── dashboard.service.ts      # Serviço do dashboard
│   ├── produtos.service.ts       # Serviço de produtos
│   ├── vendas.service.ts         # Serviço de vendas
│   └── clientes.service.ts       # Serviço de clientes
├── types/                        # Tipos TypeScript
│   ├── usuario.types.ts          # Tipos de usuário
│   ├── produto.types.ts          # Tipos de produto
│   ├── venda.types.ts            # Tipos de venda
│   └── dashboard.types.ts        # Tipos do dashboard
├── lib/                          # Utilitários
│   ├── axios.ts                  # Configuração do Axios
│   ├── utils.ts                  # Utilitários gerais
│   ├── formatters.ts             # Formatadores (moeda, data, etc)
│   └── validators.ts             # Validadores (CPF, CNPJ, etc)
└── hooks/                        # Hooks customizados
    └── use-mobile.tsx            # Hook para detectar mobile
```

## 🔌 Integração com Backend

O frontend se comunica com o backend Spring Boot através do Axios. As principais configurações estão em:

- **`lib/axios.ts`**: Configuração do cliente Axios com interceptors para JWT
- **`services/*.service.ts`**: Serviços que encapsulam as chamadas à API

### Endpoints Esperados do Backend

O backend Spring Boot deve fornecer os seguintes endpoints:

#### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Dados do usuário logado

#### Dashboard
- `GET /api/dashboard/metricas` - Métricas do dashboard

#### Produtos
- `GET /api/produtos` - Listar produtos (com paginação e filtros)
- `GET /api/produtos/{id}` - Buscar produto por ID
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/{id}` - Atualizar produto
- `DELETE /api/produtos/{id}` - Deletar produto

#### Vendas
- `GET /api/vendas` - Listar vendas (com paginação e filtros)
- `GET /api/vendas/{id}` - Buscar venda por ID
- `POST /api/vendas` - Criar venda

#### Clientes
- `GET /api/clientes` - Listar clientes (com paginação e busca)
- `GET /api/clientes/{id}` - Buscar cliente por ID
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/{id}` - Atualizar cliente
- `DELETE /api/clientes/{id}` - Deletar cliente

## 🎨 Tecnologias Utilizadas

### Core
- **Next.js 16** - Framework React com App Router
- **React 19.2** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização

### UI Components
- **shadcn/ui** - Componentes base
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Comunicação com API
- **Axios** - Cliente HTTP

### Utilitários
- **date-fns** - Manipulação de datas
- **sonner** - Notificações toast
- **class-variance-authority** - Variantes de classes CSS

## 🛡️ Segurança

- Autenticação via JWT (Bearer Token)
- Tokens armazenados em localStorage
- Interceptors do Axios para anexar token automaticamente
- Proteção de rotas com PrivateRoute
- Validação de CPF/CNPJ no frontend
- Sanitização de inputs

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

A sidebar colapsa automaticamente em dispositivos móveis com menu hamburguer.

## 🐛 Troubleshooting

### Erro de CORS
Se você encontrar erros de CORS, verifique se o backend Spring Boot está configurado corretamente:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

### Token Expirado
Se você receber erro 401 (Unauthorized), o token pode ter expirado. Faça logout e login novamente.

### Problemas de Conexão com Backend
Verifique se:
1. O backend Spring Boot está rodando na porta 8080
2. A variável `NEXT_PUBLIC_API_URL` está correta no `.env.local`
3. Não há firewall bloqueando as requisições

## 📝 Licença

Este projeto é privado e de uso interno.

## 👨‍💻 Desenvolvido por

StockPro Development Team - 2025
