import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Navigate, Outlet } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import { clearAdminSession, getAdminToken, isAdminAuthResponse } from '../../../utils/adminAuth'

export default function CommonLayout() {
  const [authStatus, setAuthStatus] = useState('checking')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!getAdminToken() && localStorage.getItem('admin_auth_status') !== 'true') {
      setAuthStatus('unauthorized')
      return
    }

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`)
      .then((result) => {
        setAuthStatus(result.data._status && isAdminAuthResponse(result.data) ? 'authorized' : 'unauthorized')
      })
      .catch(() => {
        clearAdminSession()
        setAuthStatus('unauthorized')
      })
  }, [])

  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-semibold">
        Loading...
      </div>
    )
  }

  if (authStatus === 'unauthorized') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-950 lg:flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="min-h-screen w-full overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Open menu"
          className="mb-4 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars /> Menu
        </button>
        <Outlet />
      </main>
    </div>
  )
}
