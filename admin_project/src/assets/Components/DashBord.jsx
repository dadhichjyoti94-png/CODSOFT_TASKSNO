import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import iziToast from 'izitoast'
import { clearAdminSession } from '../../utils/adminAuth'
import { FaCartShopping, FaLayerGroup, FaUsers } from 'react-icons/fa6'
import { FaBuilding, FaDoorOpen, FaUserAlt } from 'react-icons/fa'
import { LuPackage2 } from 'react-icons/lu'

const stats = [
  {
    key: 'users',
    label: 'Users',
    icon: FaUsers,
    to: '/user/view',
    className: 'from-violet-700 to-indigo-600'
  },
  {
    key: 'products',
    label: 'Products',
    icon: LuPackage2,
    to: '/Products/ViewProducts',
    className: 'from-blue-600 to-sky-500'
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: FaLayerGroup,
    to: '/Category/View-Category',
    className: 'from-amber-500 to-yellow-400'
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: FaCartShopping,
    to: '/Order',
    className: 'from-rose-600 to-red-500'
  }
]

const getRecordCount = (data) => {
  const paginate = data?._paginate || {}
  const total =
    paginate.total_records ??
    paginate.total_record ??
    paginate.total_count ??
    paginate.total ??
    data?.total_records ??
    data?.total_count ??
    data?.total

  if (total !== undefined && total !== null) {
    return Number(total) || 0
  }

  return Array.isArray(data?._data) ? data._data.length : 0
}

export default function DashBoard() {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({
    users: 0,
    products: 0,
    categories: 0,
    orders: 0
  })
  const [loadingCounts, setLoadingCounts] = useState(true)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    const requests = {
      users: axios.post(`${apiBaseUrl}/user/view`, { page: 1, limit: 0 }),
      products: axios.post(`${apiBaseUrl}/product/view`, { page: 1, limit: 0 }),
      categories: axios.post(`${apiBaseUrl}/category/view`, { page: 1, limit: 0 }),
      orders: axios.post(`${apiBaseUrl}/order/view`, { search: '' })
    }

    Promise.allSettled(Object.values(requests))
      .then((results) => {
        const nextCounts = {}

        Object.keys(requests).forEach((key, index) => {
          const result = results[index]
          nextCounts[key] = result.status === 'fulfilled' ? getRecordCount(result.value.data) : 0
        })

        setCounts(nextCounts)
      })
      .finally(() => {
        setLoadingCounts(false)
      })
  }, [])

  const logoutHandler = () => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`)
      .catch(() => {})
      .finally(() => {
        clearAdminSession()
        iziToast.success({ message: 'Admin logout successfully' })
        navigate('/')
      })
  }

  return (
    <section className="mx-auto w-full max-w-[1440px]">
      <header className="mb-7 border-b border-slate-200 bg-white/70 px-1 pb-7 sm:px-0">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-normal text-slate-950">Dashboard</h1>
            <nav className="mt-2 text-lg font-medium text-slate-500">
              Home <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-700">Dashboard</span>
            </nav>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-full border border-white bg-white px-3 py-2 shadow-lg shadow-slate-200/80 transition hover:shadow-xl"
            >
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff"
                alt="Admin"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
              />
              <div className="hidden pr-2 text-left sm:block">
                <p className="text-sm font-bold text-slate-900">Admin</p>
                <p className="text-xs font-medium text-slate-500">Online</p>
              </div>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-16 z-20 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-300/80">
                <div className="border-b border-slate-200 px-5 py-4">
                  <p className="font-bold text-slate-800">Admin</p>
                  <p className="text-sm text-slate-500">Online</p>
                </div>

                <Link
                  to="/my-profile"
                  className="flex items-center gap-4 border-b border-slate-200 px-5 py-4 text-slate-800 transition hover:bg-slate-50"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <FaUserAlt className="text-slate-600" />
                  <span className="text-lg font-medium">My Profile</span>
                </Link>

                <Link
                  to="/my-company"
                  className="flex items-center gap-4 border-b border-slate-200 px-5 py-4 text-slate-800 transition hover:bg-slate-50"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <FaBuilding className="text-slate-600" />
                  <span className="text-lg font-medium">My Company</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false)
                    logoutHandler()
                  }}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left text-red-600 transition hover:bg-red-50"
                >
                  <FaDoorOpen />
                  <span className="text-lg font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ key, label, icon: Icon, to, className }) => (
          <Link
            key={label}
            to={to}
            className={`flex h-44 items-center justify-between rounded-xl bg-gradient-to-br ${className} p-7 text-white shadow-xl shadow-slate-300/70 transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200`}
          >
            <div>
              <p className="text-5xl font-bold leading-none">{loadingCounts ? '...' : counts[key]}</p>
              <p className="mt-7 text-2xl font-medium">{label}</p>
            </div>
            <Icon className="text-5xl opacity-95" />
          </Link>
        ))}
      </div>
    </section>
  )
}
