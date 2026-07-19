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
  refreshToken: string
  accountId: number
  email: string
  role: string
}

export const auth = {
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  /** role: 'owner' | 'provider' | 'admin' — this FE always registers providers. */
  register: (body: { email: string; password: string; phone?: string; role: string }) =>
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
  totalItems: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
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
    request<ProjectResponse>(`/projects/${id}`),

  list: (params: { ownerId?: number; pageSize?: number } = {}) => {
    const q = new URLSearchParams()
    if (params.ownerId) q.set('ownerId', String(params.ownerId))
    q.set('pageSize', String(params.pageSize ?? 50))
    return request<Paginated<ProjectResponse>>(`/projects?${q}`)
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
    return request<Paginated<DesignBriefResponse>>(`/design-briefs?${q}`)
  },

  get: (id: number) =>
    request<DesignBriefResponse>(`/design-briefs/${id}`),
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
    request<ServiceProviderResponse>('/service-providers', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  get: (id: number) =>
    request<ServiceProviderResponse>(`/service-providers/${id}`),
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

// Extended response from /api/designs/{id}/files — includes GCS viewUrl
export interface DesignImageResponse extends DesignImage {
  designId: number
  viewUrl?: string
  caption?: string | null
  uploadedBy?: number | null
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

// ── File Upload (GCS) ────────────────────────────────────────────────────────

export interface FileUploadResponse {
  objectName: string
  /** Public GCS URL — stable, use directly as img src / download link. */
  url: string
  contentType: string
  sizeBytes: number
}

export const files = {
  /** Upload any file. Returns objectName + public url for display. */
  upload: async (file: File, folder?: string): Promise<FileUploadResponse> => {
    const token = getToken()
    const form = new FormData()
    form.append('file', file)
    const url = `${BASE}/files${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`
    const res = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`)
    return res.json()
  },

  /** Upload image only (jpg/png/webp/gif). */
  uploadImage: async (file: File, folder?: string): Promise<FileUploadResponse> => {
    const token = getToken()
    const form = new FormData()
    form.append('file', file)
    const url = `${BASE}/files/images${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`
    const res = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`)
    return res.json()
  },

  /** Proxy view URL — use as <img src> or download link. No auth needed. */
  viewUrl: (objectName: string) => `${BASE}/files/view?objectName=${encodeURIComponent(objectName)}`,

  delete: (objectName: string) =>
    request<void>(`/files?objectName=${encodeURIComponent(objectName)}`, { method: 'DELETE' }),
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface ReviewScoreResponse {
  id: number
  dimension: string
  score: number
}

export interface ReviewResponse {
  id: number
  projectProviderId: number
  projectId: number | null
  providerId: number | null
  overallRating: number
  comment: string | null
  scores: ReviewScoreResponse[]
  createdAt: string
  updatedAt: string
}

export interface ProviderRatingSummaryResponse {
  providerId: number
  reviewCount: number
  averageRating: number | null
  dimensionAverages: Record<string, number>
}

export const reviews = {
  list: (params: { projectProviderId?: number; providerId?: number; pageSize?: number } = {}) => {
    const q = new URLSearchParams()
    if (params.projectProviderId) q.set('projectProviderId', String(params.projectProviderId))
    if (params.providerId) q.set('providerId', String(params.providerId))
    q.set('pageSize', String(params.pageSize ?? 20))
    return request<Paginated<ReviewResponse>>(`/reviews?${q}`)
  },

  getProviderSummary: (providerId: number) =>
    request<ProviderRatingSummaryResponse>(`/reviews/providers/${providerId}/summary`),
}

// ── Engagement Overview ────────────────────────────────────────────────────────

export interface EngagementOverviewResponse {
  projectProviderId: number
  contractType: string
  status: string
  project: {
    id: number
    name: string
    address: string
    areaM2: number
    budget: number
    status: string
  }
  brief: DesignBriefResponse | null
  aiRecommendations: unknown[] | null
  approvedDesigns: DesignResponse[] | null
}

export const engagementOverview = {
  get: (projectProviderId: number) =>
    request<EngagementOverviewResponse>(`/project-providers/${projectProviderId}/overview`),
}

// ── Contracts (OTP-gated signing: drafted → pending_otp → confirmed) ──────────

export type ContractStatus = 'drafted' | 'pending_otp' | 'confirmed' | 'cancelled'

export interface ContractResponse {
  id: number
  projectProviderId: number
  title: string
  partyInfo: string | null
  terms: string | null
  agreedValue: number | null
  documentUrl: string | null
  otpExpiresAt: string | null
  confirmedAt: string | null
  confirmedBy: number | null
  status: ContractStatus
  createdAt: string
  updatedAt: string
}

export const contracts = {
  list: (params: { projectProviderId?: number; pageSize?: number } = {}) => {
    const q = new URLSearchParams()
    if (params.projectProviderId) q.set('projectProviderId', String(params.projectProviderId))
    q.set('pageSize', String(params.pageSize ?? 20))
    return request<Paginated<ContractResponse>>(`/contracts?${q}`)
  },

  get: (id: number) =>
    request<ContractResponse>(`/contracts/${id}`),

  /** Provider drafts a contract for an accepted engagement. */
  create: (body: { projectProviderId: number; title: string; partyInfo?: string; terms?: string; agreedValue?: number; documentUrl?: string }) =>
    request<ContractResponse>('/contracts', { method: 'POST', body: JSON.stringify(body) }),

  /** Only while status is 'drafted'. Null/omitted fields keep their value. */
  update: (id: number, body: { title?: string; partyInfo?: string; terms?: string; agreedValue?: number; documentUrl?: string }) =>
    request<ContractResponse>(`/contracts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  /** Emails a signing OTP to the owner (drafted → pending_otp). */
  sendOtp: (id: number) =>
    request<ContractResponse>(`/contracts/${id}/send-otp`, { method: 'POST' }),

  /** Owner confirms the OTP (pending_otp → confirmed). Confirmed unlocks designs/construction. */
  confirmOtp: (id: number, otpCode: string, confirmedBy: number) =>
    request<ContractResponse>(`/contracts/${id}/confirm-otp`, { method: 'POST', body: JSON.stringify({ otpCode, confirmedBy }) }),

  /** Only before confirmation (drafted/pending_otp → cancelled). */
  cancel: (id: number) =>
    request<ContractResponse>(`/contracts/${id}/cancel`, { method: 'POST' }),
}

// ── Notifications (in-app + email) ────────────────────────────────────────────

export interface NotificationResponse {
  id: number
  accountId: number
  type: string
  title: string
  content: string
  referenceType: string | null
  referenceId: number | null
  isRead: boolean
  emailSentAt: string | null
  createdAt: string
}

export const notifications = {
  list: (params: { accountId: number; isRead?: boolean; pageSize?: number }) => {
    const q = new URLSearchParams()
    q.set('accountId', String(params.accountId))
    if (params.isRead !== undefined) q.set('isRead', String(params.isRead))
    q.set('pageSize', String(params.pageSize ?? 20))
    return request<Paginated<NotificationResponse>>(`/notifications?${q}`)
  },

  unreadCount: (accountId: number) =>
    request<{ accountId: number; unreadCount: number }>(`/notifications/unread-count?accountId=${accountId}`),

  markRead: (id: number) =>
    request<NotificationResponse>(`/notifications/${id}/read`, { method: 'PATCH' }),

  markAllRead: (accountId: number) =>
    request<{ accountId: number; updated: number }>(`/notifications/mark-all-read?accountId=${accountId}`, { method: 'POST' }),
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
    request<ProjectApplicationResponse>('/project-applications/apply', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  withdraw: (id: number) =>
    request<void>(`/project-applications/${id}/withdraw`, { method: 'DELETE' }),
}
