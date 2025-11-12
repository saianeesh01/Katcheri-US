import { Link } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { logout } from '../store/slices/authSlice'
import { fetchCart } from '../store/slices/cartSlice'
import { useEffect } from 'react'

export default function Header() {
  const { user } = useAppSelector((state) => state.auth)
  const { cart } = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="bg-gradient-to-r from-primary to-accent text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-heading font-semibold">
            Katcheri Events
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/events" className="hover:underline">Events</Link>
            <Link to="/news" className="hover:underline">News</Link>
            <Link to="/club" className="hover:underline">Club</Link>
            <Link to="/gallery" className="hover:underline">Gallery</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:underline">Admin</Link>
                )}
                <Link to="/account" className="hover:underline">
                  {user.first_name || user.email}
                </Link>
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="btn-secondary bg-white text-primary hover:bg-gray-100">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

