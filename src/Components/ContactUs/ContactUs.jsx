import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

export default function ContactUs() {
  return (<>
  <Navbar/>
  <section className='head flex flex-col justify-center items-center bg-blue-900 py-40' > 
   <h2 className='text-6xl text-white font-bold py-3 '>Contact Us</h2>
   <p className='text-2xl text-white md:w-1/3  py-3 text-center'>Feel free to contact us anytime if you have any questions or needs by Whatsapp or email.</p>
  </section>
  <Footer/>
  </>
  )
}
