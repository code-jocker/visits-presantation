import { FaSignInAlt, FaHome, FaInfoCircle, FaCogs, FaEnvelope } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import evsLogo from '../../assets/logos/evs.png'

function RegisterNavbar() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-3 sm:px-6 py-2 border-b border-gray-200 gap-2 bg-[#1A3263] flex-shrink-0">
      {/* Logo */}
      <div className='flex items-center gap-3'>
        <img src={evsLogo} alt='EVS Logo' className='w-6 h-6 sm:w-8 sm:h-8' />
        <span className='text-xs sm:text-xl font-semibold text-white'>
          E-visitor platform
        </span>
      </div>

      {/* Nav */}
      <nav className='hidden md:block'>
        <ul className='flex gap-9 text-white !font-bold text-xl'>
          <Link to="/" className='hover:text-gray-300 cursor-pointer !text-white flex items-center gap-2'>
            <FaHome size={16} />
            Home
          </Link>
          <Link to="/about" className='hover:text-gray-300 cursor-pointer !text-white flex items-center gap-2'>
            <FaInfoCircle size={16} />
            About
          </Link>
          <Link to="/services" className='hover:text-gray-300 cursor-pointer !text-white flex items-center gap-2'>
            <FaCogs size={16} />
            Services
          </Link>
          <Link to="/contact" className='hover:text-gray-300 cursor-pointer !text-white flex items-center gap-2'>
            <FaEnvelope size={16} />
            Contact
          </Link>
        </ul>
      </nav>

      {/* Right */}
      <div className='flex items-center gap-4 text-white'>
        <Link to="/auth/login" className='rounded-xl bg-white bg-[#1A3263] px-2 py-1 text-lg flex items-center gap-1 font-bold hover:bg-gray-100 transition-colors'>
          <FaSignInAlt size={12} />
          Login
        </Link>
      </div>
    </div>
  )
}

export default RegisterNavbar