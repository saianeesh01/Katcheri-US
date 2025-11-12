import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../lib/api'

interface CartItem {
  id: number
  ticket_type_id: number
  ticket_type?: {
    id: number
    name: string
    price: number
    event_id: number
  }
  quantity: number
  unit_price: number
  subtotal: number
}

interface Cart {
  id: number
  items: CartItem[]
  subtotal: number
}

interface CartState {
  cart: Cart | null
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
}

// Initialize session ID if not exists
if (!localStorage.getItem('session_id')) {
  localStorage.setItem('session_id', crypto.randomUUID())
}

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const response = await api.get('/cart')
  return response.data
})

export const addToCart = createAsyncThunk(
  'cart/add',
  async (data: { event_id: number; ticket_type_id: number; quantity: number }) => {
    const response = await api.post('/cart', data)
    return response.data
  }
)

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId: number) => {
  await api.delete(`/cart/${itemId}`)
  return itemId
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.cart = action.payload
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch cart'
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart.items = state.cart.items.filter((item) => item.id !== action.payload)
          state.cart.subtotal = state.cart.items.reduce((sum, item) => sum + item.subtotal, 0)
        }
      })
  },
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer

