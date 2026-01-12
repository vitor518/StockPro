import api from "@/lib/axios"
import type { Cliente, CreateClienteRequest } from "@/types/venda.types"

export const clientesService = {
  async getClientes(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>("/clientes")
    return response.data
  },

  async getClienteById(id: number): Promise<Cliente> {
    const response = await api.get<Cliente>(`/clientes/${id}`)
    return response.data
  },

  async createCliente(data: CreateClienteRequest): Promise<Cliente> {
    const response = await api.post<Cliente>("/clientes", data)
    return response.data
  },

  async updateCliente(id: number, data: CreateClienteRequest): Promise<Cliente> {
    const response = await api.put<Cliente>(`/clientes/${id}`, data)
    return response.data
  },

  async deleteCliente(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`)
  },
}
