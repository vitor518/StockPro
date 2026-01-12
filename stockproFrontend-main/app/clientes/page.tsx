"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ClienteFormDialog } from "@/components/clientes/cliente-form-dialog"
import { DeleteClienteDialog } from "@/components/clientes/delete-cliente-dialog"
import { clientesService } from "@/services/clientes.service"
import type { Cliente } from "@/types/venda.types"
import { formatCPFCNPJ, formatPhone, formatCurrency } from "@/utils/formatters"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    setIsLoading(true)
    try {
      const data = await clientesService.getClientes()
      setClientes(data)
    } catch (error) {
      console.error("[v0] Error loading clientes:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredClientes = clientes.filter((cliente) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      cliente.nome.toLowerCase().includes(searchLower) ||
      cliente.email?.toLowerCase().includes(searchLower) ||
      cliente.cpfCnpj?.toLowerCase().includes(searchLower)
    )
  })

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsFormOpen(true)
  }

  const handleDelete = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsDeleteOpen(true)
  }

  const handleSuccess = () => {
    loadClientes()
    setSelectedCliente(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="mt-1 text-gray-600">Gerencie seus clientes</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou CPF/CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Total Compras</TableHead>
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
                  ) : filteredClientes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <div className="flex flex-col items-center justify-center py-12">
                          <Users className="mb-4 h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">Nenhum cliente encontrado</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell>{cliente.cpfCnpj ? formatCPFCNPJ(cliente.cpfCnpj) : "—"}</TableCell>
                        <TableCell>{cliente.email || "—"}</TableCell>
                        <TableCell>{cliente.telefone ? formatPhone(cliente.telefone) : "—"}</TableCell>
                        <TableCell className="font-semibold">
                          {cliente.totalCompras ? formatCurrency(cliente.totalCompras) : formatCurrency(0)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(cliente)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(cliente)}>
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
          </CardContent>
        </Card>
      </div>

      <ClienteFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        cliente={selectedCliente}
        onSuccess={handleSuccess}
      />

      <DeleteClienteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        cliente={selectedCliente}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  )
}
