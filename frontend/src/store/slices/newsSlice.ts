import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../lib/api'

interface NewsPost {
  id: number
  slug: string
  title: string
  excerpt?: string
  content?: string
  cover_image_url?: string
  published_at?: string
  status: string
  author?: {
    id: number
    email: string
    first_name?: string
    last_name?: string
  }
}

interface NewsState {
  posts: NewsPost[]
  currentPost: NewsPost | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    per_page: number
    total: number
    pages: number
  } | null
}

const initialState: NewsState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  pagination: null,
}

export const fetchNews = createAsyncThunk('news/fetch', async (params?: { page?: number }) => {
  const response = await api.get('/news', { params })
  return response.data
})

export const fetchNewsBySlug = createAsyncThunk('news/fetchBySlug', async (slug: string) => {
  const response = await api.get(`/news/${slug}`)
  return response.data
})

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.isLoading = false
        state.posts = action.payload.posts
        state.pagination = action.payload.pagination
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch news'
      })
      .addCase(fetchNewsBySlug.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNewsBySlug.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentPost = action.payload
      })
      .addCase(fetchNewsBySlug.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch news post'
      })
  },
})

export default newsSlice.reducer

