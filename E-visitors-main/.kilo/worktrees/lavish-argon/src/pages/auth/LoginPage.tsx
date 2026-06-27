import { useState } from 'react'
import { FaFacebookF, FaLinkedinIn, FaEye, FaEyeSlash, FaChevronDown, FaInstagram } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Link } from 'react-router-dom'
import evsLogo from '../../assets/logos/evs.png'
import backgroundImage from '../../assets/images/chartImagenow.png'
import borderImage from '../../assets/images/design.png'
import Button from '../../components/ui/Button'
import LoginNavbar from '../../components/ui/loginNavbar'
import { FaXTwitter } from 'react-icons/fa6'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-toastify'

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          renderButton: (el: HTMLElement | null, options: any) => void
          prompt: () => void
          // Optional: callback hooks if needed
          initialize?: (options: any) => void
        }
      }
    }
  }
}




function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginType, setLoginType] = useState('email') // 'email' or 'phone'
  const [loginValue, setLoginValue] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('+250')
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading } = useAuth()

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




  const handleGoogleSignInError = () => {
    toast.error('Google Sign-In failed. Please try again.', { 
      position: 'top-center',
      autoClose: 5000,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const sanitizedPhone = loginType === 'phone' 
        ? `${selectedCountry}${loginValue.replace(/\D/g, '')}` 
        : undefined;

      const loginData = {
        type: loginType as 'email' | 'phone',
        phone: sanitizedPhone,
        email: loginType === 'email' ? loginValue : '',
        password: password
      };

      await login(loginData);
    } catch (error: any) {
      console.error('❌ Login form error:', error);
      toast.error('An unexpected error occurred. Please try again.', { 
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };


  return (
    <div
      className="w-screen h-screen flex items-center justify-center relative overflow-hidden"
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

      {/* Main login container */}
      <div className="w-[95vw] h-[95vh] max-w-6xl bg-white backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden relative flex flex-col">
        {/* Window controls */}
        <LoginNavbar />

        {/* Content */}
        <div className="flex flex-col lg:flex-row flex-1 relative overflow-hidden">
          {/* Left side - Blue section */}
          <div
            className="w-full lg:w-1/2 flex flex-col relative overflow-hidden"
            style={{
             background: "linear-gradient(135deg, #09306b 0%, #2f4a83 50%, #2d4373 100%)"
            }}
          >
            {/* Decorative circles */}
            <div
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: "10vw",
                height: "10vw",
                top: "15%",
                right: "15%",
              }}
            />

            <div
              className="absolute rounded-full bg-white opacity-5"
              style={{
                width: "6vw",
                height: "6vw",
                top: "50%",
                left: "20%",
              }}
            />

            <div
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: "12vw",
                height: "12vw",
                bottom: "10%",
                left: "10%",
              }}
            />

            {/* Content - flex-1 to take available space */}
            <div className="relative z-10 text-center text-white px-4 flex-1 flex flex-col justify-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-white flex items-center justify-center shadow-xl">
                  <img src={evsLogo} alt="EVS Logo" className="w-12 h-12 lg:w-20 lg:h-20" />
                </div>
              </div>
              <h2 className="text-xl lg:text-3xl font-bold mb-2 tracking-wide">WELCOME To</h2>
              <p className="text-sm lg:text-lg text-blue-100 font-light">E-Visitors System</p>
            </div>
            
            {/* Social Media Buttons - positioned at bottom */}
            <div className="relative z-10 pb-6 flex justify-center">
              <div className="flex justify-center gap-3">
                <button className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166FE5] transition-colors">
                  <FaFacebookF size={12} />
                </button>
                <button className="w-8 h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:bg-[#1A91DA] transition-colors">
                  <FaXTwitter size={12} />
                </button>
                <button className="w-8 h-8 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                  <FaInstagram size={12} />
                </button>
                <button className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:bg-[#004182] transition-colors">
                  <FaLinkedinIn size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* S-Curve Divider - positioned absolutely between sections */}
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
          <div className="w-full lg:w-1/2 bg-white flex flex-col p-2 relative z-50">
            <div className="flex-shrink-0 mb-4">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800">Please Sign in</h3>
              <p className="text-gray-500 text-xs mt-1">Login to your account to continue</p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="w-full max-w-sm mx-auto">
                <form onSubmit={handleSubmit} className="space-y-3">
                {/* Login Type Toggle */}
                <div className="mb-4 border border-gray-400 rounded-lg">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setLoginType('email')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${loginType === 'email'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginType('phone')}
                      className={`flex-1 py-2 px-4 rounded-md  text-sm font-medium transition-colors ${loginType === 'phone'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                      Phone
                    </button>
                  </div>
                </div>

                {/* Dynamic Input Field */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {loginType === 'email' ? 'Email Address' : 'Phone Number'}
                  </label>
                  {loginType === 'phone' ? (
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
                          <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-400 py-1 min-w-[200px] z-50">
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
                            <div className="max-h-40 overflow-y-auto  hide-scrollbar">
                              {filteredCountries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(country.code)
                                    setIsCountryOpen(false)
                                    setCountrySearch('')
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <img 
                                    src={`https://flagcdn.com/16x12/${country.flag.toLowerCase()}.png`}
                                    alt={country.name}
                                    className="w-4 h-3"
                                  />
                                  <span>{country.code}</span>
                                  <span>{country.name}</span>
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
                          placeholder="Enter your contact"
                          value={loginValue}
                          onChange={(e) => setLoginValue(e.target.value)}
                          className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-400 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={loginValue}
                      onChange={(e) => setLoginValue(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
                    />
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember me and Forgot password */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link to="/auth/reset-password" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot Password?
                  </Link>
                </div>

                {/* Sign in button */}
                <Button
                  type="submit"
                  className="w-full bg-[#1A3263] hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mb-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>

                {/* Divider */}
                <div className="flex items-center mb-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={() => {
                    // Trigger Google Sign-In using window.google API
                    // This requires Google Identity SDK to be loaded
                    if (window.google?.accounts?.id) {
                      // If your SDK is already initialized elsewhere, this will work.
                      // We keep your existing UI/button id.
                      window.google.accounts.id.renderButton(
                        document.getElementById('googleSignInButton'),
                        { theme: 'outline', size: 'large' }
                      )
                      window.google.accounts.id.prompt()
                    } else {
                      handleGoogleSignInError()
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 mb-4"
                  id="googleSignInButton"
                >
                  <FcGoogle size={20} />
                  <span className="text-gray-700 font-medium">Sign in with Google</span>
                </button>


                {/* Sign up link */}
                <p className="text-center mb-2 text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign up
                  </Link>
                </p>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* <img
        src={computerSite}
        alt='Computer Site'
        className='w-20 h-16 sm:w-32 sm:h-24 absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 pointer-events-none'
      /> */}
    </div>
  )
}

export default Login