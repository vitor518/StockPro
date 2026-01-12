import api from "@/lib/axios"
import type { Venda, CreateVendaRequest } from "@/types/venda.types"

export const vendasService = {
  async getVendas(dataInicio?: string, dataFim?: string): Promise<Venda[]> {
    const response = await api.get<Venda[]>("/vendas", {
      params: { dataInicio, dataFim },
    })
    return response.data
  },

  async createVenda(data: CreateVendaRequest): Promise<Venda> {
    const response = await api.post<Venda>("/vendas", data)
    return response.data
  },

  async getVendaById(id: number): Promise<Venda> {
    const response = await api.get<Venda>(`/vendas/${id}`)
    return response.data
  },
}
