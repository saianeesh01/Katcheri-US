import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector'
import { fetchCart, removeFromCart } from '../store/slices/cartSlice'
import Button from '../components/Button'

export default function CartPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { cart, isLoading } = useAppSelector((state) => state.cart)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const handleRemove = async (itemId: number) => {
    await dispatch(removeFromCart(itemId))
    dispatch(fetchCart())
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading cart...</div>
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-heading font-semibold mb-4">Your Cart</h1>
        <p className="text-gray-600 mb-8">Your cart is empty.</p>
        <Link to="/events" className="btn-primary">
          Browse Events
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-semibold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="card flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{item.ticket_type?.name}</h3>
                <p className="text-gray-600">
                  Quantity: {item.quantity} × ${item.unit_price.toFixed(2)}
                </p>
                <p className="text-lg font-semibold text-primary mt-2">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-600 hover:text-red-800 ml-4"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-2xl font-heading font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
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
            <Button
              onClick={() => navigate('/checkout')}
              className="w-full"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

