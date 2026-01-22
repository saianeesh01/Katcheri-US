import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { SpotlightCard, StarBorder } from '@appletosolutions/reactbits'

interface Event {
  id: number
  slug: string
  title: string
  subtitle?: string
  venue?: string
  start_datetime: string
  cover_image_url?: string
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.start_datetime)
  
  return (
    <SpotlightCard className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/40 bg-primary/80 p-0 shadow-lg shadow-primary/20 backdrop-blur-md transition">
      {event.cover_image_url && (
        <img
          src={event.cover_image_url}
          alt={event.title}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="flex flex-1 flex-col p-6 text-white">
        <h3 className="text-xl font-heading font-semibold mb-2">
          <Link to={`/events/${event.slug}`} className="hover:text-white">
            {event.title}
          </Link>
        </h3>
        {event.subtitle && (
          <p className="text-white/80 mb-2">{event.subtitle}</p>
        )}
        <div className="text-sm text-white/70 space-y-1">
          <p className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {format(eventDate, 'MMMM d, yyyy')} at {format(eventDate, 'h:mm a')}
          </p>
          {event.venue && (
            <p className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.venue}
            </p>
          )}
        </div>
        <StarBorder
          as={Link}
          to={`/events/${event.slug}`}
          color="rgba(255, 255, 255, 0.6)"
          speed="2.4s"
          className="mt-6 inline-flex w-fit items-center rounded-full bg-white/90 px-6 py-2 text-sm font-semibold text-primary shadow-md shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white"
        >
          View Details
        </StarBorder>
      </div>
    </SpotlightCard>
  )
}

