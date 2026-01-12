"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { produtosService } from "@/services/produtos.service"
import type { Produto, Categoria, CreateProdutoRequest } from "@/types/produto.types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ProdutoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  produto?: Produto | null
  onSuccess: () => void
}

export function ProdutoFormDialog({ open, onOpenChange, produto, onSuccess }: ProdutoFormDialogProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState<CreateProdutoRequest>({
    nome: "",
    descricao: "",
    preco: 0,
    quantidadeEstoque: 0,
    categoriaId: 0,
    status: "ATIVO",
  })

  useEffect(() => {
    if (open) {
      loadCategorias()
      if (produto) {
        setFormData({
          nome: produto.nome,
          descricao: produto.descricao || "",
          preco: produto.preco,
          quantidadeEstoque: produto.quantidadeEstoque,
          categoriaId: produto.categoriaId,
          status: produto.status,
        })
      } else {
        setFormData({
          nome: "",
          descricao: "",
          preco: 0,
          quantidadeEstoque: 0,
          categoriaId: 0,
          status: "ATIVO",
        })
      }
    }
  }, [open, produto])

  const loadCategorias = async () => {
    try {
      const data = await produtosService.getCategorias()
      setCategorias(data)
    } catch (error) {
      console.error("[v0] Error loading categorias:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCategorias(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || formData.nome.length < 3) {
      toast({
        title: "Erro",
        description: "Nome deve ter no mínimo 3 caracteres",
        variant: "destructive",
      })
      return
    }

    if (formData.preco <= 0) {
      toast({
        title: "Erro",
        description: "Preço deve ser maior que zero",
        variant: "destructive",
      })
      return
    }

    if (formData.quantidadeEstoque < 0) {
      toast({
        title: "Erro",
        description: "Quantidade não pode ser negativa",
        variant: "destructive",
      })
      return
    }

    if (!formData.categoriaId) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      if (produto) {
        await produtosService.updateProduto(produto.id, formData)
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        })
      } else {
        await produtosService.createProduto(formData)
        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso!",
        })
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error("[v0] Error saving produto:", error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível salvar o produto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{produto ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {produto ? "Atualize as informações do produto" : "Cadastre um novo produto no sistema"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">
                Categoria <span className="text-red-500">*</span>
              </Label>
              <Select
                value={String(formData.categoriaId)}
                onValueChange={(value) => setFormData({ ...formData, categoriaId: Number(value) })}
                disabled={isLoadingCategorias || isLoading}
              >
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="preco">
                Preço (R$) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">
                Quantidade <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantidade"
                type="number"
                min="0"
                value={formData.quantidadeEstoque}
                onChange={(e) => setFormData({ ...formData, quantidadeEstoque: Number(e.target.value) })}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "ATIVO" | "INATIVO") => setFormData({ ...formData, status: value })}
                disabled={isLoading}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : produto ? (
                "Salvar Alterações"
              ) : (
                "Criar Produto"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
