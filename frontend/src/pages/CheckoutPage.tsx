import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector'
import { fetchCart, clearCart } from '../store/slices/cartSlice'
import api from '../lib/api'
import Input from '../components/Input'
import Button from '../components/Button'

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  holder_name: z.string().optional(),
  holder_email: z.string().email('Invalid email').optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { cart } = useAppSelector((state) => state.cart)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cart || cart.items.length === 0) {
      setError('Cart is empty')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await api.post('/orders/checkout', data)
      dispatch(clearCart())
      navigate(`/account/orders/${response.data.id}`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Checkout failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-heading font-semibold mb-4">Checkout</h1>
        <p className="text-gray-600 mb-8">Your cart is empty.</p>
        <Button onClick={() => navigate('/events')}>Browse Events</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-heading font-semibold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-heading font-semibold mb-4">Contact Information</h2>
          <Input
            label="Email *"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="card">
          <h2 className="text-2xl font-heading font-semibold mb-4">Ticket Holder Information</h2>
          <Input
            label="Name (optional)"
            {...register('holder_name')}
            error={errors.holder_name?.message}
          />
          <Input
            label="Email (optional)"
            type="email"
            className="mt-4"
            {...register('holder_email')}
            error={errors.holder_email?.message}
          />
        </div>

        <div className="card">
          <h2 className="text-2xl font-heading font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fees</span>
              <span>$0.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Processing...' : 'Complete Order'}
        </Button>

        <p className="text-sm text-gray-500 text-center">
          Note: Payment integration will be added in a later phase. This order will be created as pending.
        </p>
      </form>
    </div>
  )
}

