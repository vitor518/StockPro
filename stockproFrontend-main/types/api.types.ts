export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  first?: boolean
  last?: boolean
  numberOfElements?: number
}

export interface ErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}
