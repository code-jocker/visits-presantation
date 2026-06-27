import { FaBell, FaUser } from 'react-icons/fa'
import { HiOutlineMenu } from 'react-icons/hi'
import { IoMdLogOut } from 'react-icons/io'
import { useState, useEffect, useRef } from 'react'
import evsLogo from '../../assets/logos/evs.png'
import { useAuth } from '../../hooks/useAuth'

interface DashboardHeaderProps {
  onMenuClick: () => void
}

function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { logout } = useAuth()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
  }
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:text-[#1A3263] hover:bg-gray-100 rounded-lg transition-colors"
        >
          <HiOutlineMenu size={20} />
        </button>
        <img src={evsLogo} alt="EVS Logo" className="w-8 h-8" />
        <span className="text-2xl font-bold text-[#1A3263] hidden sm:block">E-Visitors Dashboard</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-600 hover:text-[#1A3263] hover:bg-gray-100 rounded-lg transition-colors">
          <FaBell size={18} />
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 bg-[#1A3263] rounded-full flex items-center justify-center">
              <FaUser className="text-white" size={14} />
            </div>
            <span className="text-sm font-medium text-gray-700">User</span>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-50">
              <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors" onClick={() =>handleLogout()}>
                <IoMdLogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader