"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Venda } from "@/types/venda.types"
import { formatCurrency, formatDateTime } from "@/utils/formatters"
import { PAYMENT_TYPES, VENDA_STATUS } from "@/utils/constants"

interface VendaDetalhesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venda: Venda | null
}

export function VendaDetalhesDialog({ open, onOpenChange, venda }: VendaDetalhesDialogProps) {
  if (!venda) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Venda #{venda.id}</DialogTitle>
          <DialogDescription>Informações completas da venda</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da venda */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600">Data/Hora</p>
              <p className="font-medium">{formatDateTime(venda.dataVenda)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cliente</p>
              <p className="font-medium">{venda.cliente?.nome || "Venda Direta"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Forma de Pagamento</p>
              <p className="font-medium">{PAYMENT_TYPES[venda.tipoPagamento]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge
                variant={
                  venda.status === "CONCLUIDA" ? "default" : venda.status === "CANCELADA" ? "destructive" : "secondary"
                }
              >
                {VENDA_STATUS[venda.status]}
              </Badge>
            </div>
          </div>

          {/* Itens da venda */}
          <div>
            <h3 className="mb-2 font-semibold">Itens da Venda</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Preço Unit.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venda.itens.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.produto?.nome || `Produto #${item.produtoId}`}</TableCell>
                    <TableCell className="text-right">{item.quantidade}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.precoUnitario)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Total */}
          <div className="flex justify-end border-t pt-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total da Venda</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(venda.total)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
