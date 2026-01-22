import { formatISO } from 'date-fns'

const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return formatISO(date)
}

export const mockNews = [
  {
    id: 1,
    slug: 'katcheri-welcomes-2025',
    title: 'Katcheri Welcomes 2025 with a Neon Night Market',
    excerpt:
      'We kicked off the new year with an immersive neon night market featuring South Asian street food, DJ collabs, and a packed dance floor.',
    content:
      'Our 2025 opener brought together 400+ community members under one roof for a neon-lit celebration. From Sindhi street eats to an interactive mehndi lounge, the night was designed to showcase the creativity of DMV-based South Asian makers. Big shoutout to our partner DJs who kept the energy high until the lights came on.',
    cover_image_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
    published_at: daysAgo(6),
    status: 'published',
    author: {
      id: 1,
      email: 'team@katcheri.com',
      first_name: 'Katcheri',
      last_name: 'Collective',
    },
  },
  {
    id: 2,
    slug: 'pickleball-league-announcement',
    title: 'Announcing Our Spring Pickleball League',
    excerpt:
      'Three weeks, six courts, endless hyped brunch pairings—our spring league is here with new skill tracks and DJ warm-ups.',
    content:
      'Back by popular demand: Pickleball & Parathas is evolving into a full mini league. We’re introducing rotating DJs for warm-ups, captains for each court, and curated brunch menus each week. Register early to secure your preferred time slots and squad up with new friends.',
    cover_image_url: 'https://images.unsplash.com/photo-1617957743091-9f75103552ef?auto=format&fit=crop&w=1200&q=80',
    published_at: daysAgo(14),
    status: 'published',
    author: {
      id: 2,
      email: 'events@katcheri.com',
      first_name: 'Event',
      last_name: 'Crew',
    },
  },
  {
    id: 3,
    slug: 'volunteer-spotlight-aarti',
    title: 'Volunteer Spotlight: Meet Aarti, Our Creative Producer',
    excerpt:
      'From projection-mapped visuals to chai pairing menus, Aarti brings her creative direction to every Katcheri experience.',
    content:
      'Aarti joined Katcheri last summer and has since designed immersive visual stories for our warehouse parties and curated tasting menus for intimate salon-style gatherings. Learn what fuels her creativity and how she’s shaping the next wave of community experiences.',
    cover_image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    published_at: daysAgo(21),
    status: 'published',
    author: {
      id: 3,
      email: 'stories@katcheri.com',
      first_name: 'Story',
      last_name: 'Team',
    },
  },
] as const

export type MockNewsPost = (typeof mockNews)[number]



