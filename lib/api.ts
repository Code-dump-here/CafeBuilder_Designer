const BASE = 'https://smartcoffeebuilder-be-295284732683.asia-southeast1.run.app/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface ProjectProviderResponse {
  id: number
  projectId: number
  projectName: string | null
  providerId: number
  providerDisplayName: string | null
  applicationId: number | null
  contractType: string
  status: 'requested' | 'accepted' | 'rejected' | 'completed' | 'terminated'
  requestMessage: string | null
  startedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectApplicationResponse {
  id: number
  postId: number
  postTitle: string | null
  projectId: number | null
  providerId: number
  providerDisplayName: string | null
  proposal: string
  estimatedDurationDays: number | null
  status: 'pending' | 'accepted' | 'rejected'
  submittedAt: string | null
  createdAt: string
  updatedAt: string
}

interface Paginated<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
}

// ── Project Providers (engagements) ──────────────────────────────────────────

export const projectProviders = {
  list: (params: { providerId?: number; projectId?: number; status?: string } = {}) => {
    const q = new URLSearchParams()
    if (params.providerId) q.set('providerId', String(params.providerId))
    if (params.projectId) q.set('projectId', String(params.projectId))
    if (params.status) q.set('status', params.status)
    q.set('pageSize', '50')
    return request<Paginated<ProjectProviderResponse>>(`/project-providers?${q}`)
  },

  accept: (id: number) =>
    request<ProjectProviderResponse>(`/project-providers/${id}/accept`, { method: 'POST' }),

  reject: (id: number) =>
    request<ProjectProviderResponse>(`/project-providers/${id}/reject`, { method: 'POST' }),
}

// ── Project Applications ──────────────────────────────────────────────────────

export const projectApplications = {
  list: (params: { providerId?: number; postId?: number; status?: string } = {}) => {
    const q = new URLSearchParams()
    if (params.providerId) q.set('providerId', String(params.providerId))
    if (params.postId) q.set('postId', String(params.postId))
    if (params.status) q.set('status', params.status)
    q.set('pageSize', '50')
    return request<Paginated<ProjectApplicationResponse>>(`/project-applications?${q}`)
  },

  create: (body: { postId: number; providerId: number; proposal: string; estimatedDurationDays?: number }) =>
    request<ProjectApplicationResponse>('/project-applications', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  withdraw: (id: number) =>
    request<void>(`/project-applications/${id}`, { method: 'DELETE' }),
}
