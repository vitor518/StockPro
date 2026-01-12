import api from "@/lib/axios"
import type { DashboardResumo } from "@/types/dashboard.types"
import type { Produto } from "@/types/produto.types"

export const dashboardService = {
  async getResumo(): Promise<DashboardResumo> {
    const response = await api.get<DashboardResumo>("/dashboard/resumo")
    return response.data
  },

  async getProdutosRecentes(): Promise<Produto[]> {
    const response = await api.get<Produto[]>("/dashboard/produtos-recentes")
    return response.data
  },
}
