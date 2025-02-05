import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../assets/logo.webp"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function ResetPass() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        /^[a-zA-Z0-9]{6,10}$/,
        'Password should be 6-10 characters, numbers and letters'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required')
  });

  // Formik Setup
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        // Retrieve email from previous page state
        const email = location.state?.email;
        if (!email) {
          throw new Error('No email provided');
        }

        const response = await axios.post(
          'https://ecommerce.routemisr.com/api/v1/auth/resetPassword',
          { 
            email, 
            newPassword: values.password 
          }
        );

        // If successful, navigate to login
        if (response.data.statusMsg === 'success') {
          navigate('/login');
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <>
      <section className="bg-gray-800 min-h-screen flex flex-col justify-center items-center">
        {/* Logo */}
        <div className="flex flex-col items-center gapy-2 py-10">
          <img src={logo} className="w-28" alt="" />
          <h1 className="text-4xl font-semibold text-white">
            <span className="text-5xl font-extrabold text-white">ALEX</span>-MedLearn
          </h1>
        </div>

        <div className="bg-white w-1/2 p-10 rounded-lg shadow-lg">
          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="mt-6">
            <h1 className="text-center text-3xl font-bold text-blue-600">Set New Password</h1>

            {error && (
              <div className="text-red-500 text-center mb-4">
                {error}
              </div>
            )}

            <div className="my-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 w-full rounded-md border-2 py-3 px-4 border-gray-900 focus:border-blue-500 focus:ring-2 bg-white text-gray-700 shadow-sm"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <div className="my-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Password Confirmation
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 w-full rounded-md border-2 py-3 px-4 border-gray-900 focus:border-blue-500 focus:ring-2 bg-white text-gray-700 shadow-sm"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:ring-3 focus:outline-none"
            >
              {loading ? 'Confirming...' : 'Confirm'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}