import React, { useState } from 'react'
import axios from 'axios'
import iziToast from 'izitoast'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AiFillPieChart } from 'react-icons/ai'
import { FaBoxOpen, FaBuilding, FaCommentAlt, FaQuestionCircle, FaUserAlt } from 'react-icons/fa'
import { FaBagShopping, FaChevronDown, FaChevronRight, FaDoorOpen, FaRegNoteSticky } from 'react-icons/fa6'
import { FiSliders } from 'react-icons/fi'
import { GiMaterialsScience } from 'react-icons/gi'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { LuPackage2 } from 'react-icons/lu'
import { MdOutlineInvertColors } from 'react-icons/md'
import { PiTelegramLogoFill } from 'react-icons/pi'
import { clearAdminSession } from '../../../utils/adminAuth'

const menuGroups = [
  {
    name: 'Users',
    icon: FaUserAlt,
    links: [{ label: 'View Users', to: '/user/view' }]
  },
  {
    name: 'Enquiry',
    icon: FaCommentAlt,
    links: [
      { label: 'Contact Enquiry', to: '/enquiry/content-enquiry' },
      { label: 'News Letter', to: '/enquiry/news-letter' }
    ]
  },
  {
    name: 'Color',
    icon: MdOutlineInvertColors,
    links: [
      { label: 'View Color', to: '/Colour/View-Colour' },
      { label: 'Add Color', to: '/Colour/Add-Colour' }
    ]
  },
  {
    name: 'Material',
    icon: GiMaterialsScience,
    links: [
      { label: 'View Material', to: '/Material/View-Material' },
      { label: 'Add Material', to: '/Material/Add-Material' }
    ]
  },
  {
    name: 'Category',
    icon: IoReorderThreeOutline,
    links: [
      { label: 'View Category', to: '/Category/View-Category' },
      { label: 'Add Category', to: '/Category/Add-Category' }
    ]
  },
  {
    name: 'Sub Category',
    icon: IoReorderThreeOutline,
    links: [
      { label: 'Add Sub Category', to: '/SubCategory/Add-SubCategory' },
      { label: 'View Sub Category', to: '/SubCategory/View-SubCategory' }
    ]
  },
  {
    name: 'Sub Sub Category',
    icon: IoReorderThreeOutline,
    links: [
      { label: 'Add Sub Sub Category', to: '/SubSubCategory/Add-Sub-Sub-Category' },
      { label: 'View Sub Sub Category', to: '/SubSubCategory/View-Sub-Sub-Category' }
    ]
  },
  {
    name: 'Products',
    icon: FaBagShopping,
    links: [
      { label: 'Add Products', to: '/Products/AddProducts' },
      { label: 'View Products', to: '/Products/ViewProducts' }
    ]
  },
  {
    name: 'Why Choose Us',
    icon: FaBoxOpen,
    links: [
      { label: 'Add Why Choose Us', to: '/WhyChooseUs/AddChoose-us' },
      { label: 'View Why Choose Us', to: '/WhyChooseUs/ViewChoose-us' }
    ]
  },
  {
    name: 'Order',
    icon: LuPackage2,
    links: [{ label: 'Order List', to: '/Order' }]
  },
  {
    name: 'Slider',
    icon: FiSliders,
    links: [
      { label: 'Add Slider', to: '/Slider/Add-Slider' },
      { label: 'View Slider', to: '/Slider/View-Slider' }
    ]
  },
  {
    name: 'Country',
    icon: PiTelegramLogoFill,
    links: [
      { label: 'Add Country', to: '/Country/Add-Country' },
      { label: 'View Country', to: '/Country/View-Country' }
    ]
  },
  {
    name: 'Testimonial',
    icon: FaRegNoteSticky,
    links: [
      { label: 'Add Testimonial', to: '/Testimonial/Add-Testimonial' },
      { label: 'View Testimonial', to: '/Testimonial/View-Testimonial' }
    ]
  },
  {
    name: 'FAQ',
    icon: FaQuestionCircle,
    links: [
      { label: 'Add FAQ', to: '/Faq/Add-Faq' },
      { label: 'View FAQ', to: '/Faq/View-Faq' }
    ]
  }
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState(null)

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
    <aside
      id="default-sidebar"
      className={`fixed inset-y-0 left-0 z-40 h-screen w-[290px] shrink-0 overflow-y-auto bg-slate-950 px-5 py-6 text-white shadow-2xl shadow-slate-900/20 transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      aria-label="Sidenav"
    >
      <Link to="/dashboard" onClick={onClose} className="mb-7 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-600 text-xl font-black shadow-lg shadow-violet-950/40">
          A
        </span>
        <div>
          <h2 className="text-2xl font-bold leading-tight">Admin Panel</h2>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">Control room</p>
        </div>
      </Link>

      <NavLink
        to="/dashboard"
        onClick={onClose}
        className={({ isActive }) =>
          `mb-3 flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition ${
            isActive
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-950/40'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`
        }
      >
        <AiFillPieChart size={20} />
        Dashboard
      </NavLink>

      <div className="mb-3 space-y-1 rounded-xl border border-white/10 bg-slate-900/60 p-2">
        <NavLink to="/my-profile" onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
          <FaUserAlt /> My Profile
        </NavLink>
        <NavLink to="/my-company" onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
          <FaBuilding /> My Company
        </NavLink>
      </div>

      <div className="space-y-2 pb-5">
        {menuGroups.map(({ name, icon: Icon, links }) => {
          const isOpen = openMenu === name

          return (
            <div key={name}>
              <button
                onClick={() => setOpenMenu(isOpen ? null : name)}
                type="button"
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-semibold transition ${
                  isOpen ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                aria-expanded={isOpen}
              >
                <Icon size={19} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">{name}</span>
                <FaChevronDown className={`shrink-0 text-xs transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="ml-5 mt-2 space-y-1 border-l border-slate-700 pl-4">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          isActive
                            ? 'bg-violet-500/15 text-violet-200'
                            : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                        }`
                      }
                    >
                      <FaChevronRight className="text-[10px]" />
                      <span className="truncate">{link.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={logoutHandler}
        className="sticky bottom-0 mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-100 shadow-lg transition hover:bg-red-600 hover:text-white"
      >
        <FaDoorOpen />
        Logout
      </button>
    </aside>
  )
}
