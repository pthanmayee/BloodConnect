import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#C62828] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#737373] uppercase tracking-wider">
            Authenticating Session...
          </span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Check role authorization
  if (role && !allowedRoles.includes(role) && role !== 'admin') {
    // Redirect non-admin users to their assigned role path
    if (role === 'donor') return <Navigate to="/donor" replace />
    if (role === 'requester' || role === 'hospital') return <Navigate to="/request" replace />
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
