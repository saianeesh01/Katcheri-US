import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector'
import { fetchNewsBySlug } from '../store/slices/newsSlice'

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useAppDispatch()
  const { currentPost, isLoading } = useAppSelector((state) => state.news)

  useEffect(() => {
    if (slug) {
      dispatch(fetchNewsBySlug(slug))
    }
  }, [dispatch, slug])

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
  }

  if (!currentPost) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Post not found.</p>
        <Link to="/news" className="text-primary hover:underline mt-4 inline-block">
          ← Back to News
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/news" className="text-primary hover:underline mb-4 inline-block">
        ← Back to News
      </Link>

      {currentPost.cover_image_url && (
        <img
          src={currentPost.cover_image_url}
          alt={currentPost.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}

      <article>
        {currentPost.published_at && (
          <p className="text-gray-500 mb-4">
            {format(new Date(currentPost.published_at), 'MMMM d, yyyy')}
          </p>
        )}
        <h1 className="text-4xl font-heading font-semibold mb-4">{currentPost.title}</h1>
        {currentPost.excerpt && (
          <p className="text-xl text-gray-600 mb-8">{currentPost.excerpt}</p>
        )}
        {currentPost.content && (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{currentPost.content}</p>
          </div>
        )}
      </article>
    </div>
  )
}

