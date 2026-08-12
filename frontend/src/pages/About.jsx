import React from 'react'
import { assets } from '../assets/assets/assets_frontend/assets'

const About = () => {
  return (
    <div className='px-6 md:px-10 lg:px-20 py-10'>

      {/* Heading */}
      <h1 className='text-3xl font-bold text-center text-gray-800 mb-10'>
        ABOUT <span className='text-blue-600'>US</span>
      </h1>

      {/* About Section */}
      <div className='flex flex-col md:flex-row items-center gap-10'>

        {/* Left Part */}
        <div className='md:w-1/2'>
          <img
            className='w-full rounded-xl shadow-lg'
            src={assets.about_image}
            alt="About"
          />
        </div>

        {/* Right Part */}
        <div className='md:w-1/2 text-gray-600 space-y-5 leading-7'>

          <p>
            Welcome to <span className='font-semibold text-blue-600'>Prescripto</span>,
            your trusted partner in managing your healthcare needs conveniently
            and efficiently. At Prescripto, we understand the challenges
            individuals face when it comes to scheduling doctor appointments
            and managing their health records.
          </p>

          <p>
            Prescripto is committed to excellence in healthcare technology.
            We continuously strive to enhance our platform, integrating the
            latest advancements to improve user experience and deliver
            superior service. Whether you're booking your first appointment
            or managing ongoing care, Prescripto is here to support you every
            step of the way.
          </p>

          <div>
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>
              Our Vision
            </h2>

            <p>
              Our vision at Prescripto is to create a seamless healthcare
              experience for every user. We aim to bridge the gap between
              patients and healthcare providers, making it easier for you to
              access the care you need, when you need it.
            </p>
          </div>

        </div>

      </div>

      {/* Why Choose Us */}
      <div className='mt-20'>

        <h1 className='text-3xl font-bold text-center text-gray-800 mb-10'>
          WHY <span className='text-blue-600'>CHOOSE US</span>
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

          {/* Card 1 */}
          <div className='border rounded-xl p-8 shadow-md hover:shadow-xl hover:bg-blue-600 hover:text-white transition-all duration-300'>
            <h2 className='text-xl font-semibold mb-3'>
              Efficiency
            </h2>

            <p>
              Streamlined appointment scheduling that fits into your busy
              lifestyle.
            </p>
          </div>

          {/* Card 2 */}
          <div className='border rounded-xl p-8 shadow-md hover:shadow-xl hover:bg-blue-600 hover:text-white transition-all duration-300'>
            <h2 className='text-xl font-semibold mb-3'>
              Convenience
            </h2>

            <p>
              Access to a network of trusted healthcare professionals in your
              area.
            </p>
          </div>

          {/* Card 3 */}
          <div className='border rounded-xl p-8 shadow-md hover:shadow-xl hover:bg-blue-600 hover:text-white transition-all duration-300'>
            <h2 className='text-xl font-semibold mb-3'>
              Personalization
            </h2>

            <p>
              Tailored recommendations and reminders to help you stay on top
              of your health.
            </p>
          </div>

        </div>

      </div>

       
    </div>
  )
}

export default About