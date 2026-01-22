import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ScrollFloat, ClickSpark, StarBorder, SpotlightCard, FadeContent } from '@appletosolutions/reactbits'
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector'
import { fetchEvents } from '../store/slices/eventsSlice'
import { fetchNews } from '../store/slices/newsSlice'
import EventCard from '../components/EventCard'
import NewsCard from '../components/NewsCard'

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
      <section className="relative overflow-hidden text-white py-24">
        <div className="container mx-auto px-4 relative">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6 text-left">
              <FadeContent duration={600}>
                <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm uppercase tracking-wide">
                  DMV Desi Community
                </span>
              </FadeContent>
              <FadeContent duration={700}>
                <h1 className="text-5xl lg:text-6xl font-heading font-semibold leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)]">
                  Welcome to Katcheri Events
                </h1>
                <p className="text-xl text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
                  Moving to a new city is tough. Finding your people? Even tougher. We’re building a vibrant Desi community in the DMV where authentic connection meets unforgettable nights out.
                </p>
              </FadeContent>
              <div className="flex flex-wrap gap-4 pt-2">
                <ScrollFloat intensity={12}>
                  <ClickSpark sparkColor="#A78BFA" sparkCount={14} sparkRadius={36}>
                    <StarBorder
                      as={Link}
                      to="/events"
                      color="rgba(167, 139, 250, 0.65)"
                      speed="2.6s"
                      className="inline-flex items-center justify-center rounded-full bg-white/90 px-10 py-3 font-semibold text-primary shadow-xl shadow-primary/30 transition hover:-translate-y-1 hover:bg-white"
                    >
                      Browse Events
                    </StarBorder>
                  </ClickSpark>
                </ScrollFloat>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-10 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
                >
                  Join the Community
                </Link>
              </div>
              <FadeContent duration={900}>
                <div className="grid gap-4 pt-8 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/10 p-5 text-left backdrop-blur-md shadow-lg shadow-primary/20">
                    <p className="text-3xl font-heading font-semibold">50+</p>
                    <p className="mt-1 text-sm uppercase tracking-wide text-white/70">Events Hosted</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-5 text-left backdrop-blur-md shadow-lg shadow-primary/20">
                    <p className="text-3xl font-heading font-semibold">3K+</p>
                    <p className="mt-1 text-sm uppercase tracking-wide text-white/70">Community Members</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-5 text-left backdrop-blur-md shadow-lg shadow-primary/20">
                    <p className="text-3xl font-heading font-semibold">Countless</p>
                    <p className="mt-1 text-sm uppercase tracking-wide text-white/70">Friendships Formed</p>
                  </div>
                </div>
              </FadeContent>
            </div>

            <FadeContent duration={850}>
              <SpotlightCard className="rounded-3xl border border-white/40 bg-white/10 p-10 text-left text-white shadow-2xl shadow-primary/30 backdrop-blur-md">
                <h2 className="text-3xl font-heading font-semibold text-white mb-4">Our Story</h2>
                <p className="text-base leading-relaxed text-white/90">
                  Each of us landed in the DMV searching for a real Desi crew—one that felt more like a living room hangout than a networking event. After coming up short, we decided to build it ourselves.
                </p>
                <p className="mt-4 text-base leading-relaxed text-white/90">
                  Katcheri balances authentic community with the laid-back vibe of friends discovering new experiences together. Think café raves, pickleball nights, dance parties, creative collabs, and the kind of conversations you’ll want to keep going.
                </p>
                <p className="mt-4 text-base leading-relaxed text-white/90">
                  If you’ve been missing a sense of belonging, this is your invitation. Jump into the next Katcheri and find your people.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">Café Raves</span>
                  <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">Pickleball Nights</span>
                  <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">Dance Parties</span>
                  <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">Creative Pop-Ups</span>
                </div>
              </SpotlightCard>
            </FadeContent>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-muted-bg">
        <div className="container mx-auto px-4">
          <FadeContent duration={600} containerClassName="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-3xl font-heading font-semibold">Upcoming Events</h2>
            <Link to="/events" className="text-primary hover:underline font-medium">
              View All →
            </Link>
          </FadeContent>
          {eventsLoading ? (
            <div className="text-center py-12">Loading events...</div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <FadeContent key={event.id} duration={600 + index * 100} containerClassName="h-full">
                  <EventCard event={event} />
                </FadeContent>
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
          <FadeContent duration={600} containerClassName="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-3xl font-heading font-semibold">Latest News</h2>
            <Link to="/news" className="text-primary hover:underline font-medium">
              View All →
            </Link>
          </FadeContent>
          {newsLoading ? (
            <div className="text-center py-12">Loading news...</div>
          ) : recentNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentNews.map((post, index) => (
                <FadeContent key={post.id} duration={600 + index * 100} containerClassName="h-full">
                  <NewsCard post={post} />
                </FadeContent>
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

