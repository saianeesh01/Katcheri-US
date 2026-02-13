import { FormEvent, useMemo, useState, useEffect } from 'react'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { addEventLocal, Event, fetchEvents, updateEventLocal } from '../../store/slices/eventsSlice'
import api from '../../lib/api'
import { FadeContent, SpotlightCard, StarBorder } from '@appletosolutions/reactbits'
import { Link } from 'react-router-dom'
import AdminNav from '../../components/AdminNav'

interface TicketDraft {
  tempId: number
  name: string
  price: string
  quantity: string
}

const blankTicket = (): TicketDraft => ({
  tempId: Date.now(),
  name: '',
  price: '',
  quantity: '',
})

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default function EventsAdminPage() {
  const dispatch = useAppDispatch()
  const { events, isLoading } = useAppSelector((state) => state.events)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [tickets, setTickets] = useState<TicketDraft[]>([blankTicket()])
  const [formValues, setFormValues] = useState({
    title: '',
    subtitle: '',
    description: '',
    venue: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    date: '',
    time: '',
    coverImage: '',
    status: 'draft',
  })

  useEffect(() => {
    dispatch(fetchEvents({ page: 1 }))
  }, [dispatch])

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime()
    )
  }, [events])

  const resetForm = () => {
    setFormValues({
      title: '',
      subtitle: '',
      description: '',
      venue: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      date: '',
      time: '',
      coverImage: '',
      status: 'draft',
    })
    setTickets([blankTicket()])
  }

  const handleTicketChange = (tempId: number, field: keyof TicketDraft, value: string) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.tempId === tempId ? { ...ticket, [field]: value } : ticket))
    )
  }

  const addTicketRow = () => {
    setTickets((prev) => [...prev, blankTicket()])
  }

  const removeTicketRow = (tempId: number) => {
    setTickets((prev) => prev.filter((ticket) => ticket.tempId !== tempId))
  }

  const handleStatusToggle = async (eventId: number, status: string) => {
    try {
      await api.patch(`/admin/events/${eventId}`, { status })
    } catch (error) {
      console.warn('[admin] Falling back to local event status update', error)
    } finally {
      dispatch(updateEventLocal({ id: eventId, changes: { status } }))
    }
  }

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setStatusMessage(null)

    if (!formValues.title) {
      setFormError('Title is required.')
      return
    }

    if (!formValues.date) {
      setFormError('Start date is required.')
      return
    }

    setIsSaving(true)

    const isoStart = new Date(`${formValues.date}T${formValues.time || '18:00'}`).toISOString()
    const ticketsPayload = tickets
      .filter((ticket) => ticket.name.trim())
      .map((ticket, index) => ({
        id: Date.now() + index,
        name: ticket.name,
        price: Number(ticket.price) || 0,
        quantity_available: Number(ticket.quantity) || 0,
        is_available: true,
      }))

    const newEvent: Event = {
      id: Date.now(),
      slug: slugify(formValues.title) || `event-${Date.now()}`,
      title: formValues.title,
      subtitle: formValues.subtitle,
      description: formValues.description,
      venue: formValues.venue,
      address: formValues.address,
      city: formValues.city,
      state: formValues.state,
      zip: formValues.zip,
      status: formValues.status,
      start_datetime: isoStart,
      cover_image_url: formValues.coverImage || undefined,
      ticket_types: ticketsPayload,
    }

    try {
      await api.post('/admin/events', {
        ...newEvent,
        ticket_types: ticketsPayload,
      })
      setStatusMessage('Event created via API.')
    } catch (error) {
      console.warn('[admin] Creating event locally until API is ready', error)
      setStatusMessage('Event saved locally. Connect the API to persist.')
    } finally {
      dispatch(addEventLocal(newEvent))
      resetForm()
      setIsFormOpen(false)
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <AdminNav />
      <FadeContent duration={600}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-white">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-white">
              Events Management
            </h1>
            <p className="text-sm max-w-2xl text-white/85">
              Launch, schedule, and maintain upcoming Katcheri productions. Once the API is live,
              these controls will push directly to the database.
            </p>
          </div>
          <StarBorder
            as="button"
            color="rgba(107,70,193,0.6)"
            speed="2.4s"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary-dark"
            onClick={() => {
              setIsFormOpen((prev) => !prev)
              setFormError(null)
              setStatusMessage(null)
            }}
          >
            {isFormOpen ? 'Close Form' : 'Create Event'}
          </StarBorder>
        </div>
      </FadeContent>

      {statusMessage && (
        <FadeContent duration={500}>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary shadow-sm shadow-primary/10">
            {statusMessage}
          </div>
        </FadeContent>
      )}

      {isFormOpen && (
        <FadeContent duration={700}>
          <SpotlightCard className="rounded-3xl border border-white/40 bg-primary/95 p-8 text-white shadow-xl shadow-primary/20">
            <form className="space-y-6" onSubmit={handleCreate}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col text-sm font-medium text-white">
                  Event Title
                  <input
                    type="text"
                    className="mt-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                    value={formValues.title}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-white">
                  Subtitle
                  <input
                    type="text"
                    className="mt-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                    value={formValues.subtitle}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, subtitle: e.target.value }))}
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-white">
                  Date
                  <input
                    type="date"
                    className="mt-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                    value={formValues.date}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-white">
                  Time
                  <input
                    type="time"
                    className="mt-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                    value={formValues.time}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-white">
                  Venue
                  <input
                    type="text"
                    className="mt-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                    value={formValues.venue}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, venue: e.target.value }))}
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-white">
                  Status
                  <select
                    className="mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={formValues.status}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>

              <label className="flex flex-col text-sm font-medium text-white">
                Description
                <textarea
                  className="mt-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                  rows={4}
                  value={formValues.description}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, description: e.target.value }))}
                />
              </label>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex flex-col text-sm font-medium text-white">
                  Address
                  <input
                    type="text"
                    className="mt-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                    value={formValues.address}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-white">
                  City
                  <input
                    type="text"
                    className="mt-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                    value={formValues.city}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-white">
                  State
                  <input
                    type="text"
                    className="mt-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                    value={formValues.state}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, state: e.target.value }))}
                  />
                </label>
              </div>

              <label className="flex flex-col text-sm font-medium text-white">
                Cover Image URL
                <input
                  type="url"
                  className="mt-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                  value={formValues.coverImage}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, coverImage: e.target.value }))}
                />
              </label>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-heading font-semibold text-white">Ticket Tiers</h3>
                  <button
                    type="button"
                    className="text-sm font-semibold text-primary hover:underline"
                    onClick={addTicketRow}
                  >
                    Add Ticket Tier
                  </button>
                </div>
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.tempId}
                      className="grid gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-4 md:grid-cols-4"
                    >
                      <label className="flex flex-col text-xs font-medium text-white">
                        Name
                        <input
                          type="text"
                          className="mt-1 rounded border border-white/25 bg-white/10 px-2 py-1 text-white placeholder-white/60 focus:border-white focus:outline-none"
                          value={ticket.name}
                          onChange={(e) => handleTicketChange(ticket.tempId, 'name', e.target.value)}
                          placeholder="General Admission"
                        />
                      </label>
                      <label className="flex flex-col text-xs font-medium text-white">
                        Price
                        <input
                          type="number"
                          min="0"
                          className="mt-1 rounded border border-white/25 bg-white/10 px-2 py-1 text-white placeholder-white/60 focus:border-white focus:outline-none"
                          value={ticket.price}
                          onChange={(e) => handleTicketChange(ticket.tempId, 'price', e.target.value)}
                          placeholder="30"
                        />
                      </label>
                      <label className="flex flex-col text-xs font-medium text-white">
                        Quantity
                        <input
                          type="number"
                          min="0"
                          className="mt-1 rounded border border-white/25 bg-white/10 px-2 py-1 text-white placeholder-white/60 focus:border-white focus:outline-none"
                          value={ticket.quantity}
                          onChange={(e) => handleTicketChange(ticket.tempId, 'quantity', e.target.value)}
                          placeholder="100"
                        />
                      </label>
                      <div className="flex items-end justify-end">
                        {tickets.length > 1 && (
                          <button
                            type="button"
                            className="text-xs font-semibold text-white hover:underline"
                            onClick={() => removeTicketRow(ticket.tempId)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    resetForm()
                    setIsFormOpen(false)
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-md shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </SpotlightCard>
        </FadeContent>
      )}

      <SpotlightCard className="rounded-3xl border border-white/30 bg-primary/95 p-8 shadow-xl shadow-primary/20 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-heading font-semibold text-white">Event Schedule</h2>
          <Link to="/events" className="text-white/85 font-medium hover:underline text-sm">
            View public listings →
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-white/70">Loading events...</div>
        ) : sortedEvents.length === 0 ? (
          <div className="py-12 text-center text-white/70">No events yet. Start by creating one.</div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20 text-white">
              <thead>
                <tr className="text-left text-sm font-semibold uppercase tracking-wide text-white/80">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Start</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Tickets</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {sortedEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-4 py-3 font-semibold text-white">
                      <div>{event.title}</div>
                      {event.subtitle && (
                        <div className="text-xs text-white/75">{event.subtitle}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/85">
                      {new Date(event.start_datetime).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-white/85">{event.venue ?? 'TBD'}</td>
                    <td className="px-4 py-3 text-white/85">
                      {event.ticket_types?.length ?? 0} tiers
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${event.status === 'published'
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-500 text-white'
                          }`}
                      >
                        {event.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        {event.status !== 'published' ? (
                          <button
                            type="button"
                            className="text-xs font-semibold text-white hover:underline"
                            onClick={() => handleStatusToggle(event.id, 'published')}
                          >
                            Publish
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="text-xs font-semibold text-white/70 hover:underline"
                            onClick={() => handleStatusToggle(event.id, 'draft')}
                          >
                            Mark Draft
                          </button>
                        )}
                        <Link
                          to={`/events/${event.slug}`}
                          className="text-xs font-semibold text-white/70 hover:underline"
                        >
                          Preview
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SpotlightCard>
    </div>
  )
}

