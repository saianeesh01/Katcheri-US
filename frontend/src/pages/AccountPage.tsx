import { useEffect, useState } from 'react'
import { useAppSelector } from '../hooks/useAppSelector'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { format } from 'date-fns'

interface Order {
  id: number
  order_number: string
  total: number
  status: string
  created_at: string
  items: Array<{
    id: number
    event: {
      title: string
      slug: string
    }
    quantity: number
    unit_price: number
  }>
}

export default function AccountPage() {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    api
      .get('/orders')
      .then((response) => {
        setOrders(response.data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [user, navigate])

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-semibold mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-2xl font-heading font-semibold mb-4">Profile</h2>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {user.first_name && (
                <p>
                  <strong>Name:</strong> {user.first_name} {user.last_name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-heading font-semibold mb-4">Order History</h2>
          {isLoading ? (
            <div className="text-center py-12">Loading orders...</div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">Order {order.order_number}</h3>
                      <p className="text-gray-600 text-sm">
                        {format(new Date(order.created_at), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.event.title}
                        </span>
                        <span>${(item.quantity * item.unit_price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

