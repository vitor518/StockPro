import api from "@/lib/axios"
import type { Produto, Categoria, CreateProdutoRequest } from "@/types/produto.types"
import type { PaginatedResponse } from "@/types/api.types"

export const produtosService = {
  async getProdutos(page = 0, size = 10): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>("/produtos", {
      params: { page, size },
    })
    return response.data
  },

  async getProdutoById(id: number): Promise<Produto> {
    const response = await api.get<Produto>(`/produtos/${id}`)
    return response.data
  },

  async createProduto(data: CreateProdutoRequest): Promise<Produto> {
    const response = await api.post<Produto>("/produtos", data)
    return response.data
  },

  async updateProduto(id: number, data: CreateProdutoRequest): Promise<Produto> {
    const response = await api.put<Produto>(`/produtos/${id}`, data)
    return response.data
  },

  async deleteProduto(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`)
  },

  async getCategorias(): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>("/categorias")
    return response.data
  },
}
