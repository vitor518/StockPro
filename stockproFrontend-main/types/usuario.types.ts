export interface Usuario {
  id: number
  nome: string
  email: string
  role: "ADMIN" | "GERENTE" | "VENDEDOR"
  ativo?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: Usuario
}

export interface RegisterRequest {
  nome: string
  email: string
  password: string
  role?: "ADMIN" | "GERENTE" | "VENDEDOR"
}

export interface ChangePasswordRequest {
  senhaAtual: string
  novaSenha: string
}

export interface UsuarioUpdateRequest {
  nome: string
  email: string
}
