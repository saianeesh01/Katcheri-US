import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { register } from '../store/slices/authSlice'
import Input from '../components/Input'
import Button from '../components/Button'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [error, setError] = useState<string | null>(null)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)
    try {
      await dispatch(register(data)).unwrap()
      navigate('/account')
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-4xl font-heading font-semibold mb-8 text-center">Sign Up</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <Input
          label="Email"
          type="email"
          {...registerField('email')}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          {...registerField('password')}
          error={errors.password?.message}
        />
        <Input
          label="First Name (optional)"
          {...registerField('first_name')}
          error={errors.first_name?.message}
        />
        <Input
          label="Last Name (optional)"
          {...registerField('last_name')}
          error={errors.last_name?.message}
        />
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}

