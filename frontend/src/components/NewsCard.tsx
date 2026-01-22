import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { SpotlightCard } from '@appletosolutions/reactbits'

interface NewsPost {
  id: number
  slug: string
  title: string
  excerpt?: string
  cover_image_url?: string
  published_at?: string
}

interface NewsCardProps {
  post: NewsPost
}

export default function NewsCard({ post }: NewsCardProps) {
  return (
    <SpotlightCard className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/30 bg-accent/80 p-0 shadow-lg shadow-primary/20 backdrop-blur-md transition">
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="flex flex-1 flex-col p-6 text-white">
        {post.published_at && (
          <p className="text-sm text-white/70 mb-2">
            {format(new Date(post.published_at), 'MMMM d, yyyy')}
          </p>
        )}
        <h3 className="text-xl font-heading font-semibold mb-2">
          <Link to={`/news/${post.slug}`} className="hover:text-white">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="text-white/80 mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        <Link
          to={`/news/${post.slug}`}
          className="mt-auto inline-flex items-center font-semibold text-white transition hover:text-white/80"
        >
          Read More →
        </Link>
      </div>
    </SpotlightCard>
  )
}

