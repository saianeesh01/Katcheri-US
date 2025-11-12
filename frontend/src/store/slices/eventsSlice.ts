import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../lib/api'

interface TicketType {
  id: number
  name: string
  description?: string
  price: number
  quantity_available: number
  is_available: boolean
}

interface Event {
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
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,
  pagination: null,
}

export const fetchEvents = createAsyncThunk(
  'events/fetch',
  async (params?: { q?: string; date_from?: string; date_to?: string; venue?: string; page?: number }) => {
    const response = await api.get('/events', { params })
    return response.data
  }
)

export const fetchEventBySlug = createAsyncThunk('events/fetchBySlug', async (slug: string) => {
  const response = await api.get(`/events/${slug}`)
  return response.data
})

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
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

export default eventsSlice.reducer

