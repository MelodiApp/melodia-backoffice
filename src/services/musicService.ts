import { BaseApiService } from './apiClient'

// Catalog types based on requirements
export interface CatalogItem {
  id: string
  type: 'song' | 'collection'
  title: string
  artist: string
  collection?: string
  publishDate?: string
  effectiveStatus: 'programado' | 'publicado' | 'no-disponible-region' | 'bloqueado-admin'
  hasVideo?: boolean
  regions: string[]
  isExplicit?: boolean
  duration?: number
  year?: number
  collectionType?: 'album' | 'ep' | 'single' | 'playlist'
  owner?: string
  privacy?: 'public' | 'private'
  blockReason?: string
  createdAt: string
  updatedAt: string
}

export interface CatalogResponse {
  items: CatalogItem[]
  total: number
  page: number
  limit: number
}

export interface CatalogDetail extends CatalogItem {
  // Additional fields for detail view
  cover?: string
  songList?: Array<{
    position: number
    title: string
    artist: string
    duration: number
  }>
  appearances?: Array<{
    id: string
    type: 'album' | 'ep' | 'single' | 'playlist'
    title: string
    position?: number
    owner?: string
    includedCount?: number
    totalCount?: number
  }>
  auditoría?: AuditEntry[]
}

export interface AuditEntry {
  id: string
  userId: string
  username: string
  timestamp: string
  event: 'block' | 'unblock' | 'region_change' | 'availability_change' | 'metadata_change'
  scope: 'global' | string // region names
  region?: string
  previousStatus?: string
  newStatus?: string
  reasonCode?: string
  changes?: Record<string, any>
}

export interface AvailabilityPolicy {
  territories: {
    type: 'allow' | 'deny'
    regions: string[]
  }
  schedule?: {
    from?: string
    to?: string
  }
}

export interface BlockRequest {
  itemId: string
  scope: 'global' | string[]
  reasonCode: string
  comment?: string
}

export interface CatalogFilters {
  search?: string
  type?: 'song' | 'collection'
  status?: 'programado' | 'publicado' | 'no-disponible-region' | 'bloqueado-admin'
  hasVideo?: boolean
  publishDateFrom?: string
  publishDateTo?: string
  region?: string
  page?: number
  limit?: number
  sortBy?: 'title' | 'artist' | 'publishDate' | 'effectiveStatus'
  sortOrder?: 'asc' | 'desc'
}

// Metrics interfaces
export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

export interface SongMetrics {
  songId: string
  title: string
  artist: string
  album?: string
  plays: number
  likes: number
  shares: number
  saves: number
  playsTrend: number // percentage change
  likesTrend: number
  sharesTrend: number
  savesTrend: number
  playsHistory: TimeSeriesData[]
  likesHistory: TimeSeriesData[]
  sharesHistory: TimeSeriesData[]
  savesHistory: TimeSeriesData[]
  topMarkets: Array<{
    country: string
    countryName: string
    plays: number
    percentage: number
  }>
  demographics: {
    ageGroups: Array<{ range: string; percentage: number }>
    genderSplit: Array<{ gender: string; percentage: number }>
  }
  lastUpdated: string
}

export interface AlbumMetrics {
  albumId: string
  title: string
  artist: string
  totalPlays: number
  totalLikes: number
  totalShares: number
  totalSaves: number
  averageCompletionRate: number
  playsHistory: TimeSeriesData[]
  completionRateHistory: TimeSeriesData[]
  topTracks: Array<{
    songId: string
    title: string
    plays: number
    percentage: number
  }>
  playsTrend: number
  likesTrend: number
  sharesTrend: number
  savesTrend: number
  lastUpdated: string
}

export interface UserMetrics {
  totalUsers: number
  activeUsers: {
    daily: number
    weekly: number
    monthly: number
  }
  newRegistrations: {
    today: number
    thisWeek: number
    thisMonth: number
  }
  retention: {
    day1: number
    day7: number
    day30: number
  }
  demographics: {
    ageGroups: Array<{ range: string; count: number; percentage: number }>
    countries: Array<{ country: string; countryName: string; count: number; percentage: number }>
    genderSplit: Array<{ gender: string; count: number; percentage: number }>
  }
  activityTrend: Array<{
    date: string
    activeUsers: number
    newUsers: number
  }>
  lastUpdated: string
}

