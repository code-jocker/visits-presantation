import { useState } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from 'react-icons/fa'
import Navbar from '../components/ui/navbar'
import borderImage from '../assets/images/design.png'
import cloudImage from '../assets/images/kigaliport.png'
import homeImage from '../assets/images/chartImagenow.png'
import Button from '../components/ui/Button'
import { toast } from 'react-toastify'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields', { position: 'top-center' })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Message sent successfully! We will contact you soon.', { position: 'top-center' })
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Please try again.', { position: 'top-center' })
    } finally {
      setIsLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone',
      details: '+250 (0) 788 123 456',
      subDetail: 'Available 9 AM - 6 PM'
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: 'support@e-visitors.com',
      subDetail: 'Response within 24 hours'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      details: 'Kigali, Rwanda',
      subDetail: 'Tech Hub Building, Floor 3'
    }
  ]

  const socialLinks = [
    { icon: FaFacebookF, label: 'Facebook' },
    { icon: FaLinkedinIn, label: 'LinkedIn' },
    { icon: FaInstagram, label: 'Instagram' },
    { icon: FaTwitter, label: 'Twitter' }
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
            <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-4'>Get In Touch</h1>
            <p className='text-gray-700 text-base sm:text-lg max-w-2xl'>
              Have questions about our E-Visitor Management System? We're here to help. Reach out to us through any of these channels.
            </p>
          </div>

          {/* CONTACT INFO CARDS */}
          <div className='px-6 sm:px-10 lg:px-16 py-10 grid grid-cols-1 md:grid-cols-3 gap-6'>
            {contactInfo.map((info, idx) => {
              const IconComponent = info.icon
              return (
                <div key={idx} className='bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-all'>
                  <div className='flex items-center gap-4 mb-4'>
                    <div className='bg-[#1A3263] p-3 rounded-lg'>
                      <IconComponent size={24} className='text-white' />
                    </div>
                    <h3 className='text-xl font-bold text-gray-900'>{info.title}</h3>
                  </div>
                  <p className='text-gray-800 font-semibold mb-1'>{info.details}</p>
                  <p className='text-gray-600 text-sm'>{info.subDetail}</p>
                </div>
              )
            })}
          </div>

          {/* FORM AND SOCIAL SECTION */}
          <div className='px-6 sm:px-10 lg:px-16 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10'>
            {/* CONTACT FORM */}
            <div className='lg:col-span-2'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Send us a Message</h2>
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    type='text'
                    name='name'
                    placeholder='Your Name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A3263] focus:ring-2 focus:ring-[#1A3263]/20 transition'
                  />
                  <input
                    type='email'
                    name='email'
                    placeholder='Your Email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A3263] focus:ring-2 focus:ring-[#1A3263]/20 transition'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    type='tel'
                    name='phone'
                    placeholder='Phone Number'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A3263] focus:ring-2 focus:ring-[#1A3263]/20 transition'
                  />
                  <input
                    type='text'
                    name='subject'
                    placeholder='Subject'
                    value={formData.subject}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A3263] focus:ring-2 focus:ring-[#1A3263]/20 transition'
                  />
                </div>

                <textarea
                  name='message'
                  placeholder='Your Message'
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1A3263] focus:ring-2 focus:ring-[#1A3263]/20 transition resize-none'
                />

                <Button
                  className='w-full bg-[#1A3263] text-white font-bold py-3 rounded-lg hover:bg-[#2a4b7f] transition'
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* SOCIAL MEDIA & INFO */}
            <div className='bg-gradient-to-br from-[#1A3263] to-[#2a4b7f] p-8 rounded-2xl text-white'>
              <h3 className='text-xl font-bold mb-6'>Follow Us</h3>
              <div className='space-y-4 mb-8'>
                {socialLinks.map((social, idx) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={idx}
                      href='#'
                      className='flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition'
                    >
                      <IconComponent size={20} />
                      <span className='font-medium'>{social.label}</span>
                    </a>
                  )
                })}
              </div>

              <hr className='border-white/30 my-6' />

              <div className='space-y-4'>
                <div>
                  <p className='text-sm opacity-75'>Business Hours</p>
                  <p className='font-semibold'>Monday - Friday: 9 AM - 6 PM</p>
                  <p className='font-semibold'>Saturday: 10 AM - 4 PM</p>
                  <p className='font-semibold'>Sunday: Closed</p>
                </div>
              </div>
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

export default Contact
