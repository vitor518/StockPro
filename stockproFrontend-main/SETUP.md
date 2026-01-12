# Guia de Configuração do StockPro

Este guia detalha o processo completo de configuração do frontend StockPro para integração com o backend Spring Boot.

## Passo 1: Instalação do Node.js

Certifique-se de ter o Node.js versão 18 ou superior instalado.

Verifique a versão:
```bash
node --version
npm --version
```

## Passo 2: Clone e Instalação

```bash
# Clone o repositório (se aplicável)
git clone <seu-repositorio>
cd stockpro-frontend

# Instale as dependências
npm install
```

## Passo 3: Configuração de Ambiente

### 3.1 Criar arquivo .env.local

```bash
# Copie o arquivo de exemplo
cp .env.local.example .env.local
```

### 3.2 Editar .env.local

Abra o arquivo `.env.local` e configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Se seu backend estiver rodando em outra porta ou host, ajuste a URL.

## Passo 4: Configuração do Backend (Spring Boot)

### 4.1 Configurar CORS

No seu backend Spring Boot, adicione a configuração CORS:

```java
// src/main/java/com/stockpro/config/CorsConfig.java
package com.stockpro.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
```

### 4.2 Estrutura de DTOs Esperada

O frontend espera que o backend retorne os dados no seguinte formato:

#### Resposta de Login
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "expiresIn": 3600,
  "usuario": {
    "id": 1,
    "nome": "Admin",
    "email": "admin@stockpro.com",
    "perfil": "ADMIN"
  }
}
```

#### Resposta de Lista de Produtos
```json
{
  "content": [
    {
      "id": 1,
      "nome": "Notebook Dell",
      "descricao": "Notebook Dell Inspiron",
      "preco": 3500.00,
      "quantidade": 10,
      "categoriaId": 1,
      "categoriaNome": "Eletrônicos",
      "ativo": true,
      "dataCadastro": "2025-01-11T10:00:00"
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "size": 10,
  "number": 0
}
```

#### Resposta de Métricas do Dashboard
```json
{
  "totalVendas": 150000.50,
  "totalProdutos": 250,
  "produtosAtivos": 230,
  "vendasMes": 45000.00,
  "produtosRecentes": [
    {
      "id": 1,
      "nome": "Notebook Dell",
      "preco": 3500.00,
      "quantidade": 10,
      "categoriaId": 1
    }
  ]
}
```

## Passo 5: Executar o Projeto

### 5.1 Modo Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em: http://localhost:3000

### 5.2 Build de Produção

```bash
npm run build
npm run start
```

## Passo 6: Testar a Aplicação

### 6.1 Acesse o Sistema

Abra o navegador e acesse: http://localhost:3000

### 6.2 Faça Login

Use as credenciais de teste (admin, vendedor ou gerente conforme o README.md)

### 6.3 Verifique as Funcionalidades

- Dashboard: Veja as métricas
- Produtos: Liste, crie, edite e delete produtos
- Vendas: Registre uma nova venda
- Clientes: Cadastre clientes

## Passo 7: Verificação de Problemas

### Problema: Erro de CORS

Sintoma: Console do navegador mostra erro de CORS

Solução:
- Verifique se o backend tem a configuração CORS (Passo 4.1)
- Verifique se a URL no .env.local está correta
- Reinicie o backend após adicionar a configuração CORS

### Problema: 401 Unauthorized

Sintoma: Todas as requisições retornam 401

Solução:
- Verifique se o endpoint de login está correto
- Verifique se o token JWT está sendo gerado corretamente no backend
- Verifique se o token está sendo enviado no header Authorization

### Problema: Backend não responde

Sintoma: Erro de conexão recusada ou timeout

Solução:
- Verifique se o backend Spring Boot está rodando
- Verifique se está na porta 8080
- Teste o backend diretamente com curl ou Postman

### Problema: Dados não aparecem

Sintoma: Páginas carregam mas sem dados

Solução:
- Abra o Console do navegador (F12) e veja os erros
- Verifique se o formato dos dados retornados pelo backend está correto
- Verifique os logs do backend

## Passo 8: Deploy em Produção

### 8.1 Atualizar variáveis de ambiente

Configure NEXT_PUBLIC_API_URL para apontar para sua API de produção

### 8.2 Build

```bash
npm run build
```

### 8.3 Deploy na Vercel

Conecte seu repositório Git diretamente na Vercel ou use a CLI:

```bash
npm i -g vercel
vercel --prod
```

## Recursos Adicionais

- Documentação Next.js 16: https://nextjs.org/docs
- Documentação Axios: https://axios-http.com/docs/intro
- Documentação shadcn/ui: https://ui.shadcn.com
- Documentação React Hook Form: https://react-hook-form.com

## Suporte

Para problemas ou dúvidas, consulte a documentação ou entre em contato com a equipe de desenvolvimento.
