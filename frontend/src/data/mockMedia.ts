export interface MockMediaItem {
  id: number
  title: string
  description?: string
  url: string
  thumbnail_url?: string
  tags: string[]
  featured: boolean
  uploaded_at: string
}

const now = new Date()

const daysAgo = (days: number) => {
  const date = new Date(now)
  date.setDate(now.getDate() - days)
  return date.toISOString()
}

export const mockMedia: MockMediaItem[] = [
  {
    id: 1,
    title: 'Neon Night Market Crowd',
    description: 'Packed dance floor from the 2025 kickoff night market.',
    url: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81c?auto=format&fit=crop&w=1200&q=80',
    tags: ['events', 'nightlife', 'community'],
    featured: true,
    uploaded_at: daysAgo(4),
  },
  {
    id: 2,
    title: 'Pickleball Morning Rally',
    description: 'Serving energy and sunshine at Pickleball & Parathas.',
    url: 'https://images.unsplash.com/photo-1620138540899-78a0f6ad0da4?auto=format&fit=crop&w=1200&q=80',
    tags: ['sports', 'brunch'],
    featured: false,
    uploaded_at: daysAgo(9),
  },
  {
    id: 3,
    title: 'Café Vinyl Lounge',
    description: 'Cozy corners and chai flights at the Desi Lofi Café Rave.',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    tags: ['cafe', 'music'],
    featured: true,
    uploaded_at: daysAgo(15),
  },
]

