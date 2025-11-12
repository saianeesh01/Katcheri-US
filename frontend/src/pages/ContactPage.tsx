import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../lib/api'
import Input from '../components/Input'
import Button from '../components/Button'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSuccess(false)

    try {
      await api.post('/contact', data)
      setSuccess(true)
      reset()
    } catch (error) {
      console.error('Failed to submit contact form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-heading font-semibold mb-8">Contact Us</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          Thank you for your message! We will get back to you soon.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <Input
          label="Name *"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Email *"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Subject"
          {...register('subject')}
          error={errors.subject?.message}
        />
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            className={`input ${errors.message ? 'border-red-500' : ''}`}
            rows={6}
            {...register('message')}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  )
}

