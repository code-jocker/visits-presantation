import chatbotAnimation from '../../assets/avatar/Cute chatbot greeting people with computer.json'
import homeImage from '../../assets/images/nh.jpg'
import cloudImage from '../../assets/images/kigaliport.png'
import computerSite from '../../assets/images/removedBackground.png'
import borderImage from '../../assets/images/design.png'
import Lottie from 'lottie-react'
import { FaArrowRight } from 'react-icons/fa'
import Button from '../../components/ui/Button'
import Navbar from '../../components/ui/navbar'


function Home() {
  return (
    <div
      className='w-full h-screen flex justify-center items-center relative overflow-hidden'
      style={{
        border: '10px solid transparent',
        borderImage: `url(${borderImage}) 10 10 10 10 repeat`,
        backgroundImage: `url(${homeImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* MAIN CARD */}
      <div className='w-full sm:w-11/12 md:w-10/12 lg:w-9/12 h-5/6 mx-2 sm:mx-4 rounded-xl sm:rounded-3xl shadow-2xl border border-gray-100 relative bg-white/90 backdrop-blur-md'>

        <div className='h-full flex flex-col'>

          {/* NAVBAR */}
          <Navbar />

          {/* MAIN CONTENT */}
          <div
            className='flex-1 flex flex-col lg:flex-row rounded-b-xl sm:rounded-b-3xl overflow-hidden'
            style={{
              backgroundImage: `url(${cloudImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* LEFT */}
            <div className='w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-center'>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>
                Digital Visitor Management
              </h1>

              <p className='text-gray-700 text-sm sm:text-base lg:text-lg mb-8 max-w-md'>
                Streamline your visitor experience with our modern, secure, and efficient
                electronic visitor system. Track, manage, and welcome guests seamlessly.
              </p>

              <div className='flex flex-col sm:flex-row gap-4'>
                <Button className='bg-white text-[#1A3263] rounded-full border border-[#1A3263]'>
                  Learn More
                </Button>

                <Button className='bg-[#1A3263] flex gap-3 items-center'>
                  Get Started
                  <FaArrowRight className='text-white' />
                </Button>
              </div>
            </div>

            {/* RIGHT */}
            <div className='w-full lg:w-1/2 flex justify-center items-start h-64 sm:h-auto'>
              <Lottie
                animationData={chatbotAnimation}
                className='w-full h-full -mt-8 sm:-mt-20'
                loop
                autoplay
              />
            </div>
          </div>
        </div>

        <img
          src={computerSite}
          alt='Computer Site'
          className='
            sm:w-32 sm:h-19
            absolute
            -bottom-18
            left-1/2
            transform -translate-x-1/2
            z-30
            pointer-events-none
          '
        />
      </div>
      
      {/* <div className='absolute bottom-1 font-bold right-2 z-40'>
        <Footer />
      </div> */}

    </div>
  )
}

export default Home
