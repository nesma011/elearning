import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from "../../assets/logo.webp"
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify';


export default function ForgotPass() {
  let navigate = useNavigate()
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Validation Schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
  });

  // Formik Setup
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // API call for password reset
        const response = await axios.post(
          `${API_BASE_URL}/password-reset/`, 
          { email: values.email }
        );

        // If successful, navigate to reset pass page
        if (response.data.statusMsg === 'success') {
          toast.success('Check Your Mail To Reset Password', {
                      position: "top-right",
                      autoClose: 10000,
                    });
          navigate('/resetpass', { 
            state: { email: values.email } 
          });
        }
      } catch (error) {
        console.error('Password Reset Error:', error.response?.data?.message || error.message);
        // Handle error (show error message, etc.)
      }
    }
  });

  return (<>
    <section className="bg-gray-800 my-20">
      <div className="flex flex-col items-center gap-2 mt-10">
        <img src={logo} className="w-28" alt="" />
        <h1 className="text-4xl font-semibold text-white">
          <span className="text-5xl font-extrabold text-white">ALEX</span>-MedLearn
        </h1>
      </div>
      <main className="flex items-center justify-center px-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
        <div className="max-w-xl lg:max-w-3xl">
          <form 
            onSubmit={formik.handleSubmit} 
            className="mt-8 grid grid-cols-6 gap-6"
          >
            <h1 className='col-span-6 text-center text-blue-800 text-3xl font-bold'>
              Forgot Password
            </h1>
            <div className="col-span-6">
              <label htmlFor="email" className="block text-xl font-medium text-white">
                Email 
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 w-full rounded-md py-2 border-gray-800 bg-white text-sm text-gray-700 shadow-xl"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="inline-block shrink-0 col-span-3 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:ring-3 focus:outline-hidden"
            >
              Continue
            </button>
          </form>
        </div>
      </main>
    </section>
  </>)
}