const BASE = 'https://smartcoffeebuilder-be-295284732683.asia-southeast1.run.app/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

/** Logs full error details to the console and returns a short UI-friendly Error. */
function apiError(method: string, url: string, status: number | string, body?: unknown): Error {
  console.error(`[API] ${method} ${url} failed (${status})`, body ?? '')
  return new Error(`Error ${status} — check the browser console for details`)
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const method = options?.method ?? 'GET'
  const url = `${BASE}${path}`
  let res: Response
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    })
  } catch (e) {
    throw apiError(method, url, 'network', e)
  }
  if (!res.ok) {
    const errBody = await res.text()
    let parsed: unknown = errBody
    try { parsed = JSON.parse(errBody) } catch { /* keep raw text */ }
    throw apiError(method, url, res.status, parsed)
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

export interface ProjectWorkingResponse {
  id: number
  projectShopOwnerId: number
  projectName: string | null
  serviceProviderProfileId: number
  providerDisplayName: string | null
  applyId: number | null
  contractType: string
  status: 'requested' | 'accepted' | 'rejected' | 'completed' | 'terminated'
  requestMessage: string | null
  startedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ApplyResponse {
  id: number
  postId: number
  postTitle: string | null
  projectShopOwnerId: number | null
  serviceProviderProfileId: number
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

// ── Project Workings (engagements) ───────────────────────────────────────────

export const projectWorkings = {
  list: (params: { serviceProviderProfileId?: number; projectShopOwnerId?: number; status?: string } = {}) => {
    const q = new URLSearchParams()
    if (params.serviceProviderProfileId) q.set('serviceProviderProfileId', String(params.serviceProviderProfileId))
    if (params.projectShopOwnerId) q.set('projectShopOwnerId', String(params.projectShopOwnerId))
    if (params.status) q.set('status', params.status)
    q.set('pageSize', '50')
    return request<Paginated<ProjectWorkingResponse>>(`/project-workings?${q}`)
  },

  get: (id: number) =>
    request<ProjectWorkingResponse>(`/project-workings/${id}`),

  /** Provider views the owner's brief for this engagement (open from 'requested'). */
  getBrief: (id: number) =>
    request<DesignBriefResponse>(`/project-workings/${id}/brief`),

  accept: (id: number) =>
    request<ProjectWorkingResponse>(`/project-workings/${id}/accept`, { method: 'POST' }),

  reject: (id: number) =>
    request<ProjectWorkingResponse>(`/project-workings/${id}/reject`, { method: 'POST' }),
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
    request<ProjectResponse>(`/project-shop-owners/${id}`),

  list: (params: { ownerId?: number; pageSize?: number } = {}) => {
    const q = new URLSearchParams()
    if (params.ownerId) q.set('ownerId', String(params.ownerId))
    q.set('pageSize', String(params.pageSize ?? 50))
    return request<Paginated<ProjectResponse>>(`/project-shop-owners?${q}`)
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
    if (params.projectId) q.set('projectShopOwnerId', String(params.projectId))
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
    request<ServiceProviderResponse>('/service-provider-profiles', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  get: (id: number) =>
    request<ServiceProviderResponse>(`/service-provider-profiles/${id}`),
}

// ── Project Posts (public listings providers can apply to) ───────────────────

export interface ProjectPostResponse {
  id: number
  projectShopOwnerId: number
  projectName: string | null
  projectAddress: string | null
  projectBudget: number | null
  projectAreaM2: number | null
  serviceKind: 'design' | 'construction' | 'both'
  title: string
  description: string
  status: string
  submissionDeadline: string | null
  isBoosted: boolean
  boostedUntil: string | null
  createdAt: string
  updatedAt: string
}

export const projectPosts = {
  list: (params: { status?: string; pageSize?: number } = {}) => {
    const q = new URLSearchParams()
    if (params.status) q.set('status', params.status)
    q.set('pageSize', String(params.pageSize ?? 50))
    return request<Paginated<ProjectPostResponse>>(`/posts?${q}`)
  },

  get: (id: number) =>
    request<ProjectPostResponse>(`/posts/${id}`),
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
  projectWorkingId: number
  title: string
  type: DesignType
  status: DesignStatus
  version: string
  images: DesignImage[]
  createdAt: string
  updatedAt: string
}

export const designs = {
  list: (params: { projectWorkingId?: number; status?: string } = {}) => {
    const q = new URLSearchParams()
    if (params.projectWorkingId) q.set('projectWorkingId', String(params.projectWorkingId))
    if (params.status) q.set('status', params.status)
    q.set('pageSize', '100')
    return request<Paginated<DesignResponse>>(`/designs?${q}`)
  },

  create: (body: { projectWorkingId: number; title: string; type: DesignType }) =>
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
    if (!res.ok) throw apiError('POST', url, res.status, await res.text())
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
    if (!res.ok) throw apiError('POST', url, res.status, await res.text())
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
  projectWorkingId: number
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
  list: (params: { projectWorkingId?: number; providerId?: number; pageSize?: number } = {}) => {
    const q = new URLSearchParams()
    if (params.projectWorkingId) q.set('projectWorkingId', String(params.projectWorkingId))
    if (params.providerId) q.set('providerId', String(params.providerId))
    q.set('pageSize', String(params.pageSize ?? 20))
    return request<Paginated<ReviewResponse>>(`/reviews?${q}`)
  },

  getProviderSummary: (providerId: number) =>
    request<ProviderRatingSummaryResponse>(`/reviews/providers/${providerId}/summary`),
}

// ── Engagement Overview ────────────────────────────────────────────────────────

export interface EngagementOverviewResponse {
  projectWorkingId: number
  contractType: string
  status: string
  projectShopOwner: {
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
  get: (projectWorkingId: number) =>
    request<EngagementOverviewResponse>(`/project-workings/${projectWorkingId}/overview`),
}

// ── Contracts (OTP-gated signing: drafted → pending_otp → confirmed) ──────────

export type ContractStatus = 'drafted' | 'pending_otp' | 'confirmed' | 'cancelled'

export interface ContractResponse {
  id: number
  projectWorkingId: number
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
  list: (params: { projectWorkingId?: number; pageSize?: number } = {}) => {
    const q = new URLSearchParams()
    if (params.projectWorkingId) q.set('projectWorkingId', String(params.projectWorkingId))
    q.set('pageSize', String(params.pageSize ?? 20))
    return request<Paginated<ContractResponse>>(`/contracts?${q}`)
  },

  get: (id: number) =>
    request<ContractResponse>(`/contracts/${id}`),

  /** Provider drafts a contract for an accepted engagement. */
  create: (body: { projectWorkingId: number; title: string; partyInfo?: string; terms?: string; agreedValue?: number; documentUrl?: string }) =>
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

// ── Applies (applications to posts) ───────────────────────────────────────────

export const applies = {
  list: (params: { serviceProviderProfileId?: number; postId?: number; status?: string } = {}) => {
    const q = new URLSearchParams()
    if (params.serviceProviderProfileId) q.set('serviceProviderProfileId', String(params.serviceProviderProfileId))
    if (params.postId) q.set('postId', String(params.postId))
    if (params.status) q.set('status', params.status)
    q.set('pageSize', '50')
    return request<Paginated<ApplyResponse>>(`/applies?${q}`)
  },

  /** Provider profile is taken from the JWT — no id needed. Capability must match the post's serviceKind. */
  create: (body: { postId: number; proposal: string; estimatedDurationDays?: number }) =>
    request<ApplyResponse>('/applies/apply', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateProposal: (id: number, body: { proposal?: string; estimatedDurationDays?: number }) =>
    request<ApplyResponse>(`/applies/${id}/proposal`, { method: 'PUT', body: JSON.stringify(body) }),

  withdraw: (id: number) =>
    request<void>(`/applies/${id}/withdraw`, { method: 'DELETE' }),
}
