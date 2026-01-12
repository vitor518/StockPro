"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { clientesService } from "@/services/clientes.service"
import type { Cliente } from "@/types/venda.types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface DeleteClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente: Cliente | null
  onSuccess: () => void
}

export function DeleteClienteDialog({ open, onOpenChange, cliente, onSuccess }: DeleteClienteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!cliente) return

    setIsLoading(true)
    try {
      await clientesService.deleteCliente(cliente.id)
      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso!",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error("[v0] Error deleting cliente:", error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível excluir o cliente",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o cliente <strong>{cliente?.nome}</strong>? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
