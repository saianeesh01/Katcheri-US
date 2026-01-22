import { addDays, addHours } from 'date-fns'

const now = new Date()

const createDate = (daysFromNow: number, hoursFromNow: number) => {
  const date = addDays(now, daysFromNow)
  return addHours(date, hoursFromNow).toISOString()
}

export const mockEvents = [
  {
    id: 1,
    slug: 'desi-lofi-cafe-rave',
    title: 'Desi Lofi Café Rave',
    subtitle: 'A late-night mix of chai, vinyl, and vibey beats',
    description:
      'Settle into the coziest corners of our partner café for a night of chill beats, creative pop-ups, and new friends. Featuring live vinyl mixing, card games, and limited-edition Katcheri chai flights.',
    venue: 'Third Rail Coffee Collective',
    address: '2454 18th St NW',
    city: 'Washington',
    state: 'DC',
    zip: '20009',
    start_datetime: createDate(5, 20),
    end_datetime: createDate(6, 1),
    cover_image_url: 'https://images.unsplash.com/photo-1529088746738-4575547d9430?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    ticket_types: [
      {
        id: 101,
        name: 'Early Bird',
        description: 'Includes chai flight + access to vinyl lounge',
        price: 22,
        quantity_available: 25,
        is_available: true,
      },
      {
        id: 102,
        name: 'General Admission',
        price: 28,
        quantity_available: 60,
        is_available: true,
      },
    ],
  },
  {
    id: 2,
    slug: 'pickleball-and-parathas',
    title: 'Pickleball & Parathas',
    subtitle: 'A Saturday morning rally for brunch lovers',
    description:
      'Reserve a court, rally with new friends, and refuel with chef-driven paratha tacos and masala mimosas. All skill levels welcome—just bring your energy.',
    venue: 'District Sports Hub',
    address: '4801 Eisenhower Ave',
    city: 'Alexandria',
    state: 'VA',
    zip: '22304',
    start_datetime: createDate(12, 10),
    end_datetime: createDate(12, 13),
    cover_image_url: 'https://images.unsplash.com/photo-1620138540899-78a0f6ad0da4?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    ticket_types: [
      {
        id: 201,
        name: 'Rally Squad',
        description: 'Court time + brunch plate',
        price: 35,
        quantity_available: 40,
        is_available: true,
      },
      {
        id: 202,
        name: 'Spectator Brunch',
        price: 20,
        quantity_available: 30,
        is_available: true,
      },
    ],
  },
  {
    id: 3,
    slug: 'bollywood-bass-warehouse',
    title: 'Bollywood Bass Warehouse',
    subtitle: 'Late-night dance party meets art installation',
    description:
      'A high-energy warehouse night with live DJs, projection-mapped visuals, and surprise performances. Dress for neon, stay for the cypher.',
    venue: 'The Foundry Loft',
    address: '1350 Okie St NE',
    city: 'Washington',
    state: 'DC',
    zip: '20002',
    start_datetime: createDate(22, 21),
    end_datetime: createDate(23, 2),
    cover_image_url: 'https://images.unsplash.com/photo-1521337580396-0259d8b721f7?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    ticket_types: [
      {
        id: 301,
        name: 'Dance Floor',
        price: 32,
        quantity_available: 80,
        is_available: true,
      },
      {
        id: 302,
        name: 'VIP Loft',
        description: 'Private lounge + complimentary mocktail flight',
        price: 55,
        quantity_available: 20,
        is_available: true,
      },
    ],
  },
] as const

export type MockEvent = (typeof mockEvents)[number]



