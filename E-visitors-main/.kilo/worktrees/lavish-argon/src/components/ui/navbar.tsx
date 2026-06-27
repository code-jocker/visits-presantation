import { useState } from 'react'
import { FaChevronDown, FaSignInAlt, FaHome, FaInfoCircle, FaCogs, FaEnvelope } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import evsLogo from '../../assets/logos/evs.png'

function Navbar() {
  const [selectedLanguage, setSelectedLanguage] = useState('ENG')
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  
  const languages = [
    { code: 'ENG', name: 'English' },
    { code: 'KIN', name: 'Kinyarwanda' },
    { code: 'SWA', name: 'Kiswahili' },
    { code: 'ARA', name: 'Arabic' },
    { code: 'FRA', name: 'French' }
  ]

  return (
    <div className='flex flex-col sm:flex-row justify-between items-center px-3 sm:px-6 py-3 rounded-t-xl sm:rounded-t-3xl gap-2 bg-[#1A3263]'>
      {/* Logo */}
      <div className='flex items-center gap-3'>
        <img src={evsLogo} alt='EVS Logo' className='w-8 h-8 sm:w-12 sm:h-12' />
        <span className='text-sm sm:text-2xl font-semibold text-white'>
          E-visitor platform
        </span>
      </div>

      {/* Nav */}
      <nav className='hidden md:block'>
        <ul className='flex gap-6 text-white font-bold'>
          <Link to='/' className='hover:text-gray-300 cursor-pointer text-xl flex items-center gap-2'>
            <FaHome size={16} />
            Home
          </Link>
          <Link to='/about' className='hover:text-gray-300 cursor-pointer text-xl flex items-center gap-2'>
            <FaInfoCircle size={16} />
            About
          </Link>
          <Link to='/services' className='hover:text-gray-300 cursor-pointer text-xl flex items-center gap-2'>
            <FaCogs size={16} />
            Services
          </Link>
          <Link to='/contact' className='hover:text-gray-300 cursor-pointer text-xl flex items-center gap-2'>
            <FaEnvelope size={16} />
            Contact
          </Link>
        </ul>
      </nav>

      {/* Right */}
      <div className='flex items-center gap-4 text-white'>
        <div className='relative'>
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className='flex items-center border-1 border-white gap-2 px-3 py-1 rounded-md hover:bg-white/10 transition-colors'
          >
            <span className='text-sm font-medium'>{selectedLanguage}</span>
            <FaChevronDown className={`text-xs transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isLanguageOpen && (
            <div className='absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[120px] z-50'>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code)
                    setIsLanguageOpen(false)
                  }}
                  className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2'
                >
                  <span className='font-medium text-blue-600'>{lang.code}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <Link
          to='/auth/login'
          className='rounded-xl bg-white bg-[#1A3263] px-3 py-1 text-sm'
        >
          <FaSignInAlt size={23} /> 
        </Link>
      </div>
    </div>
  )
}

export default Navbar