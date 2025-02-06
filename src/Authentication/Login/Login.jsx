import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { BallTriangle } from 'react-loader-spinner';
import { userContext } from '../../Context/UserContext';
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.webp"
import { toast } from 'react-toastify';


export default function Login() {
  let { settoken } = useContext(userContext);
  const [errorApi, setErrorApi] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to get device ID
const getDeviceId = () => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = crypto.randomUUID(); // Generate a unique device ID
    localStorage.setItem('device_id', deviceId);
    console.log(deviceId);
  }
  return deviceId;
};
  // Form validation schema
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('E-mail is invalid')
      .required('E-mail is required'),
    password: yup
      .string()
      .matches(
        /^[a-zA-Z0-9]{6,10}$/,
        'Password should be at least 6 characters, numbers, and not more than 10 characters'
      )
      .required('Password is required'),
  });

  // Formik setup
 // Formik setup
 const formicLogin = useFormik({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema,
  onSubmit: async (values) => {
    console.log('Starting login submission...')
    setLoading(true);
    setErrorApi(null); // Reset any previous errors
    
    try {
      const device_id = getDeviceId();
      console.log('Sending login request with:', { ...values, device_id }); 
      
      const response = await axios.post(
        'https://ahmedmahmoud10.pythonanywhere.com/login/',
        {
          email: values.email,
          password: values.password,
          device_id: device_id
        }
      );
      
      console.log('Login Response:', response.data);

      if (response.data.access && response.data.refresh) {
        localStorage.clear();
        
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        console.log('Access Token:', localStorage.getItem('access_token'));
        console.log('Refresh Token:', localStorage.getItem('refresh_token'));
        
        toast.success('Logged in successfully!', {
          position: 'top-right',
          autoClose: 10000,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        window.location.href = '/classes';
      } else {
        throw new Error('Login failed: Missing tokens in response');
      }
    } catch (error) {
      console.error('Login Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please try again.';
      
      setErrorApi(errorMessage);
      
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 10000,
      });
    } finally {
      setLoading(false);
    }
  },
});


  return (

    <>
 {errorApi && (
        <div
          className="fixed z-50 flex items-center justify-center p-4 mb-4 text-sm text-red-800 transform -translate-x-1/2 border border-red-300 rounded-lg bg-red-50 top-16 left-1/2"
          role="alert"
        >
          <svg
            className="flex-shrink-0 w-4 h-4 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            <span className="font-medium">Error:</span> {errorApi}
          </div>
        </div>
      )}
 
      <section className="bg-gray-800 flex flex-col justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-2 mt-20">
                         <img src={logo} className=" w-28" alt="" />
        

          {/* Logo Text */}
          <h1 className="text-4xl font-semibold text-white">
            <span className="text-5xl font-extrabold text-white">ALEX</span>-MedLearn
          </h1>
          <h2 className="font-extrabold text-2xl text-blue-500">Please Log In</h2>
        </div>

        <form  onSubmit={(e) => {
          e.preventDefault(); 
          formicLogin.handleSubmit(e)}}
        className="mt-10 bg-white my-6 p-10 w-1/2 mx-auto rounded-lg shadow-lg">
        {loading && (
          <div className="flex justify-center mb-5">
            <BallTriangle height={80} width={80} color="#1d4ed8" visible={true} />
          </div>
        )}
          
          
          <div className="my-6">
            <label htmlFor="Email" className="block text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              value={formicLogin.values.email}
              onChange={formicLogin.handleChange}
              onBlur={formicLogin.handleBlur}
              type="email"
              id="Email"
              name="email"
              className="mt-2 w-full rounded-md border-2 py-3 px-4 border-gray-900 focus:border-blue-500 focus:ring-2 bg-white text-lg text-gray-700 shadow-sm"
               
           />
           {formicLogin.touched.email && formicLogin.errors.email && (
            <div className="text-sm text-red-500">{formicLogin.errors.email}</div>
          )}
          </div>

          <div className="my-6">
            <label htmlFor="Password" className="block text-lg font-medium text-gray-700">
              Password
            </label>
            <input
                 value={formicLogin.values.password}
                 onChange={formicLogin.handleChange}
                 onBlur={formicLogin.handleBlur}
              type="password"
              id="Password"
              name="password"
              className="mt-2 w-full rounded-md border-2 py-3 px-4 border-gray-900 focus:border-blue-500 focus:ring-2 bg-white text-lg text-gray-700 shadow-sm"
            />
             {formicLogin.touched.password && formicLogin.errors.password && (
            <div className="text-sm text-red-500">{formicLogin.errors.password}</div>
          )}
          </div>

          <NavLink to="/forgotpass" className="text-blue-700 text-lg underline">
            Forgot your Password?
          </NavLink>

          <div className="flex flex-col items-center gap-4 mt-6">
            <button  disabled={loading} className="w-full rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-lg font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:ring-3">
              Log In
            </button>

            <p className="text-lg text-gray-500">
              Don’t have an account?
              <NavLink to="/register" className="text-blue-700 px-2 underline">
                Register
              </NavLink>
            </p>
          </div>
        </form>
      </section>
    </>
  );
}
