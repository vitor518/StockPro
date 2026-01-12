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
import { produtosService } from "@/services/produtos.service"
import type { Produto } from "@/types/produto.types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface DeleteProdutoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  produto: Produto | null
  onSuccess: () => void
}

export function DeleteProdutoDialog({ open, onOpenChange, produto, onSuccess }: DeleteProdutoDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!produto) return

    setIsLoading(true)
    try {
      await produtosService.deleteProduto(produto.id)
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error("[v0] Error deleting produto:", error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível excluir o produto",
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
            Tem certeza que deseja excluir o produto <strong>{produto?.nome}</strong>? Esta ação não pode ser desfeita.
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
