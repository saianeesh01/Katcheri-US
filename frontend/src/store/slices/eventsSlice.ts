import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '../../lib/api'
import { mockEvents } from '../../data/mockEvents'

interface TicketType {
  id: number
  name: string
  description?: string
  price: number
  quantity_available: number
  is_available: boolean
}

export interface Event {
  id: number
  slug: string
  title: string
  subtitle?: string
  description?: string
  venue?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  start_datetime: string
  end_datetime?: string
  cover_image_url?: string
  status: string
  ticket_types?: TicketType[]
}

interface EventsState {
  events: Event[]
  currentEvent: Event | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    per_page: number
    total: number
    pages: number
  } | null
}

const initialState: EventsState = {
  events: mockEvents.map((event) => ({ ...event })) as unknown as Event[],
  currentEvent: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    per_page: mockEvents.length,
    total: mockEvents.length,
    pages: 1,
  },
}

type EventsResponse = {
  events: Event[]
  pagination: Exclude<EventsState['pagination'], null>
}

const buildFallbackEventsResponse = (): EventsResponse => ({
  events: mockEvents.map((event) => ({ ...event })) as unknown as Event[],
  pagination: {
    page: 1,
    per_page: mockEvents.length,
    total: mockEvents.length,
    pages: 1,
  },
})

export const fetchEvents = createAsyncThunk(
  'events/fetch',
  async (
    params?: { q?: string; date_from?: string; date_to?: string; venue?: string; page?: number }
  ): Promise<EventsResponse> => {
    try {
      const response = await api.get('/events', { params })
      const data = response.data
      if (data?.events && Array.isArray(data.events) && data.events.length > 0) {
        return data
      }
      console.warn('[events] API returned no events, using mock data instead')
      return buildFallbackEventsResponse()
    } catch (error) {
      console.warn('[events] Falling back to mock events data', error)
      return buildFallbackEventsResponse()
    }
  }
)

export const fetchEventBySlug = createAsyncThunk('events/fetchBySlug', async (slug: string) => {
  try {
    const response = await api.get(`/events/${slug}`)
    return response.data
  } catch (error) {
    console.warn(`[events] Falling back to mock event for slug "${slug}"`, error)
    const fallback = mockEvents.find((event) => event.slug === slug)
    if (fallback) {
      return { ...fallback }
    }
    throw error
  }
})

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEventLocal: (state, action: PayloadAction<Event>) => {
      const existingIndex = state.events.findIndex((ev) => ev.id === action.payload.id || ev.slug === action.payload.slug)
      if (existingIndex >= 0) {
        state.events[existingIndex] = action.payload
      } else {
        state.events = [action.payload, ...state.events]
      }

      if (state.pagination) {
        state.pagination.total = state.events.length
        state.pagination.per_page = Math.max(state.pagination.per_page, state.events.length)
        state.pagination.pages = 1
      } else {
        state.pagination = {
          page: 1,
          per_page: state.events.length,
          total: state.events.length,
          pages: 1,
        }
      }
    },
    updateEventLocal: (state, action: PayloadAction<{ id: number; changes: Partial<Event> }>) => {
      const index = state.events.findIndex((ev) => ev.id === action.payload.id)
      if (index >= 0) {
        state.events[index] = {
          ...state.events[index],
          ...action.payload.changes,
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false
        state.events = action.payload.events
        state.pagination = action.payload.pagination
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch events'
      })
      .addCase(fetchEventBySlug.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchEventBySlug.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentEvent = action.payload
      })
      .addCase(fetchEventBySlug.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch event'
      })
  },
})

export const { addEventLocal, updateEventLocal } = eventsSlice.actions
export default eventsSlice.reducer



