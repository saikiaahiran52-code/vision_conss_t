import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/Layout/AppLayout'
import Login from './features/auth/Login'
import SignUp from './features/auth/SignUp'
import Dashboard from './features/dashboard/Dashboard'
import NewProject from './features/projects/NewProject'
import SavedProjects from './features/projects/SavedProjects'
import ProjectResult from './features/projects/ProjectResult'
import Profile from './features/profile/Profile'

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes inside AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/new" element={<NewProject />} />
        <Route path="/projects/saved" element={<SavedProjects />} />
        <Route path="/projects/:id" element={<ProjectResult />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