export interface ArtistMetrics {
  artistId: string
  artistName: string
  monthlyListeners: number
  followers: number
  totalPlays: number
  totalSaves: number
  totalShares: number
  monthlyListenersTrend: number
  followersTrend: number
  playsTrend: number
  savesTrend: number
  sharesTrend: number
  listenersHistory: TimeSeriesData[]
  followersHistory: TimeSeriesData[]
  playsHistory: TimeSeriesData[]
  topSongs: Array<{
    songId: string
    title: string
    plays: number
    saves: number
    percentage: number
  }>
  topMarkets: Array<{
    country: string
    countryName: string
    plays: number
    listeners: number
    percentage: number
  }>
  topPlaylists: Array<{
    playlistId: string
    playlistName: string
    playlistOwner: string
    inclusions: number
    totalPlays: number
  }>
  lastUpdated: string
}

export interface MetricsFilters {
  period?: 'daily' | 'weekly' | 'monthly' | 'custom'
  startDate?: string
  endDate?: string
  region?: string
  country?: string
}

// Music service class
export class MusicService extends BaseApiService {
  private mockCatalogItems: CatalogItem[] = [
    {
      id: '1',
      type: 'song',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      collection: 'A Night at the Opera',
      effectiveStatus: 'publicado',
      regions: ['global'],
      hasVideo: true,
      duration: 354,
      year: 1975,
      publishDate: '2023-01-15T10:00:00Z',
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2023-01-15T10:00:00Z'
    },
    {
      id: '2',
      type: 'collection',
      title: 'Rock Classics',
      artist: 'Various Artists',
      effectiveStatus: 'programado',
      regions: ['AR', 'BR'],
      collectionType: 'playlist',
      privacy: 'public',
      publishDate: '2023-02-01T10:00:00Z',
      createdAt: '2023-02-01T10:00:00Z',
      updatedAt: '2023-02-01T10:00:00Z'
    },
    {
      id: '3',
      type: 'song',
      title: 'We Will Rock You',
      artist: 'Queen',
      collection: 'News of the World',
      effectiveStatus: 'bloqueado-admin',
      regions: ['US', 'CA'],
      hasVideo: true,
      duration: 122,
      year: 1977,
      blockReason: 'copyright_violation',
      publishDate: '2023-01-20T10:00:00Z',
      createdAt: '2023-01-20T10:00:00Z',
      updatedAt: '2023-01-20T10:00:00Z'
    }
  ]

  private generateTimeSeriesData(baseValue: number, days: number = 30, trend: number = 0): TimeSeriesData[] {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000)
      const randomVariation = (Math.random() - 0.5) * 0.2 // ±10% random variation
      const trendEffect = (trend / 100) * (i / days) // Apply trend over time
      const value = Math.round(baseValue * (1 + trendEffect + randomVariation))
      
