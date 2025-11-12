import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector'
import { fetchEvents } from '../store/slices/eventsSlice'
import { fetchNews } from '../store/slices/newsSlice'
import EventCard from '../components/EventCard'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { events, isLoading: eventsLoading } = useAppSelector((state) => state.events)
  const { posts, isLoading: newsLoading } = useAppSelector((state) => state.news)

  useEffect(() => {
    dispatch(fetchEvents({ page: 1 }))
    dispatch(fetchNews({ page: 1 }))
  }, [dispatch])

  const upcomingEvents = events.slice(0, 3)
  const recentNews = posts.slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-heading font-semibold mb-4">
            Welcome to Katcheri Events
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover upcoming classical concerts and community events. Get your tickets today!
          </p>
          <Link to="/events" className="btn-primary bg-white text-primary hover:bg-gray-100">
            Browse Events
          </Link>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-muted-bg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading font-semibold">Upcoming Events</h2>
            <Link to="/events" className="text-primary hover:underline">
              View All →
            </Link>
          </div>
          {eventsLoading ? (
            <div className="text-center py-12">Loading events...</div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No upcoming events at this time.
            </div>
          )}
        </div>
      </section>

      {/* Recent News */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading font-semibold">Latest News</h2>
            <Link to="/news" className="text-primary hover:underline">
              View All →
            </Link>
          </div>
          {newsLoading ? (
            <div className="text-center py-12">Loading news...</div>
          ) : recentNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentNews.map((post) => (
                <div key={post.id} className="card">
                  {post.cover_image_url && (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-semibold mb-2">
                      <Link to={`/news/${post.slug}`} className="hover:text-primary">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    )}
                    <Link
                      to={`/news/${post.slug}`}
                      className="text-primary hover:underline font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No news posts at this time.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

