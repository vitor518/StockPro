import type { Produto } from "./produto.types" // Assuming Produto is declared in another file

export interface Venda {
  id: number
  clienteId?: number
  cliente?: Cliente
  itens: ItemVenda[]
  total: number
  tipoPagamento: "DINHEIRO" | "CARTAO_CREDITO" | "PIX"
  status: "CONCLUIDA" | "CANCELADA" | "PENDENTE"
  dataVenda: string
}

export interface ItemVenda {
  id?: number
  produtoId: number
  produto?: Produto
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export interface Cliente {
  id: number
  nome: string
  email?: string
  telefone?: string
  cpfCnpj?: string
  endereco?: string
  totalCompras?: number
}

export interface CreateVendaRequest {
  clienteId?: number
  itens: {
    produtoId: number
    quantidade: number
    precoUnitario: number
  }[]
  tipoPagamento: "DINHEIRO" | "CARTAO_CREDITO" | "PIX"
}

export interface CreateClienteRequest {
  nome: string
  email?: string
  telefone?: string
  cpfCnpj?: string
  endereco?: string
}
