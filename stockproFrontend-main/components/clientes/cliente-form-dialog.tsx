"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { clientesService } from "@/services/clientes.service"
import type { Cliente, CreateClienteRequest } from "@/types/venda.types"
import { validateCPF, validateCNPJ, validateEmail } from "@/utils/validators"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ClienteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: Cliente | null
  onSuccess: () => void
}

export function ClienteFormDialog({ open, onOpenChange, cliente, onSuccess }: ClienteFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<CreateClienteRequest>({
    nome: "",
    email: "",
    telefone: "",
    cpfCnpj: "",
    endereco: "",
  })

  useEffect(() => {
    if (open) {
      if (cliente) {
        setFormData({
          nome: cliente.nome,
          email: cliente.email || "",
          telefone: cliente.telefone || "",
          cpfCnpj: cliente.cpfCnpj || "",
          endereco: cliente.endereco || "",
        })
      } else {
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          cpfCnpj: "",
          endereco: "",
        })
      }
    }
  }, [open, cliente])

  const handleTelefoneChange = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/\D/g, "")
    // Format as (XX) XXXXX-XXXX
    let formatted = cleaned
    if (cleaned.length > 2) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    }
    if (cleaned.length > 7) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
    }
    setFormData({ ...formData, telefone: formatted })
  }

  const handleCpfCnpjChange = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/\D/g, "")
    let formatted = cleaned

    if (cleaned.length <= 11) {
      // Format as CPF: XXX.XXX.XXX-XX
      if (cleaned.length > 3) {
        formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
      }
      if (cleaned.length > 6) {
        formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
      }
      if (cleaned.length > 9) {
        formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`
      }
    } else {
      // Format as CNPJ: XX.XXX.XXX/XXXX-XX
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`
      }
      if (cleaned.length > 5) {
        formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`
      }
      if (cleaned.length > 8) {
        formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`
      }
      if (cleaned.length > 12) {
        formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`
      }
    }

    setFormData({ ...formData, cpfCnpj: formatted })
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

    if (formData.email && !validateEmail(formData.email)) {
      toast({
        title: "Erro",
        description: "Email inválido",
        variant: "destructive",
      })
      return
    }

    if (formData.cpfCnpj) {
      const cleaned = formData.cpfCnpj.replace(/\D/g, "")
      if (cleaned.length === 11 && !validateCPF(formData.cpfCnpj)) {
        toast({
          title: "Erro",
          description: "CPF inválido",
          variant: "destructive",
        })
        return
      }
      if (cleaned.length === 14 && !validateCNPJ(formData.cpfCnpj)) {
        toast({
          title: "Erro",
          description: "CNPJ inválido",
          variant: "destructive",
        })
        return
      }
    }

    setIsLoading(true)
    try {
      if (cliente) {
        await clientesService.updateCliente(cliente.id, formData)
        toast({
          title: "Sucesso",
          description: "Cliente atualizado com sucesso!",
        })
      } else {
        await clientesService.createCliente(formData)
        toast({
          title: "Sucesso",
          description: "Cliente criado com sucesso!",
        })
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error("[v0] Error saving cliente:", error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível salvar o cliente",
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
          <DialogTitle>{cliente ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          <DialogDescription>
            {cliente ? "Atualize as informações do cliente" : "Cadastre um novo cliente no sistema"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={(e) => handleTelefoneChange(e.target.value)}
                disabled={isLoading}
                maxLength={15}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
              <Input
                id="cpfCnpj"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                value={formData.cpfCnpj}
                onChange={(e) => handleCpfCnpjChange(e.target.value)}
                disabled={isLoading}
                maxLength={18}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              disabled={isLoading}
              rows={3}
            />
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
              ) : cliente ? (
                "Salvar Alterações"
              ) : (
                "Criar Cliente"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
