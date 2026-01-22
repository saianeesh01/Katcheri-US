import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Overview', to: '/admin' },
  { label: 'Events', to: '/admin/events' },
  { label: 'News', to: '/admin/news' },
  { label: 'Media', to: '/admin/media' },
  { label: 'Ticketing', to: '/admin/orders' },
]

export default function AdminNav() {
  return (
    <nav className="mb-6">
      <div className="flex flex-wrap gap-4 text-sm font-semibold">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                'transition underline-offset-4',
                isActive
                  ? 'text-white underline'
                  : 'text-white/80 hover:text-white hover:underline',
              ].join(' ')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}


