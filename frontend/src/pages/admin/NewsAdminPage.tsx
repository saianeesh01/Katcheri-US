import { FormEvent, useMemo, useState } from 'react'
import { FadeContent, SpotlightCard, StarBorder } from '@appletosolutions/reactbits'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { addNewsLocal, fetchNews, NewsPost, updateNewsLocal } from '../../store/slices/newsSlice'
import { useEffect } from 'react'
import api from '../../lib/api'
import { Link } from 'react-router-dom'
import AdminNav from '../../components/AdminNav'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default function NewsAdminPage() {
  const dispatch = useAppDispatch()
  const { posts, isLoading } = useAppSelector((state) => state.news)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    publishDate: '',
    status: 'draft',
  })

  useEffect(() => {
    dispatch(fetchNews({ page: 1 }))
  }, [dispatch])

  const sortedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
        return dateB - dateA
      }),
    [posts]
  )

  const resetForm = () => {
    setFormValues({
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      publishDate: '',
      status: 'draft',
    })
  }

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setStatusMessage(null)

    if (!formValues.title) {
      setFormError('Title is required.')
      return
    }
    if (!formValues.content) {
      setFormError('Content is required.')
      return
    }

    setIsSaving(true)

    const publishedAt =
      formValues.publishDate !== ''
        ? new Date(`${formValues.publishDate}T12:00:00`).toISOString()
        : new Date().toISOString()

    const newPost: NewsPost = {
      id: Date.now(),
      slug: slugify(formValues.title) || `post-${Date.now()}`,
      title: formValues.title,
      excerpt: formValues.excerpt || formValues.content.slice(0, 180),
      content: formValues.content,
      cover_image_url: formValues.coverImage || undefined,
      published_at: formValues.status === 'published' ? publishedAt : undefined,
      status: formValues.status,
      author: {
        id: 0,
        email: 'admin@katcheri.com',
        first_name: 'Admin',
        last_name: 'Team',
      },
    }

    try {
      await api.post('/admin/news', newPost)
      setStatusMessage('News post created via API.')
    } catch (error) {
      console.warn('[admin] Creating news post locally until API is ready', error)
      setStatusMessage('News post saved locally. Connect the API to persist.')
    } finally {
      dispatch(addNewsLocal(newPost))
      resetForm()
      setIsFormOpen(false)
      setIsSaving(false)
    }
  }

  const handleStatusToggle = async (postId: number, nextStatus: string) => {
    try {
      await api.patch(`/admin/news/${postId}`, { status: nextStatus })
    } catch (error) {
      console.warn('[admin] Falling back to local news status update', error)
    } finally {
      dispatch(
        updateNewsLocal({
          id: postId,
          changes: {
            status: nextStatus,
            published_at: nextStatus === 'published' ? new Date().toISOString() : undefined,
          },
        })
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <AdminNav />
      <FadeContent duration={600}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-white">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-white">Editorial Studio</h1>
            <p className="text-sm max-w-2xl text-white/85">
              Publish recaps, spotlights, and announcements that keep the community in the loop.
            </p>
          </div>
          <StarBorder
            as="button"
            color="rgba(167,139,250,0.6)"
            speed="2.4s"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary-dark"
            onClick={() => {
              setIsFormOpen((prev) => !prev)
              setFormError(null)
              setStatusMessage(null)
            }}
          >
            {isFormOpen ? 'Close Composer' : 'Draft Story'}
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
                <label className="flex flex-col text-sm font-medium text-gray-700">
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

              <label className="flex flex-col text-sm font-medium text-gray-700">
                Excerpt
                <textarea
                  className="mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  rows={3}
                  value={formValues.excerpt}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Short teaser shown on cards"
                />
              </label>

              <label className="flex flex-col text-sm font-medium text-gray-700">
                Content
                <textarea
                  className="mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  rows={8}
                  value={formValues.content}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, content: e.target.value }))}
                  required
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col text-sm font-medium text-gray-700">
                  Cover Image URL
                  <input
                    type="url"
                    className="mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={formValues.coverImage}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, coverImage: e.target.value }))}
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-gray-700">
                  Publish Date
                  <input
                    type="date"
                    className="mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={formValues.publishDate}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, publishDate: e.target.value }))}
                    disabled={formValues.status !== 'published'}
                  />
                  <span className="mt-1 text-xs text-gray-500">
                    If left blank, the publish time will default to now.
                  </span>
                </label>
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
                  {isSaving ? 'Publishing...' : 'Save Story'}
                </button>
              </div>
            </form>
          </SpotlightCard>
        </FadeContent>
      )}

      <SpotlightCard className="rounded-3xl border border-white/30 bg-white p-8 shadow-xl shadow-primary/10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-heading font-semibold text-primary">Editorial Queue</h2>
          <Link to="/news" className="text-primary font-medium hover:underline text-sm">
            View public blog →
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-500">Loading posts...</div>
        ) : sortedPosts.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No posts yet. Draft your first story.</div>
        ) : (
          <div className="mt-6 space-y-4">
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4 shadow-sm shadow-primary/10"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-primary">{post.title}</h3>
                    {post.published_at && (
                      <p className="text-xs uppercase tracking-wide text-primary/60 mt-1">
                        {new Date(post.published_at).toLocaleDateString()}
                      </p>
                    )}
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-primary/80 line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="text-right md:text-left">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {post.status || 'draft'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                  {post.status !== 'published' ? (
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => handleStatusToggle(post.id, 'published')}
                    >
                      Publish
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-primary/70 hover:underline"
                      onClick={() => handleStatusToggle(post.id, 'draft')}
                    >
                      Move to Draft
                    </button>
                  )}
                  <Link to={`/news/${post.slug}`} className="text-primary/70 hover:underline">
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </SpotlightCard>
    </div>
  )
}
