import { FaChartLine, FaLock, FaUsers, FaClock, FaMobile, FaHeadset } from 'react-icons/fa'
import Navbar from '../components/ui/navbar'
import borderImage from '../assets/images/design.png'
import cloudImage from '../assets/images/kigaliport.png'
import homeImage from '../assets/images/chartImagenow.png'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

function Services() {
  const services = [
    {
      icon: FaUsers,
      title: 'Visitor Management',
      description: 'Seamlessly register, track, and manage all visitor entries and exits with real-time notifications.',
      features: ['Quick Registration', 'Real-time Tracking', 'QR Code Support']
    },
    {
      icon: FaLock,
      title: 'Security & Compliance',
      description: 'Advanced security features including background checks, blacklisting, and compliance reporting.',
      features: ['Background Checks', 'Blacklist Management', 'Audit Trails']
    },
    {
      icon: FaChartLine,
      title: 'Analytics & Reports',
      description: 'Comprehensive analytics dashboard with detailed insights into visitor patterns and trends.',
      features: ['Real-time Dashboard', 'Custom Reports', 'Data Exports']
    },
    {
      icon: FaMobile,
      title: 'Mobile Access',
      description: 'Full mobile compatibility for check-ins and approvals on the go.',
      features: ['Mobile App', 'Offline Mode', 'Push Notifications']
    },
    {
      icon: FaClock,
      title: 'Appointment Management',
      description: 'Automated scheduling system for visitor appointments with calendar integration.',
      features: ['Calendar Integration', 'Auto Scheduling', 'Email Reminders']
    },
    {
      icon: FaHeadset,
      title: '24/7 Support',
      description: 'Dedicated customer support team available round the clock to assist you.',
      features: ['Live Chat', 'Email Support', 'Phone Support']
    }
  ]

  const pricing = [
    {
      plan: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small businesses',
      features: ['Up to 100 visitors/day', 'Basic Analytics', 'Email Support', '1 Administrator'],
      cta: 'Get Started'
    },
    {
      plan: 'Professional',
      price: '$299',
      period: '/month',
      description: 'Ideal for growing companies',
      features: ['Up to 500 visitors/day', 'Advanced Analytics', 'Priority Support', '5 Administrators', 'API Access'],
      cta: 'Get Started',
      featured: true
    },
    {
      plan: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large organizations',
      features: ['Unlimited visitors', 'Custom Integrations', '24/7 Dedicated Support', 'Unlimited Admins', 'SLA Guarantee'],
      cta: 'Contact Sales'
    }
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
            <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-4'>Our Services</h1>
            <p className='text-gray-700 text-base sm:text-lg max-w-2xl'>
              Comprehensive solutions designed to streamline your visitor management process and enhance security.
            </p>
          </div>

          {/* SERVICES GRID */}
          <div className='px-6 sm:px-10 lg:px-16 py-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {services.map((service, idx) => {
                const IconComponent = service.icon
                return (
                  <div
                    key={idx}
                    className='bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300'
                  >
                    <div className='bg-gradient-to-br from-[#1A3263] to-[#2a4b7f] p-4 rounded-xl w-fit mb-6'>
                      <IconComponent size={32} className='text-white' />
                    </div>
                    <h3 className='text-xl font-bold text-gray-900 mb-3'>{service.title}</h3>
                    <p className='text-gray-600 mb-4'>{service.description}</p>
                    <ul className='space-y-2'>
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className='text-sm text-gray-700 flex items-center gap-2'>
                          <span className='w-2 h-2 bg-[#1A3263] rounded-full'></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>

          {/* PRICING SECTION */}
          <div className='px-6 sm:px-10 lg:px-16 py-12 bg-gray-50'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>Simple, Transparent Pricing</h2>
              <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
                Choose the plan that fits your organization. All plans include core features.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {pricing.map((plan, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-8 transition-all ${
                    plan.featured
                      ? 'bg-[#1A3263] text-white border-2 border-[#1A3263] transform scale-105 shadow-2xl'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <h3 className='text-2xl font-bold mb-2'>{plan.plan}</h3>
                  <p className={`text-sm mb-4 ${plan.featured ? 'text-gray-200' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <div className='mb-6'>
                    <span className='text-4xl font-bold'>{plan.price}</span>
                    <span className={`text-sm ${plan.featured ? 'text-gray-200' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <Button
                    className={`w-full mb-6 py-3 rounded-lg font-bold transition ${
                      plan.featured
                        ? 'bg-white text-[#1A3263] hover:bg-gray-100'
                        : 'bg-[#1A3263] text-white hover:bg-[#2a4b7f]'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                  <ul className='space-y-3'>
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className='flex items-center gap-2 text-sm'>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.featured ? 'bg-white/20' : 'bg-[#1A3263]/10'
                        }`}>
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA SECTION */}
          <div className='px-6 sm:px-10 lg:px-16 py-12 text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Ready to Get Started?</h2>
            <p className='text-gray-600 text-lg mb-8 max-w-2xl mx-auto'>
              Join hundreds of organizations already using our platform to manage their visitor experience.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link to='/auth/register'>
                <Button className='bg-[#1A3263] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#2a4b7f] transition'>
                  Start Free Trial
                </Button>
              </Link>
              <Link to='/contact'>
                <Button className='bg-white text-[#1A3263] px-8 py-3 rounded-lg font-bold border-2 border-[#1A3263] hover:bg-[#1A3263] hover:text-white transition'>
                  Contact Sales
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

export default Services
