import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector'
import { fetchEvents } from '../store/slices/eventsSlice'
import EventCard from '../components/EventCard'
import Input from '../components/Input'

export default function EventsListPage() {
  const dispatch = useAppDispatch()
  const { events, isLoading, pagination } = useAppSelector((state) => state.events)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    date_from: '',
    date_to: '',
    venue: '',
  })

  useEffect(() => {
    dispatch(fetchEvents({ q: searchQuery, ...filters, page: 1 }))
  }, [dispatch, searchQuery, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-semibold mb-8">Events</h1>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <Input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="date"
            label="From Date"
            value={filters.date_from}
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
          />
          <Input
            type="date"
            label="To Date"
            value={filters.date_to}
            onChange={(e) => handleFilterChange('date_to', e.target.value)}
          />
          <Input
            type="text"
            label="Venue"
            placeholder="Filter by venue"
            value={filters.venue}
            onChange={(e) => handleFilterChange('venue', e.target.value)}
          />
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-12">Loading events...</div>
      ) : events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => dispatch(fetchEvents({ ...filters, page }))}
                  className={`px-4 py-2 rounded ${
                    pagination.page === page
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No events found. Try adjusting your filters.
        </div>
      )}
    </div>
  )
}

