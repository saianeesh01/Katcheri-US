import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

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
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden"
    >
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        {post.published_at && (
          <p className="text-sm text-gray-500 mb-2">
            {format(new Date(post.published_at), 'MMMM d, yyyy')}
          </p>
        )}
        <h3 className="text-xl font-heading font-semibold mb-2">
          <Link to={`/news/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        <Link
          to={`/news/${post.slug}`}
          className="text-primary hover:underline font-medium"
        >
          Read More →
        </Link>
      </div>
    </motion.div>
  )
}

