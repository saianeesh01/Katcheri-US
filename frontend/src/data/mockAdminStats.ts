import { mockEvents } from './mockEvents'
import { mockNews } from './mockNews'

export const mockAdminStats = {
  orders: {
    total: 1428,
    recent_30_days: 187,
  },
  revenue: {
    total: 128560.75,
  },
  events: {
    total: mockEvents.length + 2, // assume a couple drafts
    published: mockEvents.length,
  },
  news: {
    total: mockNews.length + 1,
    published: mockNews.length,
  },
  users: {
    total: 3265,
    new_this_month: 214,
  },
  community: {
    volunteers: 48,
    partners: 17,
  },
} as const

export type MockAdminStats = typeof mockAdminStats



