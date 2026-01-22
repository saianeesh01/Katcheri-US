import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FadeContent, SpotlightCard, StarBorder } from '@appletosolutions/reactbits'
import { useAppSelector } from '../hooks/useAppSelector'
import { mockAdminStats } from '../data/mockAdminStats'
import { mockEvents } from '../data/mockEvents'
import { mockNews } from '../data/mockNews'
import AdminNav from '../components/AdminNav'

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
    new_this_month?: number
  }
  community?: {
    volunteers: number
    partners: number
  }
}

export default function AdminDashboard() {
  // Keep auth selector wired for future role-based controls, even though
  // we currently allow preview without enforcing login.
  useAppSelector((state) => state.auth)
  const [stats, setStats] = useState<Stats | null>(mockAdminStats)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Login/role checks and live stats are disabled for now so the dashboard
    // can be previewed without authentication. Stats fall back to mock data.
    setStats(mockAdminStats)
    setIsLoading(false)
    setError('Showing sample insights with mock data. Connect the API and auth to enable live stats.')
  }, [])

  const upcomingEvents = useMemo(() => mockEvents.slice(0, 3), [])
  const recentPosts = useMemo(() => mockNews.slice(0, 3), [])

  const quickActions = [
    {
      label: 'Create Event',
      description: 'Launch a new community gathering, add tickets, and publish.',
      to: '/admin/events',
    },
    {
      label: 'Draft News Post',
      description: 'Share recaps, announcements, and volunteer spotlights.',
      to: '/admin/news',
    },
    {
      label: 'Manage Orders',
      description: 'Review ticket sales, refunds, and guest check-ins.',
      to: '/admin/orders',
    },
    {
      label: 'Media Library',
      description: 'Upload hero imagery, manage galleries, and flag featured assets.',
      to: '/admin/media',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <AdminNav />
      <FadeContent duration={600}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between text-white">
          <div>
            <h1 className="text-4xl font-heading font-semibold text-white">Admin Control Center</h1>
            <p className="mt-2 text-white/85">
              Monitor performance, launch new gatherings, and celebrate the growing Katcheri community.
            </p>
          </div>
          <StarBorder
            as={Link}
            to="/events"
            color="rgba(167,139,250,0.6)"
            speed="2.4s"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary-dark"
          >
            View Live Site
          </StarBorder>
        </div>
      </FadeContent>

      {error && (
        <FadeContent duration={500}>
          <div className="rounded-2xl border border-white/40 bg-white/10 px-4 py-3 text-sm text-white shadow-sm shadow-primary/20">
            {error}
          </div>
        </FadeContent>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading insights...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <SpotlightCard className="rounded-2xl border border-white/40 bg-primary/85 p-6 text-white shadow-lg shadow-primary/30 backdrop-blur-md">
            <h3 className="text-sm uppercase tracking-wide text-white/70">Total Orders</h3>
            <p className="mt-2 text-4xl font-heading font-semibold">{stats.orders.total}</p>
            <p className="mt-3 text-sm text-white/70">{stats.orders.recent_30_days} in the last 30 days</p>
          </SpotlightCard>
          <SpotlightCard className="rounded-2xl border border-white/40 bg-accent/85 p-6 text-white shadow-lg shadow-accent/30 backdrop-blur-md">
            <h3 className="text-sm uppercase tracking-wide text-white/70">Lifetime Revenue</h3>
            <p className="mt-2 text-4xl font-heading font-semibold">${stats.revenue.total.toLocaleString()}</p>
            <p className="mt-3 text-sm text-white/70">Across ticketing, partnerships, and merch</p>
          </SpotlightCard>
          <SpotlightCard className="rounded-2xl border border-white/30 bg-white/90 p-6 shadow-lg shadow-primary/10 backdrop-blur-md">
            <h3 className="text-sm uppercase tracking-wide text-gray-500">Events</h3>
            <p className="mt-2 text-4xl font-heading font-semibold text-primary">{stats.events.published}</p>
            <p className="mt-3 text-sm text-gray-600">
              {stats.events.total} total • {stats.events.total - stats.events.published} drafts
            </p>
          </SpotlightCard>
          <SpotlightCard className="rounded-2xl border border-white/30 bg-white/90 p-6 shadow-lg shadow-primary/10 backdrop-blur-md">
            <h3 className="text-sm uppercase tracking-wide text-gray-500">Community</h3>
            <p className="mt-2 text-4xl font-heading font-semibold text-primary">{stats.users.total}</p>
            <p className="mt-3 text-sm text-gray-600">
              {stats.users.new_this_month ?? 0} new this month • {stats.community?.volunteers ?? 0} volunteers
            </p>
          </SpotlightCard>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
          We couldn’t load analytics right now.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <SpotlightCard className="rounded-3xl border border-white/40 bg-white/90 p-8 shadow-xl shadow-primary/10 backdrop-blur-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-heading font-semibold text-primary">Upcoming Productions</h2>
              <p className="text-gray-600 text-sm">Keep tabs on what’s about to go live.</p>
            </div>
            <Link to="/admin/events" className="text-primary font-medium hover:underline">
              Manage Events
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4 text-sm text-primary shadow-sm shadow-primary/10"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-heading font-semibold text-primary">{event.title}</p>
                    <p className="text-primary/80">{event.subtitle}</p>
                  </div>
                  <div className="text-right md:text-left text-primary/70">
                    <p>{new Date(event.start_datetime).toLocaleString()}</p>
                    <p className="text-xs uppercase tracking-wide">{event.venue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>

        <SpotlightCard className="rounded-3xl border border-white/30 bg-primary/80 p-8 text-white shadow-xl shadow-primary/20 backdrop-blur-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-heading font-semibold text-white">Content Pipeline</h2>
              <p className="text-white/80 text-sm">Drafts, recaps, and spotlights ready to schedule.</p>
            </div>
            <Link to="/admin/news" className="text-white/90 font-medium hover:underline">
              Manage News
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-white/40 bg-white/10 px-5 py-4 text-sm text-white shadow-sm shadow-primary/30 backdrop-blur"
              >
                <p className="text-lg font-heading font-semibold text-white">{post.title}</p>
                {post.published_at && (
                  <p className="mt-1 text-xs uppercase tracking-wide text-white/70">
                    {new Date(post.published_at).toLocaleDateString()}
                  </p>
                )}
                <p className="mt-2 text-white/85 line-clamp-2">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>

      <SpotlightCard className="rounded-3xl border border-white/40 bg-white p-8 shadow-xl shadow-primary/10">
        <h2 className="text-2xl font-heading font-semibold text-primary mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <div key={action.label} className="rounded-2xl border border-primary/10 bg-primary/5 p-6 shadow-sm shadow-primary/10">
              <h3 className="text-lg font-heading font-semibold text-primary">{action.label}</h3>
              <p className="mt-2 text-sm text-gray-600">{action.description}</p>
              <Link to={action.to} className="mt-4 inline-flex items-center text-primary font-medium hover:underline">
                Go to tool →
              </Link>
            </div>
          ))}
        </div>
      </SpotlightCard>
    </div>
  )
}

