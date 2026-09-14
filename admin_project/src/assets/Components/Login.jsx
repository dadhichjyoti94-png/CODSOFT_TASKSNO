import axios from 'axios'
import iziToast from 'izitoast'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAdminSession, isAdminAuthResponse, saveAdminSession } from '../../utils/adminAuth'

export default function Login() {
    const navigate = useNavigate()
    const [loginProcessing, setLoginProcessing] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('admin_auth_status') !== 'true') return

        axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`)
            .then((result) => {
                if (result.data._status && isAdminAuthResponse(result.data)) {
                    navigate('/dashboard')
                }
            })
            .catch(() => {
                clearAdminSession()
            })
    }, [navigate])

    const loginHandler = (event) => {
        event.preventDefault()
        setLoginProcessing(true)

        const formData = new FormData(event.target)
        const email = formData.get('email')?.trim()
        const password = formData.get('password')?.trim()

        if (!email) {
            iziToast.error({ message: 'Email is required' })
            setLoginProcessing(false)
            return
        }

        if (!password) {
            iziToast.error({ message: 'Password is required' })
            setLoginProcessing(false)
            return
        }

        axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, event.target)
            .then((result) => {
                if (result.data._status && result.data._token && isAdminAuthResponse(result.data)) {
                    saveAdminSession(result.data._token)
                    iziToast.success({ message: result.data._message })
                    navigate('/dashboard')
                } else if (result.data._status) {
                    clearAdminSession()
                    iziToast.error({ message: 'Only admin users can access admin panel' })
                } else {
                    clearAdminSession()
                    iziToast.error({ message: result.data._message })
                }
            })
            .catch((error) => {
                iziToast.error({ message: error.response?.data?._message || 'Something went wrong' })
            })
            .finally(() => {
                setLoginProcessing(false)
            })
    }

    return (
        <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex min-h-screen items-center justify-center px-6 py-8">
                <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={loginHandler}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="Password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-500">Forgot password?</a>
                            </div>
                            <button disabled={loginProcessing} type="submit" className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 disabled:opacity-60">
                                {loginProcessing ? 'Loading...' : 'Sign in'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
