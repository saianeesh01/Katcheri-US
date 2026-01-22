import { FormEvent, useMemo, useState } from 'react'
import { FadeContent, SpotlightCard, StarBorder } from '@appletosolutions/reactbits'
import { mockMedia, MockMediaItem } from '../../data/mockMedia'
import api from '../../lib/api'
import AdminNav from '../../components/AdminNav'

export default function MediaAdminPage() {
  const [mediaItems, setMediaItems] = useState<MockMediaItem[]>(mockMedia)
  const [filter, setFilter] = useState<string>('all')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    url: '',
    tags: '',
    featured: false,
  })

  const tags = useMemo(() => {
    const allTags = new Set<string>()
    mediaItems.forEach((item) => item.tags.forEach((tag) => allTags.add(tag)))
    return Array.from(allTags).sort()
  }, [mediaItems])

  const filteredMedia = useMemo(() => {
    if (filter === 'all') return mediaItems
    if (filter === 'featured') return mediaItems.filter((item) => item.featured)
    return mediaItems.filter((item) => item.tags.includes(filter))
  }, [mediaItems, filter])

  const resetForm = () => {
    setFormValues({
      title: '',
      description: '',
      url: '',
      tags: '',
      featured: false,
    })
  }

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setStatusMessage(null)

    if (!formValues.title.trim()) {
      setFormError('Title is required.')
      return
    }

    if (!formValues.url.trim()) {
      setFormError('Please provide an image URL for now.')
      return
    }

    setIsSaving(true)

    const newItem: MockMediaItem = {
      id: Date.now(),
      title: formValues.title.trim(),
      description: formValues.description.trim() || undefined,
      url: formValues.url.trim(),
      tags: formValues.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      featured: formValues.featured,
      uploaded_at: new Date().toISOString(),
    }

    try {
      await api.post('/admin/media', newItem)
      setStatusMessage('Media item uploaded via API.')
    } catch (error) {
      console.warn('[admin] Uploading media locally until API is ready', error)
      setStatusMessage('Media item saved locally. Connect the API to persist uploads.')
    } finally {
      setMediaItems((prev) => [newItem, ...prev])
      resetForm()
      setIsFormOpen(false)
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    setStatusMessage(null)
    try {
      await api.delete(`/admin/media/${id}`)
      setStatusMessage('Media item deleted via API.')
    } catch (error) {
      console.warn('[admin] Deleting media locally until API is ready', error)
      setStatusMessage('Media item removed locally. Connect the API to persist deletions.')
    } finally {
      setMediaItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleToggleFeatured = async (id: number, featured: boolean) => {
    try {
      await api.patch(`/admin/media/${id}`, { featured })
    } catch (error) {
      console.warn('[admin] Updating media locally until API is ready', error)
    } finally {
      setMediaItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, featured } : item))
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <AdminNav />
      <FadeContent duration={600}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-white">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-white">Media Library</h1>
            <p className="text-sm max-w-2xl text-white/85">
              Organise hero imagery, gallery assets, and branded visuals for upcoming events.
              Uploads are stored locally until the media API is connected.
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
            {isFormOpen ? 'Close Upload' : 'Add Media'}
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
          <SpotlightCard className="rounded-3xl border border-white/40 bg-white p-8 shadow-xl shadow-primary/10">
            <form className="space-y-6" onSubmit={handleCreate}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col text-sm font-medium text-gray-700">
                  Title
                  <input
                    type="text"
                    className="mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={formValues.title}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                    checked={formValues.featured}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, featured: e.target.checked }))
                    }
                  />
                  Mark as featured
                </label>
              </div>

              <label className="flex flex-col text-sm font-medium text-gray-700">
                Description
                <textarea
                  className="mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  rows={3}
                  value={formValues.description}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Optional. Helps on hover states and SEO."
                />
              </label>

              <label className="flex flex-col text-sm font-medium text-gray-700">
                Image URL
                <input
                  type="url"
                  className="mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={formValues.url}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  required
                />
                <span className="mt-1 text-xs text-gray-500">
                  Direct uploads coming soon. Use cloud storage URLs in the meantime.
                </span>
              </label>

              <label className="flex flex-col text-sm font-medium text-gray-700">
                Tags
                <input
                  type="text"
                  className="mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={formValues.tags}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="events, music, community"
                />
              </label>

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
                  {isSaving ? 'Saving...' : 'Save Media'}
                </button>
              </div>
            </form>
          </SpotlightCard>
        </FadeContent>
      )}

      <SpotlightCard className="rounded-3xl border border-white/30 bg-white p-8 shadow-xl shadow-primary/10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-heading font-semibold text-primary">Media Archive</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              className={`rounded-full px-3 py-1 ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'border border-primary/30 text-primary hover:bg-primary/10'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`rounded-full px-3 py-1 ${
                filter === 'featured'
                  ? 'bg-primary text-white'
                  : 'border border-primary/30 text-primary hover:bg-primary/10'
              }`}
              onClick={() => setFilter('featured')}
            >
              Featured
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`rounded-full px-3 py-1 capitalize ${
                  filter === tag
                    ? 'bg-primary text-white'
                    : 'border border-primary/30 text-primary hover:bg-primary/10'
                }`}
                onClick={() => setFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {filteredMedia.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No media found for this filter.</div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 shadow-sm shadow-primary/10 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {item.featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary">
                      Featured
                    </span>
                  )}
                </div>
                <div className="space-y-3 p-5">
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-primary">{item.title}</h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-primary/80 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-primary">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-2 py-1 capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-primary/70">
                    <span>{new Date(item.uploaded_at).toLocaleDateString()}</span>
                    <div className="flex gap-3 font-semibold">
                      <button
                        type="button"
                        className="hover:underline"
                        onClick={() => handleToggleFeatured(item.id, !item.featured)}
                      >
                        {item.featured ? 'Remove Featured' : 'Set Featured'}
                      </button>
                      <button
                        type="button"
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SpotlightCard>
    </div>
  )
}

