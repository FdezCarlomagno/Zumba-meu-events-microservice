export type EventStatus = "upcoming" | "live" | "finished" | "none" | "cancelled"

export interface ApiResponse<T> {
  error: boolean,
  message?: string
  data?: T
}

export interface Event {
  id: string
  title: string
  slug: string
  description?: string
  startDate: Date | string
  endDate: Date | string
  status: EventStatus
  location: string | null
  ctaText: string | null
  ctaUrl: string | null
  isFeatured: boolean
  createdAt: Date | string 
  updatedAt: Date | string
}


export interface Admin {
  id: string
  username: string
  passwordHash: string
  createdAt: Date
}

export interface AuthPayload {
  adminId: string
  username: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  admin: {
    id: string
    username: string
  }
}
