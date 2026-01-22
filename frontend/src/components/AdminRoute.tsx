import { ReactNode } from 'react'

interface AdminRouteProps {
  children: ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  return <>{children}</>
}