      return {
        date: date.toISOString().split('T')[0],
        value: Math.max(0, value)
      }
    })
  }

  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get catalog items with filters
  async getCatalog(filters?: CatalogFilters): Promise<CatalogResponse> {
    await this.delay()

    let filteredItems = [...this.mockCatalogItems]

    // Apply search filter
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filteredItems = filteredItems.filter(
        item => 
          item.title.toLowerCase().includes(search) ||
          item.artist.toLowerCase().includes(search) ||
          (item.collection && item.collection.toLowerCase().includes(search))
      )
    }

    // Apply type filter
    if (filters?.type) {
      filteredItems = filteredItems.filter(item => item.type === filters.type)
    }

    // Apply status filter
    if (filters?.status) {
      filteredItems = filteredItems.filter(item => item.effectiveStatus === filters.status)
    }

    // Apply hasVideo filter
    if (filters?.hasVideo !== undefined) {
      filteredItems = filteredItems.filter(item => item.hasVideo === filters.hasVideo)
    }

    // Apply region filter
    if (filters?.region) {
      filteredItems = filteredItems.filter(item => 
        item.regions.includes('global') || item.regions.includes(filters.region!)
      )
    }

    // Apply date range filters
    if (filters?.publishDateFrom) {
      filteredItems = filteredItems.filter(item => 
        item.publishDate && item.publishDate >= filters.publishDateFrom!
      )
    }

    if (filters?.publishDateTo) {
      filteredItems = filteredItems.filter(item => 
        item.publishDate && item.publishDate <= filters.publishDateTo!
      )
    }

    // Apply sorting
    if (filters?.sortBy) {
      filteredItems.sort((a, b) => {
        const field = filters.sortBy!
        const aValue = a[field as keyof CatalogItem] || ''
        const bValue = b[field as keyof CatalogItem] || ''
        
        if (filters.sortOrder === 'desc') {
          return String(bValue).localeCompare(String(aValue))
        }
        return String(aValue).localeCompare(String(bValue))
      })
    }

    // Apply pagination
    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedItems = filteredItems.slice(startIndex, endIndex)

    return {
      items: paginatedItems,
      total: filteredItems.length,
      page,
      limit,
    }
  }

  // Get detailed view of catalog item
  async getCatalogDetail(id: string): Promise<CatalogDetail> {
    await this.delay()

    const item = this.mockCatalogItems.find(i => i.id === id)
    if (!item) {
      throw new Error(`Catalog item with id ${id} not found`)
    }

    // Mock additional detail data
    const detail: CatalogDetail = {
      ...item,
      cover: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
      songList: item.type === 'collection' ? [
        { position: 1, title: 'Track 1', artist: item.artist, duration: 210 },
        { position: 2, title: 'Track 2', artist: item.artist, duration: 185 },
      ] : undefined,
      appearances: item.type === 'song' ? [
        { id: '2', type: 'album', title: 'Original Album', position: 3 },
        { id: '5', type: 'playlist', title: 'Top Hits', owner: 'Melodia' },
      ] : [
        { id: '10', type: 'playlist', title: 'Rock Classics', owner: 'User123', includedCount: 5, totalCount: 12 },
      ],
      auditoría: [
        {
          id: '1',
          userId: 'admin1',
          username: 'admin@melodia.com',
          timestamp: '2024-01-20T09:15:00Z',
          event: 'block',
          scope: 'global',
          reasonCode: 'copyright_violation',
          previousStatus: 'publicado',
          newStatus: 'bloqueado-admin',
        },
      ],
    }

    return detail
  }

  // Block/unblock catalog item
  async blockCatalogItem(request: BlockRequest): Promise<{ success: boolean; message: string }> {
    await this.delay()

    const itemIndex = this.mockCatalogItems.findIndex(i => i.id === request.itemId)
    if (itemIndex === -1) {
      throw new Error(`Catalog item with id ${request.itemId} not found`)
    }

    const item = this.mockCatalogItems[itemIndex]
    const newStatus = item.effectiveStatus === 'bloqueado-admin' ? 'publicado' : 'bloqueado-admin'
    
    this.mockCatalogItems[itemIndex] = {
      ...item,
      effectiveStatus: newStatus,
      blockReason: newStatus === 'bloqueado-admin' ? request.reasonCode : undefined,
      updatedAt: new Date().toISOString(),
    }

    return {
      success: true,
      message: `Item ${newStatus === 'bloqueado-admin' ? 'blocked' : 'unblocked'} successfully`,
    }
  }

  // Update availability policy
  async updateAvailabilityPolicy(
    itemId: string, 
    policy: AvailabilityPolicy
  ): Promise<{ success: boolean; message: string }> {
    await this.delay()

    const itemIndex = this.mockCatalogItems.findIndex(i => i.id === itemId)
    if (itemIndex === -1) {
      throw new Error(`Catalog item with id ${itemId} not found`)
    }

    const item = this.mockCatalogItems[itemIndex]
    let newRegions: string[] = []
    let newStatus = item.effectiveStatus

    if (policy.territories.type === 'allow') {
      newRegions = policy.territories.regions
      newStatus = 'publicado'
    } else {
      newRegions = ['global'] // Deny specific regions, allow global
      newStatus = 'no-disponible-region'
    }

    // Handle scheduling
    if (policy.schedule?.from) {
      const scheduleDate = new Date(policy.schedule.from)
      const now = new Date()
      if (scheduleDate > now) {
        newStatus = 'programado'
      }
    }

    this.mockCatalogItems[itemIndex] = {
      ...item,
      regions: newRegions,
      effectiveStatus: newStatus,
      updatedAt: new Date().toISOString(),
    }

    return {
      success: true,
      message: 'Availability policy updated successfully',
    }
  }

  // Get available regions
  async getRegions(): Promise<string[]> {
    await this.delay(200)
    return ['global', 'US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'BR', 'AR', 'MX', 'JP', 'KR']
  }

  // Get reason codes for blocking
  async getReasonCodes(): Promise<Array<{ code: string; label: string }>> {
    await this.delay(200)
    return [
      { code: 'copyright_violation', label: 'Copyright Violation' },
      { code: 'explicit_content', label: 'Explicit Content' },
      { code: 'quality_issues', label: 'Quality Issues' },
      { code: 'legal_request', label: 'Legal Request' },
      { code: 'policy_violation', label: 'Policy Violation' },
      { code: 'other', label: 'Other' },
    ]
  }

  // Get song metrics
  async getSongMetrics(songId: string, filters?: MetricsFilters): Promise<SongMetrics> {
    await this.delay(300)
    
    const baseDaily = {
      plays: 42000,
      likes: 2800,
      shares: 400,
      saves: 1500
    }
    
    return {
      songId,
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      plays: 1250000,
      likes: 85000,
      shares: 12000,
      saves: 45000,
      playsTrend: 12.5,
      likesTrend: 8.3,
      sharesTrend: 15.2,
      savesTrend: 10.1,
      playsHistory: this.generateTimeSeriesData(baseDaily.plays, 30, 12.5),
      likesHistory: this.generateTimeSeriesData(baseDaily.likes, 30, 8.3),
      sharesHistory: this.generateTimeSeriesData(baseDaily.shares, 30, 15.2),
      savesHistory: this.generateTimeSeriesData(baseDaily.saves, 30, 10.1),
      topMarkets: [
        { country: 'AR', countryName: 'Argentina', plays: 450000, percentage: 36 },
        { country: 'BR', countryName: 'Brasil', plays: 300000, percentage: 24 },
        { country: 'MX', countryName: 'México', plays: 250000, percentage: 20 }
      ],
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 35 },
          { range: '25-34', percentage: 40 },
          { range: '35-44', percentage: 20 },
          { range: '45+', percentage: 5 }
        ],
        genderSplit: [
          { gender: 'Masculino', percentage: 52 },
          { gender: 'Femenino', percentage: 45 },
          { gender: 'Otro', percentage: 3 }
        ]
      },
      lastUpdated: new Date().toISOString()
    }
  }

  // Get album metrics
  async getAlbumMetrics(albumId: string, filters?: MetricsFilters): Promise<AlbumMetrics> {
    await this.delay(300)
    
    const baseDailyPlays = 190000
    const baseCompletionRate = 78.5
    
    return {
      albumId,
      title: 'A Night at the Opera',
      artist: 'Queen',
      totalPlays: 5680000,
      totalLikes: 320000,
      totalShares: 45000,
      totalSaves: 180000,
      averageCompletionRate: baseCompletionRate,
      playsHistory: this.generateTimeSeriesData(baseDailyPlays, 30, 15.2),
      completionRateHistory: this.generateTimeSeriesData(baseCompletionRate, 30, 2.5),
      topTracks: [
        { songId: '1', title: 'Bohemian Rhapsody', plays: 1250000, percentage: 22 },
        { songId: '2', title: 'Love of My Life', plays: 890000, percentage: 15.7 },
        { songId: '3', title: "You're My Best Friend", plays: 720000, percentage: 12.7 }
      ],
      playsTrend: 15.2,
      likesTrend: 12.8,
      sharesTrend: 18.5,
      savesTrend: 14.3,
      lastUpdated: new Date().toISOString()
    }
  }

  // Get user metrics
  async getUserMetrics(filters?: MetricsFilters): Promise<UserMetrics> {
    await this.delay(400)
    return {
      totalUsers: 2450000,
      activeUsers: {
        daily: 180000,
        weekly: 520000,
        monthly: 1200000
      },
      newRegistrations: {
        today: 1250,
        thisWeek: 8500,
        thisMonth: 35000
      },
      retention: {
        day1: 85.2,
        day7: 62.5,
        day30: 45.8
      },
      demographics: {
        ageGroups: [
          { range: '16-20', count: 490000, percentage: 20 },
          { range: '21-25', count: 735000, percentage: 30 },
          { range: '26-35', count: 857500, percentage: 35 },
          { range: '36+', count: 367500, percentage: 15 }
        ],
        countries: [
          { country: 'AR', countryName: 'Argentina', count: 980000, percentage: 40 },
          { country: 'BR', countryName: 'Brasil', count: 490000, percentage: 20 },
          { country: 'MX', countryName: 'México', count: 367500, percentage: 15 },
          { country: 'CO', countryName: 'Colombia', count: 245000, percentage: 10 },
          { country: 'OTHER', countryName: 'Otros', count: 367500, percentage: 15 }
        ],
        genderSplit: [
          { gender: 'Femenino', count: 1225000, percentage: 50 },
          { gender: 'Masculino', count: 1102500, percentage: 45 },
          { gender: 'Otro/No especifica', count: 122500, percentage: 5 }
        ]
      },
      activityTrend: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        activeUsers: 180000 + Math.random() * 20000 - 10000,
        newUsers: 1250 + Math.random() * 500 - 250
      })),
      lastUpdated: new Date().toISOString()
    }
  }

  // Get artist metrics
  async getArtistMetrics(artistId: string, filters?: MetricsFilters): Promise<ArtistMetrics> {
    await this.delay(400)
    
    const baseDailyValues = {
      listeners: 150000,
      followers: 9300,
      plays: 4170000
    }
    
    return {
      artistId,
      artistName: 'Queen',
      monthlyListeners: 4500000,
      followers: 2800000,
      totalPlays: 125000000,
      totalSaves: 1800000,
      totalShares: 450000,
      monthlyListenersTrend: 8.5,
      followersTrend: 12.3,
      playsTrend: 15.2,
      savesTrend: 18.7,
      sharesTrend: 22.1,
      listenersHistory: this.generateTimeSeriesData(baseDailyValues.listeners, 30, 8.5),
      followersHistory: this.generateTimeSeriesData(baseDailyValues.followers, 30, 12.3),
      playsHistory: this.generateTimeSeriesData(baseDailyValues.plays, 30, 15.2),
      topSongs: [
        { songId: '1', title: 'Bohemian Rhapsody', plays: 25000000, saves: 850000, percentage: 20 },
        { songId: '2', title: 'We Will Rock You', plays: 18000000, saves: 620000, percentage: 14.4 },
        { songId: '3', title: 'We Are the Champions', plays: 15000000, saves: 480000, percentage: 12 },
        { songId: '4', title: 'Another One Bites the Dust', plays: 12000000, saves: 380000, percentage: 9.6 },
        { songId: '5', title: 'Somebody to Love', plays: 10000000, saves: 320000, percentage: 8 }
      ],
      topMarkets: [
        { country: 'US', countryName: 'Estados Unidos', plays: 35000000, listeners: 1350000, percentage: 28 },
        { country: 'GB', countryName: 'Reino Unido', plays: 20000000, listeners: 900000, percentage: 16 },
        { country: 'BR', countryName: 'Brasil', plays: 15000000, listeners: 675000, percentage: 12 },
        { country: 'AR', countryName: 'Argentina', plays: 12000000, listeners: 540000, percentage: 9.6 },
        { country: 'MX', countryName: 'México', plays: 10000000, listeners: 450000, percentage: 8 }
      ],
      topPlaylists: [
        { playlistId: 'p1', playlistName: 'Rock Legends', playlistOwner: 'Spotify', inclusions: 15, totalPlays: 2500000 },
        { playlistId: 'p2', playlistName: 'Classic Rock Hits', playlistOwner: 'Apple Music', inclusions: 12, totalPlays: 1800000 },
        { playlistId: 'p3', playlistName: '70s Greatest Hits', playlistOwner: 'YouTube Music', inclusions: 8, totalPlays: 1200000 }
      ],
      lastUpdated: new Date().toISOString()
    }
  }
}

// Export singleton instance
export const musicService = new MusicService()
