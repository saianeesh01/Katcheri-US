import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '../../lib/api'
import { mockNews } from '../../data/mockNews'

export interface NewsPost {
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
  posts: mockNews.map((post) => ({ ...post })),
  currentPost: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    per_page: mockNews.length,
    total: mockNews.length,
    pages: 1,
  },
}

type NewsResponse = {
  posts: NewsPost[]
  pagination: Exclude<NewsState['pagination'], null>
}

const buildFallbackNewsResponse = (): NewsResponse => ({
  posts: mockNews.map((post) => ({ ...post })),
  pagination: {
    page: 1,
    per_page: mockNews.length,
    total: mockNews.length,
    pages: 1,
  },
})

export const fetchNews = createAsyncThunk('news/fetch', async (params?: { page?: number }): Promise<NewsResponse> => {
  try {
    const response = await api.get('/news', { params })
    const data = response.data
    if (data?.posts && Array.isArray(data.posts) && data.posts.length > 0) {
      return data
    }
    console.warn('[news] API returned no posts, using mock news instead')
    return buildFallbackNewsResponse()
  } catch (error) {
    console.warn('[news] Falling back to mock news data', error)
    return buildFallbackNewsResponse()
  }
})

export const fetchNewsBySlug = createAsyncThunk('news/fetchBySlug', async (slug: string) => {
  try {
    const response = await api.get(`/news/${slug}`)
    return response.data
  } catch (error) {
    console.warn(`[news] Falling back to mock news post for slug "${slug}"`, error)
    const fallback = mockNews.find((post) => post.slug === slug)
    if (fallback) {
      return { ...fallback }
    }
    throw error
  }
})

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    addNewsLocal: (state, action: PayloadAction<NewsPost>) => {
      const existingIndex = state.posts.findIndex(
        (post) => post.id === action.payload.id || post.slug === action.payload.slug
      )
      if (existingIndex >= 0) {
        state.posts[existingIndex] = action.payload
      } else {
        state.posts = [action.payload, ...state.posts]
      }

      if (state.pagination) {
        state.pagination.total = state.posts.length
        state.pagination.per_page = Math.max(state.pagination.per_page, state.posts.length)
        state.pagination.pages = 1
      } else {
        state.pagination = {
          page: 1,
          per_page: state.posts.length,
          total: state.posts.length,
          pages: 1,
        }
      }
    },
    updateNewsLocal: (state, action: PayloadAction<{ id: number; changes: Partial<NewsPost> }>) => {
      const index = state.posts.findIndex((post) => post.id === action.payload.id)
      if (index >= 0) {
        state.posts[index] = {
          ...state.posts[index],
          ...action.payload.changes,
        }
      }
    },
  },
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

export const { addNewsLocal, updateNewsLocal } = newsSlice.actions

export default newsSlice.reducer

