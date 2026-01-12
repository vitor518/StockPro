"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VendaDetalhesDialog } from "@/components/vendas/venda-detalhes-dialog"
import { vendasService } from "@/services/vendas.service"
import type { Venda } from "@/types/venda.types"
import { formatCurrency, formatDateTime } from "@/utils/formatters"
import { PAYMENT_TYPES, VENDA_STATUS } from "@/utils/constants"
import { Plus, ShoppingCart, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [filterTipoPagamento, setFilterTipoPagamento] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    loadVendas()
  }, [])

  const loadVendas = async () => {
    setIsLoading(true)
    try {
      const data = await vendasService.getVendas()
      setVendas(data)
    } catch (error) {
      console.error("[v0] Error loading vendas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vendas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (venda: Venda) => {
    setSelectedVenda(venda)
    setIsDetailsOpen(true)
  }

  const filteredVendas = vendas.filter((venda) => {
    const matchesPagamento = filterTipoPagamento === "all" || venda.tipoPagamento === filterTipoPagamento
    const matchesStatus = filterStatus === "all" || venda.status === filterStatus
    return matchesPagamento && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
            <p className="mt-1 text-gray-600">Gerencie as vendas do sistema</p>
          </div>
          <Link href="/vendas/nova">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Select value={filterTipoPagamento} onValueChange={setFilterTipoPagamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os pagamentos</SelectItem>
                  <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                  <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        <div className="flex items-center justify-center py-8">
                          <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredVendas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        <div className="flex flex-col items-center justify-center py-12">
                          <ShoppingCart className="mb-4 h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">Nenhuma venda encontrada</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVendas.map((venda) => (
                      <TableRow key={venda.id}>
                        <TableCell className="font-medium">#{venda.id}</TableCell>
                        <TableCell>{formatDateTime(venda.dataVenda)}</TableCell>
                        <TableCell>{venda.cliente?.nome || "Venda Direta"}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(venda.total)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{PAYMENT_TYPES[venda.tipoPagamento]}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              venda.status === "CONCLUIDA"
                                ? "default"
                                : venda.status === "CANCELADA"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {VENDA_STATUS[venda.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(venda)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <VendaDetalhesDialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen} venda={selectedVenda} />
    </DashboardLayout>
  )
}
