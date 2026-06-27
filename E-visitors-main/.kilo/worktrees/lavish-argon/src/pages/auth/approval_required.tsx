import { FaFacebookF, FaLinkedinIn, FaInstagram, FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import evsLogo from '../../assets/logos/evs.png'
import backgroundImage from '../../assets/images/chartImagenow.png'
import borderImage from '../../assets/images/design.png'
import Button from '../../components/ui/Button'
import LoginNavbar from '../../components/ui/loginNavbar'
import { FaXTwitter } from 'react-icons/fa6'

function ApprovalPending() {
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
      {/* Main container */}
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

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 flex-1 flex flex-col justify-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-white flex items-center justify-center shadow-xl">
                  <img src={evsLogo} alt="EVS Logo" className="w-12 h-12 lg:w-20 lg:h-20" />
                </div>
              </div>
              <h2 className="text-xl lg:text-3xl font-bold mb-2 tracking-wide">WELCOME To</h2>
              <p className="text-sm lg:text-lg text-blue-100 font-light">E-Visitors System</p>
            </div>
            
            {/* Social Media Buttons */}
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
          <div className="w-full lg:w-1/2 bg-white flex flex-col p-6 relative z-50">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md mx-auto text-center">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                    <FaCheckCircle className="text-yellow-500 text-5xl" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                  Account Pending Approval
                </h3>

                {/* Message */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Thank you for registering! Your account has been created successfully, 
                  but it requires approval from an administrator before you can access the system.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>What's next?</strong><br />
                    You will receive an email notification once your account has been approved. 
                    This usually takes not exceed 24 hours.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link to="/auth/login">
                    <Button className="w-full bg-[#1A3263] hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors duration-200">
                      Back to Login
                    </Button>
                  </Link>

                  <p className="text-sm text-gray-600 mt-2">
                    Need help?{' '}
                    <a href="mailto:support@evs.com" className="text-blue-600 hover:text-blue-800 font-medium">
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApprovalPending
