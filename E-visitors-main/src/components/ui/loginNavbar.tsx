import { FaUserPlus, FaHome, FaInfoCircle, FaCogs, FaEnvelope } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import evsLogo from '../../assets/logos/evs.png'

function LoginNavbar() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-3 sm:px-6 py-2 border-b border-gray-200 gap-2 bg-[#1A3263] flex-shrink-0">
      {/* Logo */}
      <div className='flex items-center gap-3'>
        <img src={evsLogo} alt='EVS Logo' className='w-6 h-6 sm:w-8 sm:h-8' />
        <span className='text-lg sm:text-xl font-semibold text-white'>
          E-visitor platform
        </span>
      </div>

      {/* Nav */}
      <nav className='hidden md:block'>
        <ul className='flex gap-9 text-white font-bold text-xl'>
          <Link to="/" className='hover:text-gray-300 cursor-pointer !text-white flex items-center gap-3'>
            <FaHome size={16} />
            Home
          </Link>
          <li className='hover:text-gray-300 cursor-pointer flex items-center gap-2'>
            <FaInfoCircle size={16} />
            About
          </li>
          <li className='hover:text-gray-300 cursor-pointer flex items-center gap-2'>
            <FaCogs size={16} />
            Services
          </li>
          <li className='hover:text-gray-300 cursor-pointer flex items-center gap-2'>
            <FaEnvelope size={16} />
            Contact
          </li>
        </ul>
      </nav>

      {/* Right */}
      <div className='flex items-center gap-4 text-white'>
        <Link to="/auth/register" className='rounded-xl bg-white bg-[#1A3263] px-2 py-1 text-lg flex items-center gap-1'>
          <FaUserPlus size={12} />
          Register
        </Link>
      </div>
    </div>
  )
}

export default LoginNavbar