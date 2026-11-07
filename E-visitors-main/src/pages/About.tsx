import { FaBullseye, FaEye, FaHeart, FaTrophy, FaUsers, FaGlobe } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import Navbar from '../components/ui/navbar'
import borderImage from '../assets/images/design.png'
import cloudImage from '../assets/images/kigaliport.png'
import homeImage from '../assets/images/chartImagenow.png'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { usersApi } from '../api/users'
import { visitorApi } from '../api/visitor'

function About() {
  const [stats, setStats] = useState([
    { value: '500+', label: 'Active Customers', icon: FaUsers },
    { value: '2M+', label: 'Visitors Managed', icon: FaGlobe },
    { value: '99.8%', label: 'System Uptime', icon: FaTrophy },
    { value: '50+', label: 'Team Members', icon: FaHeart }
  ])

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users and visitors data
        const usersResponse = await usersApi.getAll({ take: 1000 })
        const visitorsResponse = await visitorApi.getRecentTaps({})

        const usersCount = (usersResponse.result || []).length
        const visitorsCount = (visitorsResponse.result || []).length

        setStats([
          { value: usersCount.toString(), label: 'Active Users', icon: FaUsers },
          { value: visitorsCount.toString(), label: 'Visitors Managed', icon: FaGlobe },
          { value: '99.8%', label: 'System Uptime', icon: FaTrophy },
          { value: (Math.floor(usersCount / 10) + 50).toString(), label: 'Team Members', icon: FaHeart }
        ])
      } catch (err) {
        console.error('Error fetching about page stats:', err)
        // Keep default stats if fetch fails
      }
    }

    fetchStats()
  }, [])

  const values = [
    {
      icon: FaBullseye,
      title: 'Innovation',
      description: 'We continuously innovate to provide cutting-edge solutions for visitor management.'
    },
    {
      icon: FaEye,
      title: 'Transparency',
      description: 'Complete visibility into all visitor movements and system operations for maximum trust.'
    },
    {
      icon: FaHeart,
      title: 'Reliability',
      description: 'Enterprise-grade reliability with 99.8% uptime guarantee and 24/7 support.'
    },
    {
      icon: FaUsers,
      title: 'Customer Focus',
      description: 'Your success is our priority. We listen and adapt to your evolving needs.'
    }
  ]

  const timeline = [
    {
      year: '2020',
      title: 'Founded',
      description: 'E-Visitor platform was founded with a vision to revolutionize visitor management.'
    },
    {
      year: '2021',
      title: 'First 100 Customers',
      description: 'Reached a milestone with 100 customers across East Africa.'
    },
    {
      year: '2022',
      title: 'Mobile App Launch',
      description: 'Launched mobile application for iOS and Android platforms.'
    },
    {
      year: '2023',
      title: 'Regional Expansion',
      description: 'Expanded operations to 5 African countries with 500+ active customers.'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Integrated AI-powered features for enhanced security and analytics.'
    }
  ]

  const team = [
    { name: 'John Mukamana', role: 'CEO & Founder', department: 'Leadership' },
    { name: 'Sarah Kiprotich', role: 'CTO', department: 'Technology' },
    { name: 'Michael Okonkwo', role: 'Head of Product', department: 'Product' },
    { name: 'Grace Mungai', role: 'Head of Support', department: 'Customer Success' }
  ]

  return (
    <div
      className='w-full min-h-screen flex justify-center items-center py-6 relative overflow-hidden'
      style={{
        border: '10px solid transparent',
        borderImage: `url(${borderImage}) 10 10 10 10 repeat`,
        backgroundImage: `url(${homeImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='w-full sm:w-11/12 md:w-10/12 lg:w-9/12 mx-2 sm:mx-4 rounded-xl sm:rounded-3xl shadow-2xl border border-gray-100 bg-white/90 backdrop-blur-md overflow-hidden'>
        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <div className='flex flex-col'>
          {/* HEADER SECTION */}
          <div
            className='px-6 sm:px-10 lg:px-16 py-10 sm:py-16'
            style={{
              backgroundImage: `url(${cloudImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-4'>About E-Visitor</h1>
            <p className='text-gray-700 text-base sm:text-lg max-w-2xl'>
              Revolutionizing visitor management in Africa with innovative, secure, and user-friendly solutions.
            </p>
          </div>

          {/* MISSION & VISION */}
          <div className='px-6 sm:px-10 lg:px-16 py-12 grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100'>
              <div className='bg-[#1A3263] p-4 rounded-lg w-fit mb-4'>
                <FaBullseye size={24} className='text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>Our Mission</h3>
              <p className='text-gray-700'>
                To provide African organizations with world-class visitor management solutions that enhance security, improve efficiency, and create memorable guest experiences.
              </p>
            </div>

            <div className='bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100'>
              <div className='bg-[#1A3263] p-4 rounded-lg w-fit mb-4'>
                <FaEye size={24} className='text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>Our Vision</h3>
              <p className='text-gray-700'>
                To become the leading visitor management platform in Africa, trusted by thousands of organizations for secure and efficient guest management.
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className='px-6 sm:px-10 lg:px-16 py-12 bg-gradient-to-r from-[#1A3263] to-[#2a4b7f]'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon
                return (
                  <div key={idx} className='text-center'>
                    <div className='flex justify-center mb-3'>
                      <IconComponent size={32} className='text-white opacity-75' />
                    </div>
                    <p className='text-3xl md:text-4xl font-bold text-white mb-1'>{stat.value}</p>
                    <p className='text-blue-100'>{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CORE VALUES */}
          <div className='px-6 sm:px-10 lg:px-16 py-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-10 text-center'>Our Core Values</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {values.map((value, idx) => {
                const IconComponent = value.icon
                return (
                  <div key={idx} className='flex gap-6'>
                    <div className='flex-shrink-0'>
                      <div className='flex items-center justify-center h-12 w-12 rounded-lg bg-[#1A3263]'>
                        <IconComponent size={24} className='text-white' />
                      </div>
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-gray-900 mb-2'>{value.title}</h3>
                      <p className='text-gray-600'>{value.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* TIMELINE */}
          <div className='px-6 sm:px-10 lg:px-16 py-12 bg-gray-50'>
            <h2 className='text-3xl font-bold text-gray-900 mb-10 text-center'>Our Journey</h2>
            <div className='space-y-8'>
              {timeline.map((event, idx) => (
                <div key={idx} className='flex gap-6'>
                  <div className='flex flex-col items-center'>
                    <div className='w-12 h-12 bg-[#1A3263] rounded-full flex items-center justify-center text-white font-bold mb-2'>
                      {event.year.substring(2)}
                    </div>
                    {idx !== timeline.length - 1 && (
                      <div className='w-1 h-12 bg-gray-300'></div>
                    )}
                  </div>
                  <div className='flex-grow pb-8'>
                    <p className='text-sm font-bold text-[#1A3263]'>{event.year}</p>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>{event.title}</h3>
                    <p className='text-gray-600'>{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TEAM PREVIEW */}
          <div className='px-6 sm:px-10 lg:px-16 py-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-10 text-center'>Our Leadership Team</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {team.map((member, idx) => (
                <div key={idx} className='bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow'>
                  <div className='w-16 h-16 bg-gradient-to-br from-[#1A3263] to-[#2a4b7f] rounded-full mx-auto mb-4'></div>
                  <h3 className='text-lg font-bold text-gray-900 mb-1'>{member.name}</h3>
                  <p className='text-sm font-semibold text-[#1A3263] mb-1'>{member.role}</p>
                  <p className='text-xs text-gray-600'>{member.department}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA SECTION */}
          <div className='px-6 sm:px-10 lg:px-16 py-12 bg-gradient-to-r from-[#1A3263] to-[#2a4b7f] text-white text-center'>
            <h2 className='text-3xl font-bold mb-4'>Join Our Community</h2>
            <p className='text-lg opacity-90 mb-8 max-w-2xl mx-auto'>
              Experience the future of visitor management. Start your free trial today.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link to='/auth/register'>
                <Button className='bg-white text-[#1A3263] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition'>
                  Start Free Trial
                </Button>
              </Link>
              <Link to='/contact'>
                <Button className='bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition'>
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

          {/* FOOTER */}
          <div className='px-6 sm:px-10 lg:px-16 py-6 border-t border-gray-200 text-center text-gray-600 text-sm'>
            <p>&copy; 2024 E-Visitor Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
