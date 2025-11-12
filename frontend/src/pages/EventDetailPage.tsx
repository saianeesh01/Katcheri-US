import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector'
import { fetchEventBySlug } from '../store/slices/eventsSlice'
import { addToCart, fetchCart } from '../store/slices/cartSlice'
import Input from '../components/Input'
import Button from '../components/Button'

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentEvent, isLoading } = useAppSelector((state) => state.events)
  const [selectedTicketType, setSelectedTicketType] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (slug) {
      dispatch(fetchEventBySlug(slug))
    }
  }, [dispatch, slug])

  const handleAddToCart = async () => {
    if (!currentEvent || !selectedTicketType) return

    await dispatch(
      addToCart({
        event_id: currentEvent.id,
        ticket_type_id: selectedTicketType,
        quantity,
      })
    )
    dispatch(fetchCart())
    navigate('/cart')
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
  }

  if (!currentEvent) {
    return <div className="container mx-auto px-4 py-8 text-center">Event not found</div>
  }

  const eventDate = new Date(currentEvent.start_datetime)
  const availableTicketTypes = currentEvent.ticket_types?.filter((tt) => tt.is_available) || []

  return (
    <div className="container mx-auto px-4 py-8">
      {currentEvent.cover_image_url && (
        <img
          src={currentEvent.cover_image_url}
          alt={currentEvent.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-heading font-semibold mb-4">{currentEvent.title}</h1>
          {currentEvent.subtitle && (
            <p className="text-xl text-gray-600 mb-4">{currentEvent.subtitle}</p>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(eventDate, 'EEEE, MMMM d, yyyy')} at {format(eventDate, 'h:mm a')}
            </div>
            {currentEvent.venue && (
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {currentEvent.venue}
                {currentEvent.address && `, ${currentEvent.address}`}
                {currentEvent.city && `, ${currentEvent.city}`}
              </div>
            )}
          </div>

          {currentEvent.description && (
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 whitespace-pre-line">{currentEvent.description}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-2xl font-heading font-semibold mb-6">Get Tickets</h2>

            {availableTicketTypes.length > 0 ? (
              <div className="space-y-4">
                {availableTicketTypes.map((ticketType) => (
                  <div
                    key={ticketType.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedTicketType === ticketType.id
                        ? 'border-primary bg-muted-bg'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                    onClick={() => setSelectedTicketType(ticketType.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{ticketType.name}</h3>
                        {ticketType.description && (
                          <p className="text-sm text-gray-600 mt-1">{ticketType.description}</p>
                        )}
                      </div>
                      <span className="text-lg font-semibold text-primary">
                        ${ticketType.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {ticketType.quantity_available} available
                    </p>
                  </div>
                ))}

                {selectedTicketType && (
                  <div className="mt-6 space-y-4">
                    <Input
                      type="number"
                      label="Quantity"
                      min="1"
                      max={
                        availableTicketTypes.find((tt) => tt.id === selectedTicketType)
                          ?.quantity_available || 1
                      }
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                    <Button
                      onClick={handleAddToCart}
                      className="w-full"
                      disabled={quantity < 1}
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No tickets available at this time.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

