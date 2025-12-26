export interface Event {
  id: string
  title: string
  slug: string
  description: string
  startDate: Date
  endDate: Date
  status: "draft" | "upcoming" | "past" | "cancelled"
  location: string | null
  ctaText: string | null
  ctaUrl: string | null
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
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
