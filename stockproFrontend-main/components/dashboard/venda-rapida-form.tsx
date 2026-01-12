"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { produtosService } from "@/services/produtos.service"
import { vendasService } from "@/services/vendas.service"
import type { Produto } from "@/types/produto.types"
import { formatCurrency } from "@/utils/formatters"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function VendaRapidaForm() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [selectedProdutoId, setSelectedProdutoId] = useState<string>("")
  const [quantidade, setQuantidade] = useState<string>("1")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadProdutos()
  }, [])

  const loadProdutos = async () => {
    try {
      const response = await produtosService.getProdutos(0, 100)
      setProdutos(response.content.filter((p) => p.status === "ATIVO"))
    } catch (error) {
      console.error("[v0] Error loading produtos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive",
      })
    } finally {
      setIsLoadingProdutos(false)
    }
  }

  const selectedProduto = produtos.find((p) => p.id === Number(selectedProdutoId))
  const total = selectedProduto ? selectedProduto.preco * Number(quantidade) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProdutoId || !quantidade) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
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

    if (selectedProduto && qtd > selectedProduto.quantidadeEstoque) {
      toast({
        title: "Erro",
        description: "Quantidade indisponível em estoque",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await vendasService.createVenda({
        itens: [
          {
            produtoId: Number(selectedProdutoId),
            quantidade: qtd,
            precoUnitario: selectedProduto!.preco,
          },
        ],
        tipoPagamento: "DINHEIRO",
      })

      toast({
        title: "Sucesso",
        description: "Venda realizada com sucesso!",
      })

      // Reset form
      setSelectedProdutoId("")
      setQuantidade("1")
      loadProdutos() // Recarregar para atualizar estoque
    } catch (error: any) {
      console.error("[v0] Error creating venda:", error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível realizar a venda",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Venda Rápida</CardTitle>
        <CardDescription>Registre uma venda de forma rápida</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="produto">Produto</Label>
            <Select
              value={selectedProdutoId}
              onValueChange={setSelectedProdutoId}
              disabled={isLoadingProdutos || isLoading}
            >
              <SelectTrigger id="produto">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((produto) => (
                  <SelectItem key={produto.id} value={String(produto.id)}>
                    {produto.nome} - {formatCurrency(produto.preco)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduto && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">Estoque disponível:</span> {selectedProduto.quantidadeEstoque} unidades
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total</span>
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Finalizar Venda"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
