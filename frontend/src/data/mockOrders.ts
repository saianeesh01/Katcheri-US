export interface MockOrderItem {
  id: number
  event_title: string
  ticket_type: string
  quantity: number
  unit_price: number
}

export interface MockOrder {
  id: number
  order_number: string
  status: 'pending' | 'paid' | 'checked_in' | 'refunded'
  total: number
  placed_at: string
  customer: {
    name: string
    email: string
  }
  items: MockOrderItem[]
  notes?: string
}

const now = new Date()

const hoursAgo = (hours: number) => {
  const date = new Date(now)
  date.setHours(now.getHours() - hours)
  return date.toISOString()
}

export const mockOrders: MockOrder[] = [
  {
    id: 1,
    order_number: 'KAT-2025-1189',
    status: 'paid',
    total: 96,
    placed_at: hoursAgo(12),
    customer: {
      name: 'Jaya Nair',
      email: 'jaya@katcheri.com',
    },
    items: [
      {
        id: 1,
        event_title: 'Desi Lofi Café Rave',
        ticket_type: 'General Admission',
        quantity: 3,
        unit_price: 32,
      },
    ],
  },
  {
    id: 2,
    order_number: 'KAT-2025-1185',
    status: 'pending',
    total: 70,
    placed_at: hoursAgo(26),
    customer: {
      name: 'Rohan Patel',
      email: 'rohan@example.com',
    },
    items: [
      {
        id: 2,
        event_title: 'Pickleball & Parathas',
        ticket_type: 'Rally Squad',
        quantity: 2,
        unit_price: 35,
      },
    ],
    notes: 'Requested gluten-free brunch plate.',
  },
  {
    id: 3,
    order_number: 'KAT-2025-1176',
    status: 'checked_in',
    total: 110,
    placed_at: hoursAgo(80),
    customer: {
      name: 'Sara Subramani',
      email: 'sara.sub@example.com',
    },
    items: [
      {
        id: 3,
        event_title: 'Bollywood Bass Warehouse',
        ticket_type: 'VIP Loft',
        quantity: 2,
        unit_price: 55,
      },
    ],
  },
] 

