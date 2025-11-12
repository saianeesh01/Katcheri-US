import { useEffect, useState } from 'react'
import { useAppSelector } from '../hooks/useAppSelector'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

interface Stats {
  orders: {
    total: number
    recent_30_days: number
  }
  revenue: {
    total: number
  }
  events: {
    total: number
    published: number
  }
  news: {
    total: number
    published: number
  }
  users: {
    total: number
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user.role !== 'admin') {
      navigate('/')
      return
    }

    api
      .get('/admin/stats')
      .then((response) => {
        setStats(response.data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [user, navigate])

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-semibold mb-8">Admin Dashboard</h1>

      {isLoading ? (
        <div className="text-center py-12">Loading stats...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-primary">{stats.orders.total}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.orders.recent_30_days} in last 30 days
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-primary">${stats.revenue.total.toFixed(2)}</p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Events</h3>
            <p className="text-3xl font-bold text-primary">{stats.events.published}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.events.total} total ({stats.events.total - stats.events.published} draft)
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">News Posts</h3>
            <p className="text-3xl font-bold text-primary">{stats.news.published}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.news.total} total ({stats.news.total - stats.news.published} draft)
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Users</h3>
            <p className="text-3xl font-bold text-primary">{stats.users.total}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">Failed to load stats.</div>
      )}

      <div className="mt-8 card">
        <h2 className="text-2xl font-heading font-semibold mb-4">Quick Actions</h2>
        <p className="text-gray-600">
          Admin CRUD operations for events, news, and other content can be added here or accessed
          via API endpoints.
        </p>
      </div>
    </div>
  )
}

