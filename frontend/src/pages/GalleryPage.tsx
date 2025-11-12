import { useEffect, useState } from 'react'
import api from '../lib/api'

interface MediaAsset {
  id: number
  title?: string
  description?: string
  url: string
  alt_text?: string
  type: string
}

export default function GalleryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    api
      .get('/media/gallery')
      .then((response) => {
        setAssets(response.data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading gallery...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-semibold mb-8">Gallery</h1>

      {assets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="relative cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelectedImage(asset.url)}
            >
              <img
                src={asset.url}
                alt={asset.alt_text || asset.title || 'Gallery image'}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
              {asset.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  {asset.title}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No images in gallery yet.</div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

