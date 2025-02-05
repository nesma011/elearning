import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import logo from "../../assets/logo.webp"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function ResetPass() {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    password: Yup.string()
      .matches(/^[a-zA-Z0-9]{6,10}$/, 'Password should be 6-10 characters, numbers and letters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required')
  });

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
        const email = location.state?.email;
        if (!email) {
          throw new Error('Email is required. Please try the reset process again.');
        }

        const response = await axios.post(
          `https://ahmedmahmoud10.pythonanywhere.com/password-reset-confirm/${id}/${token}`,
          values
         
        );

        if (response.data.statusMsg === 'success') {
          navigate('/login', { 
            state: { message: 'Password reset successful. Please login with your new password.' } 
          });
        }
      } catch (error) {
        setError(
          error.response?.data?.message || 
          error.message || 
          'Failed to reset password. Please try again.'
        );
      }
      setLoading(false);
    }
  });

  return (
    <section className="bg-gray-800 min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col items-center gap-2 py-10">
        <img src={logo} className="w-28" alt="Logo" />
        <h1 className="text-4xl font-semibold text-white">
          <span className="text-5xl font-extrabold text-white">ALEX</span>-MedLearn
        </h1>
      </div>

      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg mx-4">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <h1 className="text-center text-3xl font-bold text-blue-600 mb-6">
            Set New Password
          </h1>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps('password')}
              className={`w-full rounded-md border-2 py-3 px-4 ${
                formik.touched.password && formik.errors.password 
                ? 'border-red-500' 
                : 'border-gray-300'
              } focus:border-blue-500 focus:ring-2`}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="mt-1 text-sm text-red-500">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...formik.getFieldProps('confirmPassword')}
              className={`w-full rounded-md border-2 py-3 px-4 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword 
                ? 'border-red-500' 
                : 'border-gray-300'
              } focus:border-blue-500 focus:ring-2`}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="mt-1 text-sm text-red-500">
                {formik.errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md border border-blue-600 bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:ring-3 disabled:opacity-50"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </section>
  );
}