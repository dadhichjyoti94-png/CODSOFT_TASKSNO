import axios from 'axios'
import iziToast from 'izitoast'
import React, { useEffect, useRef, useState } from 'react'
import { FaCamera, FaEnvelope, FaPhoneAlt, FaSave, FaUserAlt } from 'react-icons/fa'

const emptyProfile = { name: '', email: '', mobile_number: '', gender: '', address: '' }

const firstValue = (source, keys) => keys.map((key) => source?.[key]).find((value) => value !== undefined && value !== null) || ''

export default function MyProfile() {
  const [profile, setProfile] = useState(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const imageInputRef = useRef(null)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`)
      .then(({ data }) => {
        const user = data?._data || data?.data || data?.admin || data?.user || {}
        setProfile({
          name: firstValue(user, ['name', 'full_name']),
          email: firstValue(user, ['email']),
          mobile_number: firstValue(user, ['mobile_number', 'mobile', 'phone']),
          gender: firstValue(user, ['gender', 'Gender']),
          address: firstValue(user, ['address', 'Address'])
        })
        setImagePreview(firstValue(user, ['image_url', 'profile_image_url', 'avatar_url', 'image', 'profile_image', 'avatar']))
      })
      .catch(() => iziToast.error({ message: 'Profile load nahi ho payi.' }))
      .finally(() => setLoading(false))
  }, [])

  const updateField = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }))

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      iziToast.error({ message: 'Please select a valid image file.' })
      event.target.value = ''
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const submitHandler = (event) => {
    event.preventDefault()
    if (!profile.name.trim() || !profile.email.trim()) {
      iziToast.error({ message: 'Name aur email required hain.' })
      return
    }
    setSaving(true)
    const formData = new FormData()
    Object.entries(profile).forEach(([key, value]) => formData.append(key, value || ''))
    if (imageFile) formData.append('image', imageFile)

    axios.put(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, formData)
      .then(({ data }) => data?._status ? iziToast.success({ message: data._message || 'Profile updated successfully.' }) : iziToast.error({ message: data?._message || 'Profile update nahi ho payi.' }))
      .catch((error) => iziToast.error({ message: error.response?.data?._message || 'Profile update nahi ho payi.' }))
      .finally(() => setSaving(false))
  }

  const initials = profile.name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'A'

  return (
    <section className="mx-auto w-full max-w-6xl">
      <header className="mb-7 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-bold text-slate-950">My Profile</h1>
        <p className="mt-2 text-lg text-slate-500">Apni personal account details manage karein.</p>
      </header>
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/70">
        <div className="h-32 bg-gradient-to-r from-violet-700 via-indigo-600 to-sky-500" />
        <div className="px-5 pb-8 sm:px-8">
          <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <button type="button" onClick={() => imageInputRef.current?.click()} aria-label="Change profile photo" className="relative grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-slate-900 text-3xl font-bold text-white shadow-lg group">
                {imagePreview ? <img src={imagePreview} alt="Profile preview" className="h-full w-full object-cover" /> : initials}
                <span className="absolute inset-0 grid place-items-center bg-slate-950/55 text-2xl opacity-0 transition-opacity group-hover:opacity-100"><FaCamera /></span>
              </button>
              <div className="pb-1"><h2 className="text-2xl font-bold text-slate-900">{profile.name || 'Admin'}</h2><p className="text-slate-500">Administrator</p></div>
            </div>
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <button type="button" onClick={() => imageInputRef.current?.click()} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"><FaCamera /> Change photo</button>
          </div>
          <form onSubmit={submitHandler} className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Full name" name="name" value={profile.name} onChange={updateField} icon={FaUserAlt} required />
            <Field label="Email address" name="email" type="email" value={profile.email} onChange={updateField} icon={FaEnvelope} required />
            <Field label="Mobile number" name="mobile_number" value={profile.mobile_number} onChange={updateField} icon={FaPhoneAlt} />
            <label className="block text-sm font-bold text-slate-700">Gender<select name="gender" value={profile.gender} onChange={updateField} className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></label>
            <label className="block text-sm font-bold text-slate-700 md:col-span-2">Address<textarea name="address" value={profile.address} onChange={updateField} rows="4" placeholder="Enter your address" className="mt-2 block w-full resize-none rounded-lg border border-slate-300 px-3 py-3 font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
            <div className="flex justify-end md:col-span-2"><button disabled={loading || saving} type="submit" className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"><FaSave /> {saving ? 'Saving...' : 'Save changes'}</button></div>
          </form>
        </div>
      </div>
    </section>
  )
}

function Field({ label, icon: Icon, ...props }) { return <label className="block text-sm font-bold text-slate-700">{label}<div className="relative mt-2">{React.createElement(Icon, { className: 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' })}<input {...props} className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div></label> }
