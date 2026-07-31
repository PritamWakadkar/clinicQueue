import React from 'react'
import { assets } from '../assets/assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/* ------LEFT SECTION------- */}
                <div>   
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-500 leading-6 '> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus id iure enim suscipit laborum inventore nemo quos ad amet nobis blanditiis totam tempora quasi, in explicabo minima laboriosam eius ipsa.
                    Quas, iusto perferendis delectus  numquam. Quam similique qui adipisci dolorum doloremque, nulla laborum!</p>
                </div>
                {/* -------ceter section------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>

                {/* --------right section-------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+91 9579090343</li>
                        <li>pritamwakadkar@gmil.com</li>
                    </ul>
                </div>

        </div>
        <div>
            {/* -----------copyRight Text---------- */}

            <hr />
            <p className='py-5 text-sm text-center'>CopyRight 2026@ perscripto -All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer