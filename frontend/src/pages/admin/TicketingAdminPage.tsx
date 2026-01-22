import { useMemo, useState } from 'react'
import { FadeContent, SpotlightCard, StarBorder } from '@appletosolutions/reactbits'
import { mockOrders, MockOrder } from '../../data/mockOrders'
import api from '../../lib/api'
import AdminNav from '../../components/AdminNav'

type FilterStatus = 'all' | 'pending' | 'paid' | 'checked_in' | 'refunded'

const statusLabels: Record<FilterStatus, string> = {
  all: 'All',
  pending: 'Pending',
  paid: 'Paid',
  checked_in: 'Checked In',
  refunded: 'Refunded',
}

const statusBadgeClass: Record<FilterStatus, string> = {
  all: '',
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  checked_in: 'bg-blue-100 text-blue-700',
  refunded: 'bg-gray-200 text-gray-700',
}

export default function TicketingAdminPage() {
  const [orders, setOrders] = useState<MockOrder[]>(mockOrders)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus
      const matchesSearch =
        searchTerm.trim() === '' ||
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [orders, filterStatus, searchTerm])

  const updateOrderStatus = async (id: number, status: MockOrder['status']) => {
    setStatusMessage(null)
    try {
      await api.patch(`/admin/orders/${id}`, { status })
      setStatusMessage(`Order status updated via API.`)
    } catch (error) {
      console.warn('[admin] Updating order locally until API is ready', error)
      setStatusMessage('Order status updated locally. Connect the API to persist.')
    } finally {
      setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))
    }
  }

  const exportCsv = () => {
    setIsExporting(true)
    const header = ['Order Number', 'Customer', 'Email', 'Status', 'Total', 'Placed At', 'Items']
    const rows = filteredOrders.map((order) => [
      order.order_number,
      order.customer.name,
      order.customer.email,
      order.status,
      order.total.toFixed(2),
      new Date(order.placed_at).toLocaleString(),
      order.items
        .map((item) => `${item.quantity}x ${item.event_title} (${item.ticket_type})`)
        .join('; '),
    ])
    const csv = [header, ...rows].map((row) => row.map((value) => `"${value}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'katcheri-orders.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setIsExporting(false)
  }

  const resendReceipt = async (id: number) => {
    setStatusMessage(null)
    try {
      await api.post(`/admin/orders/${id}/resend`)
      setStatusMessage('Receipt email sent via API.')
    } catch (error) {
      console.warn('[admin] Resending receipt locally until API is ready', error)
      setStatusMessage('Receipt flagged for resend. Connect the API to send emails.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <AdminNav />
      <FadeContent duration={600}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-white">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-white">Ticketing Ops</h1>
            <p className="text-sm max-w-2xl text-white/85">
              Monitor orders, check attendees in, and coordinate night-of logistics. Data will sync
              with the API once endpoints are connected.
            </p>
          </div>
          <StarBorder
            as="button"
            color="rgba(107,70,193,0.6)"
            speed="2.4s"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary-dark disabled:opacity-60"
            onClick={exportCsv}
            disabled={isExporting || filteredOrders.length === 0}
          >
            {isExporting ? 'Exporting…' : 'Export CSV'}
          </StarBorder>
        </div>
      </FadeContent>

      {statusMessage && (
        <FadeContent duration={500}>
          <div className="rounded-2xl border border-white/40 bg-white/10 px-4 py-3 text-sm text-white shadow-sm shadow-primary/20">
            {statusMessage}
          </div>
        </FadeContent>
      )}

      <SpotlightCard className="rounded-3xl border border-white/30 bg-white p-8 shadow-xl shadow-primary/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-primary">
            {(Object.keys(statusLabels) as FilterStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                className={`rounded-full px-3 py-1 ${
                  filterStatus === status
                    ? 'bg-primary text-white'
                    : 'border border-primary/30 text-primary hover:bg-primary/10'
                }`}
                onClick={() => setFilterStatus(status)}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="Search orders or customers"
            className="w-full max-w-xs rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No orders match this filter.</div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-primary/10 bg-primary/5 px-5 py-6 shadow-sm shadow-primary/10 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-lg font-heading font-semibold text-primary">
                      Order {order.order_number}
                    </h2>
                    <p className="text-xs text-primary/70">
                      {order.customer.name} • {order.customer.email}
                    </p>
                    <p className="text-xs text-primary/60 mt-1">
                      Placed {new Date(order.placed_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right md:text-left">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        statusBadgeClass[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                    <p className="mt-2 text-xl font-heading font-semibold text-primary">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-primary">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-1 rounded-2xl bg-white/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-primary">{item.event_title}</p>
                        <p className="text-xs text-primary/70">{item.ticket_type}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{item.quantity} tickets</span>
                        <span>${(item.quantity * item.unit_price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <p className="mt-3 rounded-2xl bg-white/75 px-4 py-3 text-xs text-primary/80">
                    <strong>Note:</strong> {order.notes}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-primary">
                  {order.status !== 'paid' && order.status !== 'checked_in' && (
                    <button
                      type="button"
                      className="rounded-full border border-primary/40 px-4 py-1 hover:bg-primary/10"
                      onClick={() => updateOrderStatus(order.id, 'paid')}
                    >
                      Mark Paid
                    </button>
                  )}
                  {order.status === 'paid' && (
                    <button
                      type="button"
                      className="rounded-full border border-primary/40 px-4 py-1 hover:bg-primary/10"
                      onClick={() => updateOrderStatus(order.id, 'checked_in')}
                    >
                      Check In
                    </button>
                  )}
                  {order.status !== 'refunded' && (
                    <button
                      type="button"
                      className="rounded-full border border-red-200 px-4 py-1 text-red-500 hover:bg-red-50"
                      onClick={() => updateOrderStatus(order.id, 'refunded')}
                    >
                      Refund
                    </button>
                  )}
                  <button
                    type="button"
                    className="rounded-full border border-primary/40 px-4 py-1 hover:bg-primary/10"
                    onClick={() => resendReceipt(order.id)}
                  >
                    Resend Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SpotlightCard>
    </div>
  )
}

