import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { FadeContent } from '@appletosolutions/reactbits'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import EventsListPage from './pages/EventsListPage'
import EventDetailPage from './pages/EventDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import NewsListPage from './pages/NewsListPage'
import NewsDetailPage from './pages/NewsDetailPage'
import ClubInfoPage from './pages/ClubInfoPage'
import GalleryPage from './pages/GalleryPage'
import ContactPage from './pages/ContactPage'
import AccountPage from './pages/AccountPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminRoute from './components/AdminRoute'
import EventsAdminPage from './pages/admin/EventsAdminPage'
import NewsAdminPage from './pages/admin/NewsAdminPage'
import MediaAdminPage from './pages/admin/MediaAdminPage'
import TicketingAdminPage from './pages/admin/TicketingAdminPage'
function App() {
  const location = useLocation()

  return (
    <Layout>
      <FadeContent key={location.pathname} duration={600} blur>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/news" element={<NewsListPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/club" element={<ClubInfoPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <AdminRoute>
                <EventsAdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/news"
            element={
              <AdminRoute>
                <NewsAdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/media"
            element={
              <AdminRoute>
                <MediaAdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <TicketingAdminPage />
              </AdminRoute>
            }
          />
          <Route path="/AdminDashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/EventsAdminPage" element={<Navigate to="/admin/events" replace />} />
          <Route path="/NewsAdminPage" element={<Navigate to="/admin/news" replace />} />
          <Route path="/MediaAdminPage" element={<Navigate to="/admin/media" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </FadeContent>
    </Layout>
  )
}

export default App

