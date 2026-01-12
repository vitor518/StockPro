"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ProdutoFormDialog } from "@/components/produtos/produto-form-dialog"
import { DeleteProdutoDialog } from "@/components/produtos/delete-produto-dialog"
import { produtosService } from "@/services/produtos.service"
import type { Produto, Categoria } from "@/types/produto.types"
import { formatCurrency } from "@/utils/formatters"
import { LOW_STOCK_THRESHOLD } from "@/utils/constants"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Package, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoria, setSelectedCategoria] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    loadProdutos()
    loadCategorias()
  }, [currentPage, pageSize])

  const loadProdutos = async () => {
    setIsLoading(true)
    try {
      const response = await produtosService.getProdutos(currentPage, pageSize)
      setProdutos(response.content)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("[v0] Error loading produtos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategorias = async () => {
    try {
      const data = await produtosService.getCategorias()
      setCategorias(data)
    } catch (error) {
      console.error("[v0] Error loading categorias:", error)
    }
  }

  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = selectedCategoria === "all" || produto.categoriaId === Number(selectedCategoria)
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "ATIVO" && produto.status === "ATIVO") ||
      (selectedStatus === "INATIVO" && produto.status === "INATIVO") ||
      (selectedStatus === "BAIXO_ESTOQUE" && produto.quantidadeEstoque < LOW_STOCK_THRESHOLD)

    return matchesSearch && matchesCategoria && matchesStatus
  })

  const handleEdit = (produto: Produto) => {
    setSelectedProduto(produto)
    setIsFormOpen(true)
  }

  const handleDelete = (produto: Produto) => {
    setSelectedProduto(produto)
    setIsDeleteOpen(true)
  }

  const handleSuccess = () => {
    loadProdutos()
    setSelectedProduto(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
            <p className="mt-1 text-gray-600">Gerencie o catálogo de produtos</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                  <SelectItem value="BAIXO_ESTOQUE">Baixo Estoque</SelectItem>
                </SelectContent>
              </Select>

              <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="25">25 por página</SelectItem>
                  <SelectItem value="50">50 por página</SelectItem>
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
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <div className="flex items-center justify-center py-8">
                          <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredProdutos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <div className="flex flex-col items-center justify-center py-12">
                          <Package className="mb-4 h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">Nenhum produto encontrado</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProdutos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">{produto.nome}</TableCell>
                        <TableCell>{produto.categoria?.nome || "—"}</TableCell>
                        <TableCell>{formatCurrency(produto.preco)}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "font-medium",
                              produto.quantidadeEstoque < LOW_STOCK_THRESHOLD ? "text-red-600" : "text-gray-900",
                            )}
                          >
                            {produto.quantidadeEstoque}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={produto.status === "ATIVO" ? "default" : "secondary"}>
                            {produto.status === "ATIVO" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(produto)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(produto)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-6 py-4">
                <p className="text-sm text-gray-600">
                  Página {currentPage + 1} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ProdutoFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        produto={selectedProduto}
        onSuccess={handleSuccess}
      />

      <DeleteProdutoDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        produto={selectedProduto}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  )
}
