import { useState } from 'react'
import { FaChevronDown, FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import evsLogo from '../../assets/logos/evs.png'
import backgroundImage from '../../assets/images/chartImagenow.png'
import borderImage from '../../assets/images/kf.png'
import RegisterNavbar from '../../components/ui/registerNavbar'
import { FaXTwitter } from 'react-icons/fa6'

function ResetPassword() {
  const [resetType, setResetType] = useState('email')
  const [resetValue, setResetValue] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('+250')
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')

  const countries = [
    { code: '+250', name: 'Rwanda', flag: 'RW' },
    { code: '+1', name: 'USA', flag: 'US' },
    { code: '+44', name: 'UK', flag: 'GB' },
    { code: '+33', name: 'France', flag: 'FR' },
    { code: '+49', name: 'Germany', flag: 'DE' },
    { code: '+254', name: 'Kenya', flag: 'KE' },
    { code: '+256', name: 'Uganda', flag: 'UG' }
  ]

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.includes(countrySearch)
  )

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log('Reset password submitted', { resetType, resetValue, selectedCountry })
  }

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center relative px-4 py-8"
      style={{
        border: '10px solid transparent',
        borderImage: `url(${borderImage}) 10 repeat`,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Main reset password container */}
      <div className="w-full max-w-6xl h-auto bg-white backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden relative">
        {/* Window controls */}
        <RegisterNavbar />

        {/* Content */}
        <div className="flex flex-col lg:flex-row min-h-[500px] relative">
          {/* Left side - Blue section */}
          <div
            className="w-full lg:w-1/2 flex flex-col relative overflow-visible"
            style={{
              background: "linear-gradient(135deg, #09306b 0%, #2f4a83 50%, #2d4373 100%)"
            }}
          >
            {/* Decorative circles */}
            <div
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: "150px",
                height: "150px",
                top: "15%",
                right: "15%",
              }}
            />

            <div
              className="absolute rounded-full bg-white opacity-5"
              style={{
                width: "100px",
                height: "100px",
                top: "50%",
                left: "20%",
              }}
            />

            <div
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: "180px",
                height: "180px",
                bottom: "10%",
                left: "10%",
              }}
            />

            {/* Content - flex-1 to take available space */}
            <div className="relative z-10 text-center text-white px-8 flex-1 flex flex-col justify-center">
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 lg:w-48 lg:h-48 rounded-full bg-white flex items-center justify-center shadow-xl">
                  <img src={evsLogo} alt="EVS Logo" className="w-24 h-24 lg:w-34 lg:h-34" />
                </div>
              </div>
              <h2 className="text-2xl lg:text-4xl font-bold mb-3 tracking-wide">RESET PASSWORD</h2>
              <p className="text-lg lg:text-xl text-blue-100 font-light">E-Visitors System</p>
            </div>
            
            {/* Social Media Buttons - positioned at bottom */}
            <div className="relative z-10 pb-6 flex justify-center">
              <div className="flex justify-center gap-4">
                <button className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166FE5] transition-colors">
                  <FaFacebookF />
                </button>
                <button className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:bg-[#1A91DA] transition-colors">
                  <FaXTwitter />
                </button>
                <button className="w-10 h-10 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                  <FaInstagram />
                </button>
                <button className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:bg-[#004182] transition-colors">
                  <FaLinkedinIn />
                </button>
              </div>
            </div>
          </div>

          {/* S-Curve Divider */}
          <svg
            className="absolute left-1/2 top-0 h-full hidden lg:block z-20"
            style={{ width: '100px', marginLeft: '-80px' }}
            viewBox="0 0 200 600"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,0 C 150,0 150,150 100,300 C 50,450 50,600 200,600 L 200,0 Z"
              fill="white"
            />
          </svg>

          {/* Right side - White section */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12 relative z-50">
            <div className="w-full max-w-sm">
              <div className="mb-6">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">Reset Password</h3>
                <p className="text-gray-500 text-sm mt-2 mb-8">Enter your email or phone to reset password</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Reset Type Toggle */}
                <div className="mb-4 border border-gray-400 rounded-md">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setResetType('email')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${resetType === 'email'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetType('phone')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${resetType === 'phone'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                      Phone
                    </button>
                  </div>
                </div>

                {/* Dynamic Input Field */}
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {resetType === 'email' ? 'Email Address' : 'Phone Number'}
                  </label>
                  {resetType === 'phone' ? (
                    <div className="flex">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCountryOpen(!isCountryOpen)}
                          className="flex items-center gap-2 px-3 py-4 bg-gray-50 border border-gray-400 border-r-0 rounded-l-lg hover:bg-gray-100 transition-colors min-w-[120px]"
                        >
                          <img 
                            src={`https://flagcdn.com/16x12/${countries.find(c => c.code === selectedCountry)?.flag.toLowerCase()}.png`}
                            alt={countries.find(c => c.code === selectedCountry)?.name}
                            className="w-4 h-3"
                          />
                          <span className="text-xs text-black">{countries.find(c => c.code === selectedCountry)?.name}</span>
                          <FaChevronDown className={`text-xs transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCountryOpen && (
                          <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[200px] z-50">
                            <div className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                placeholder="Search country..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="w-full px-2 py-1 text-black text-sm border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-40 overflow-y-auto hide-scrollbar">
                            {filteredCountries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(country.code)
                                  setIsCountryOpen(false)
                                  setCountrySearch('')
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                              >
                                <img 
                                  src={`https://flagcdn.com/16x12/${country.flag.toLowerCase()}.png`}
                                  alt={country.name}
                                  className="w-4 h-3"
                                />
                                <span className="text-black">{country.code}</span>
                                <span className="text-black">{country.name}</span>
                              </button>
                            ))}
                            {filteredCountries.length === 0 && (
                              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                No countries found
                              </div>
                            )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-medium">
                          {selectedCountry}
                        </span>
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={resetValue}
                          onChange={(e) => setResetValue(e.target.value)}
                          className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-400 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={resetValue}
                      onChange={(e) => setResetValue(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
                    />
                  )}
                </div>

                {/* Reset button */}
                <button
                  type="submit"
                  className="w-full bg-[#1A3263] hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mb-6"
                >
                  Send Reset Link
                </button>

                {/* Back to login link */}
                <p className="text-center mb-2 text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Back to Login
                  </Link>
                </p>
              </form>


            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ResetPassword