import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector'
import { fetchNews } from '../store/slices/newsSlice'
import NewsCard from '../components/NewsCard'

export default function NewsListPage() {
  const dispatch = useAppDispatch()
  const { posts, isLoading, pagination } = useAppSelector((state) => state.news)

  useEffect(() => {
    dispatch(fetchNews({ page: 1 }))
  }, [dispatch])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-semibold mb-8">News & Updates</h1>

      {isLoading ? (
        <div className="text-center py-12">Loading news...</div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => dispatch(fetchNews({ page }))}
                  className={`px-4 py-2 rounded ${
                    pagination.page === page
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">No news posts available.</div>
      )}
    </div>
  )
}

