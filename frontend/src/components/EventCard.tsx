import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

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
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden"
    >
      {event.cover_image_url && (
        <img
          src={event.cover_image_url}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-heading font-semibold mb-2">
          <Link to={`/events/${event.slug}`} className="hover:text-primary">
            {event.title}
          </Link>
        </h3>
        {event.subtitle && (
          <p className="text-gray-600 mb-2">{event.subtitle}</p>
        )}
        <div className="text-sm text-gray-500 space-y-1">
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
        <Link
          to={`/events/${event.slug}`}
          className="mt-4 inline-block btn-primary"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  )
}

