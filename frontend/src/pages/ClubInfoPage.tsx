import { useEffect, useState } from 'react'
import api from '../lib/api'

interface ClubInfo {
  name?: string
  mission?: string
  about?: string
  email?: string
  phone?: string
  address?: string
  instagram_url?: string
  tiktok_url?: string
  banner_image_url?: string
}

export default function ClubInfoPage() {
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .get('/club')
      .then((response) => {
        setClubInfo(response.data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {clubInfo?.banner_image_url && (
        <img
          src={clubInfo.banner_image_url}
          alt="Club Banner"
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-semibold mb-4">
          {clubInfo?.name || 'Katcheri Club'}
        </h1>

        {clubInfo?.mission && (
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg">{clubInfo.mission}</p>
          </section>
        )}

        {clubInfo?.about && (
          <section className="mb-8">
            <h2 className="text-2xl font-heading font-semibold mb-4">About Us</h2>
            <p className="text-gray-700 whitespace-pre-line">{clubInfo.about}</p>
          </section>
        )}

        <section className="card">
          <h2 className="text-2xl font-heading font-semibold mb-4">Contact Information</h2>
          <div className="space-y-2 text-gray-700">
            {clubInfo?.email && (
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${clubInfo.email}`} className="text-primary hover:underline">
                  {clubInfo.email}
                </a>
              </p>
            )}
            {clubInfo?.phone && (
              <p>
                <strong>Phone:</strong>{' '}
                <a href={`tel:${clubInfo.phone}`} className="text-primary hover:underline">
                  {clubInfo.phone}
                </a>
              </p>
            )}
            {clubInfo?.address && (
              <p>
                <strong>Address:</strong> {clubInfo.address}
              </p>
            )}
          </div>

          <div className="mt-6 flex space-x-4">
            {clubInfo?.instagram_url && (
              <a
                href={clubInfo.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Follow us on Instagram
              </a>
            )}
            {clubInfo?.tiktok_url && (
              <a
                href={clubInfo.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Follow us on TikTok
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

