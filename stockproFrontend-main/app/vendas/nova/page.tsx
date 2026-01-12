"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { produtosService } from "@/services/produtos.service"
import { clientesService } from "@/services/clientes.service"
import { vendasService } from "@/services/vendas.service"
import type { Produto } from "@/types/produto.types"
import type { Cliente } from "@/types/venda.types"
import { formatCurrency } from "@/utils/formatters"
import { PAYMENT_TYPES } from "@/utils/constants"
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NovaVendaPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedClienteId, setSelectedClienteId] = useState<string>("direct")
  const [selectedProdutoId, setSelectedProdutoId] = useState<string>("0")
  const [quantidade, setQuantidade] = useState<string>("1")
  const [tipoPagamento, setTipoPagamento] = useState<"DINHEIRO" | "CARTAO_CREDITO" | "PIX">("DINHEIRO")
  const [itensVenda, setItensVenda] = useState<
    Array<{
      produtoId: number
      produto: Produto
      quantidade: number
      precoUnitario: number
      subtotal: number
    }>
  >([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [produtosData, clientesData] = await Promise.all([
        produtosService.getProdutos(0, 100),
        clientesService.getClientes(),
      ])
      setProdutos(produtosData.content.filter((p) => p.status === "ATIVO"))
      setClientes(clientesData)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const selectedProduto = produtos.find((p) => p.id === Number(selectedProdutoId))

  const handleAddItem = () => {
    if (!selectedProdutoId || !quantidade) {
      toast({
        title: "Erro",
        description: "Selecione um produto e informe a quantidade",
        variant: "destructive",
      })
      return
    }

    const qtd = Number(quantidade)
    if (qtd <= 0) {
      toast({
        title: "Erro",
        description: "Quantidade deve ser maior que zero",
        variant: "destructive",
      })
      return
    }

    if (!selectedProduto) return

    if (qtd > selectedProduto.quantidadeEstoque) {
      toast({
        title: "Erro",
        description: "Quantidade indisponível em estoque",
        variant: "destructive",
      })
      return
    }

    // Check if product already in cart
    const existingItem = itensVenda.find((item) => item.produtoId === selectedProduto.id)
    if (existingItem) {
      const newQtd = existingItem.quantidade + qtd
      if (newQtd > selectedProduto.quantidadeEstoque) {
        toast({
          title: "Erro",
          description: "Quantidade total excede o estoque disponível",
          variant: "destructive",
        })
        return
      }

      setItensVenda(
        itensVenda.map((item) =>
          item.produtoId === selectedProduto.id
            ? {
                ...item,
                quantidade: newQtd,
                subtotal: newQtd * item.precoUnitario,
              }
            : item,
        ),
      )
    } else {
      setItensVenda([
        ...itensVenda,
        {
          produtoId: selectedProduto.id,
          produto: selectedProduto,
          quantidade: qtd,
          precoUnitario: selectedProduto.preco,
          subtotal: qtd * selectedProduto.preco,
        },
      ])
    }

    setSelectedProdutoId("0")
    setQuantidade("1")
  }

  const handleRemoveItem = (produtoId: number) => {
    setItensVenda(itensVenda.filter((item) => item.produtoId !== produtoId))
  }

  const handleUpdateQuantity = (produtoId: number, newQuantidade: number) => {
    if (newQuantidade <= 0) return

    const item = itensVenda.find((i) => i.produtoId === produtoId)
    if (!item) return

    if (newQuantidade > item.produto.quantidadeEstoque) {
      toast({
        title: "Erro",
        description: "Quantidade excede o estoque disponível",
        variant: "destructive",
      })
      return
    }

    setItensVenda(
      itensVenda.map((item) =>
        item.produtoId === produtoId
          ? {
              ...item,
              quantidade: newQuantidade,
              subtotal: newQuantidade * item.precoUnitario,
            }
          : item,
      ),
    )
  }

  const total = itensVenda.reduce((sum, item) => sum + item.subtotal, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (itensVenda.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item à venda",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await vendasService.createVenda({
        clienteId: selectedClienteId !== "direct" ? Number(selectedClienteId) : undefined,
        itens: itensVenda.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
        })),
        tipoPagamento,
      })

      toast({
        title: "Sucesso",
        description: "Venda registrada com sucesso!",
      })

      router.push("/vendas")
    } catch (error: any) {
      console.error("[v0] Error creating venda:", error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível registrar a venda",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingData) {
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/vendas")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nova Venda</h1>
            <p className="mt-1 text-gray-600">Registre uma nova venda no sistema</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Venda</CardTitle>
              <CardDescription>Selecione o cliente e a forma de pagamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente (Opcional)</Label>
                  <Select value={selectedClienteId} onValueChange={setSelectedClienteId} disabled={isSubmitting}>
                    <SelectTrigger id="cliente">
                      <SelectValue placeholder="Venda Direta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Venda Direta</SelectItem>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={String(cliente.id)}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pagamento">
                    Forma de Pagamento <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={tipoPagamento}
                    onValueChange={(value: any) => setTipoPagamento(value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="pagamento">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DINHEIRO">{PAYMENT_TYPES.DINHEIRO}</SelectItem>
                      <SelectItem value="CARTAO_CREDITO">{PAYMENT_TYPES.CARTAO_CREDITO}</SelectItem>
                      <SelectItem value="PIX">{PAYMENT_TYPES.PIX}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adicionar Produtos</CardTitle>
              <CardDescription>Selecione os produtos e quantidades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="produto">Produto</Label>
                  <Select value={selectedProdutoId} onValueChange={setSelectedProdutoId} disabled={isSubmitting}>
                    <SelectTrigger id="produto">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.map((produto) => (
                        <SelectItem key={produto.id} value={String(produto.id)}>
                          {produto.nome} - {formatCurrency(produto.preco)} (Est: {produto.quantidadeEstoque})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qtd">Quantidade</Label>
                  <div className="flex gap-2">
                    <Input
                      id="qtd"
                      type="number"
                      min="1"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <Button type="button" onClick={handleAddItem} disabled={isSubmitting}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {selectedProduto && (
                <div className="rounded-lg bg-blue-50 p-3 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Estoque disponível:</span> {selectedProduto.quantidadeEstoque}{" "}
                    unidades
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itens da Venda</CardTitle>
            </CardHeader>
            <CardContent>
              {itensVenda.length === 0 ? (
                <div className="py-8 text-center text-gray-500">Nenhum item adicionado</div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="w-[120px]">Quantidade</TableHead>
                        <TableHead className="text-right">Preço Unit.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="w-[70px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itensVenda.map((item) => (
                        <TableRow key={item.produtoId}>
                          <TableCell className="font-medium">{item.produto.nome}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantidade}
                              onChange={(e) => handleUpdateQuantity(item.produtoId, Number(e.target.value))}
                              disabled={isSubmitting}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(item.precoUnitario)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(item.subtotal)}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.produtoId)}
                              disabled={isSubmitting}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex justify-end border-t pt-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total da Venda</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(total)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/vendas")} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting || itensVenda.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finalizando...
                </>
              ) : (
                "Finalizar Venda"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
