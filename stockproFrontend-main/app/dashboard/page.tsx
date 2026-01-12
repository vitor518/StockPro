"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MetricCard } from "@/components/dashboard/metric-card"
import { ProdutosRecentesTable } from "@/components/dashboard/produtos-recentes-table"
import { VendaRapidaForm } from "@/components/dashboard/venda-rapida-form"
import { DollarSign, Package, AlertCircle, TrendingUp } from "lucide-react"
import { dashboardService } from "@/services/dashboard.service"
import type { DashboardResumo } from "@/types/dashboard.types"
import type { Produto } from "@/types/produto.types"
import { formatCurrency } from "@/utils/formatters"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [resumo, setResumo] = useState<DashboardResumo | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [resumoData, produtosData] = await Promise.all([
        dashboardService.getResumo(),
        dashboardService.getProdutosRecentes(),
      ])
      setResumo(resumoData)
      setProdutos(produtosData)
    } catch (error) {
      console.error("[v0] Error loading dashboard:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Visão geral do seu negócio</p>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Vendas Hoje"
            value={formatCurrency(resumo?.vendasHoje || 0)}
            icon={DollarSign}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <MetricCard
            title="Produtos no Estoque"
            value={resumo?.produtosEstoque || 0}
            icon={Package}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <MetricCard
            title="Alertas de Reposição"
            value={resumo?.alertasReposicao || 0}
            icon={AlertCircle}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
          <MetricCard
            title="Lucro Mensal"
            value={formatCurrency(resumo?.lucroMensal || 0)}
            icon={TrendingUp}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProdutosRecentesTable produtos={produtos} />
          </div>
          <div>
            <VendaRapidaForm />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
