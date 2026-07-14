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

// ── Auth ─────────────────────────────────────────────────────────────────────

interface AuthResponse {
  accessToken: string
  accountId: number
}

export const auth = {
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  register: (body: { fullName: string; email: string; phoneNumber?: string; password: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
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

// ── Projects ─────────────────────────────────────────────────────────────────

export interface ProjectResponse {
  id: number
  ownerId: number
  name: string
  address: string
  areaM2: number
  budget: number
  status: string
  createdAt: string
  updatedAt: string
}

export const projects = {
  get: (id: number) =>
    request<{ data: ProjectResponse }>(`/projects/${id}`).then((r) => r.data),

  list: (params: { ownerId?: number; pageSize?: number } = {}) => {
    const q = new URLSearchParams()
    if (params.ownerId) q.set('ownerId', String(params.ownerId))
    q.set('pageSize', String(params.pageSize ?? 50))
    return request<{ data: Paginated<ProjectResponse> }>(`/projects?${q}`).then((r) => r.data)
  },
}

// ── Design Briefs ─────────────────────────────────────────────────────────────

export interface DesignBriefResponse {
  id: number
  projectId: number
  targetCustomer: string
  style: string
  mood: string
  seatCount: number | null
  timeline: string | null
  brandNote: string | null
  businessModel: string | null
  businessGoals: string | null
  operationNote: string | null
  createdAt: string
}

export const designBriefs = {
  list: (params: { projectId?: number; pageSize?: number } = {}) => {
    const q = new URLSearchParams()
    if (params.projectId) q.set('projectId', String(params.projectId))
    q.set('pageSize', String(params.pageSize ?? 10))
    return request<{ data: Paginated<DesignBriefResponse> }>(`/design-briefs?${q}`).then((r) => r.data)
  },

  get: (id: number) =>
    request<{ data: DesignBriefResponse }>(`/design-briefs/${id}`).then((r) => r.data),
}

// ── Service Providers ─────────────────────────────────────────────────────────

export interface ServiceProviderResponse {
  id: number
  accountId: number
  displayName: string
  providerType: string
  capability: string
  bio: string | null
  companyTaxCode: string | null
  yearsExperience: number | null
  portfolioHeadline: string | null
  isVerified: boolean
  avgRating: number
  createdAt: string
}

export const serviceProviders = {
  create: (body: {
    accountId: number
    displayName: string
    providerType: string
    capability: string
    bio?: string
    companyTaxCode?: string
    yearsExperience?: number
    portfolioHeadline?: string
  }) =>
    request<{ data: ServiceProviderResponse }>('/service-providers', {
      method: 'POST',
      body: JSON.stringify(body),
    }).then((r) => r.data),

  get: (id: number) =>
    request<{ data: ServiceProviderResponse }>(`/service-providers/${id}`).then((r) => r.data),
}

// ── Project Posts (public listings providers can apply to) ───────────────────

export interface ProjectPostResponse {
  id: number
  title: string
  description: string | null
  location: string | null
  area: number | null
  budget: string | null
  style: string | null
  deadline: string | null
  proposalCount: number | null
  status: string
  createdAt: string
  updatedAt: string
}

export const projectPosts = {
  list: (params: { status?: string; pageSize?: number } = {}) => {
    const q = new URLSearchParams()
    if (params.status) q.set('status', params.status)
    q.set('pageSize', String(params.pageSize ?? 50))
    return request<Paginated<ProjectPostResponse>>(`/project-posts?${q}`)
  },

  get: (id: number) =>
    request<ProjectPostResponse>(`/project-posts/${id}`),
}

// ── Designs ──────────────────────────────────────────────────────────────────

export type DesignType = 'concept' | 'layout_2d' | 'render_3d' | 'technical_drawing'
export type DesignStatus = 'in_progress' | 'submitted' | 'revision' | 'approved'

export interface DesignImage {
  id: number
  imageUrl: string
  createdAt: string
}

export interface DesignResponse {
  id: number
  projectProviderId: number
  title: string
  type: DesignType
  status: DesignStatus
  version: string
  images: DesignImage[]
  createdAt: string
  updatedAt: string
}

export const designs = {
  list: (params: { projectProviderId?: number; status?: string } = {}) => {
    const q = new URLSearchParams()
    if (params.projectProviderId) q.set('projectProviderId', String(params.projectProviderId))
    if (params.status) q.set('status', params.status)
    q.set('pageSize', '100')
    return request<Paginated<DesignResponse>>(`/designs?${q}`)
  },

  create: (body: { projectProviderId: number; title: string; type: DesignType }) =>
    request<DesignResponse>('/designs', { method: 'POST', body: JSON.stringify(body) }),

  submit: (id: number) =>
    request<DesignResponse>(`/designs/${id}/submit`, { method: 'POST' }),

  startRevision: (id: number) =>
    request<DesignResponse>(`/designs/${id}/start-revision`, { method: 'POST' }),

  addImage: (id: number, imageUrl: string) =>
    request<DesignImage>(`/designs/${id}/images`, { method: 'POST', body: JSON.stringify({ imageUrl }) }),

  removeImage: (id: number, imageId: number) =>
    request<void>(`/designs/${id}/images/${imageId}`, { method: 'DELETE' }),
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
