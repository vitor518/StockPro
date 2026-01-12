export interface Produto {
  id: number
  nome: string
  descricao?: string
  preco: number
  quantidadeEstoque: number
  categoriaId: number
  categoria?: Categoria
  status: "ATIVO" | "INATIVO"
  createdAt?: string
  updatedAt?: string
}

export interface Categoria {
  id: number
  nome: string
  descricao?: string
}

export interface CreateProdutoRequest {
  nome: string
  descricao?: string
  preco: number
  quantidadeEstoque: number
  categoriaId: number
  status?: "ATIVO" | "INATIVO"
}
