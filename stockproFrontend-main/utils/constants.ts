export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export const PAYMENT_TYPES = {
  DINHEIRO: "Dinheiro",
  CARTAO_CREDITO: "Cartão de Crédito",
  PIX: "PIX",
} as const

export const PRODUCT_STATUS = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
} as const

export const VENDA_STATUS = {
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
  PENDENTE: "Pendente",
} as const

export const LOW_STOCK_THRESHOLD = 5
