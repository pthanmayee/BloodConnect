import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { Home } from '@/pages/Home'
import { Auth } from '@/pages/Auth'
import { DonorDashboard } from '@/pages/DonorDashboard'
import { RequestDashboard } from '@/pages/RequestDashboard'
import { AdminDashboard } from '@/pages/AdminDashboard'

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected Routes */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request"
            element={
              <ProtectedRoute allowedRoles={['requester', 'hospital']}>
                <RequestDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
