import { NavLink } from 'react-router-dom'
import countryCodes from "../../../countrycodes.json"; 
import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import logo from "../../../public/logo.webp"
import axios from 'axios';
import * as yup from 'yup';
/* import { useNavigate } from 'react-router-dom';
 */
import { BallTriangle } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';


export default function Register() {
/*   const navigate = useNavigate();
 */  const [errorApi, setErrorApi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState("+20");
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const getDeviceId = () => {
  const newDeviceId = crypto.randomUUID();
  localStorage.setItem('device_id', newDeviceId); 
  return newDeviceId;

};
  
  // Form validation schema
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .min(9, 'Name should be at least 9 characters')
      .max(40, "Name shouldn't be more than 40 characters")
      .required('Name is required'),
    email: yup
      .string()
      .email('E-mail is invalid')
      .required('E-mail is required'),
    phone_number: yup
      .string()
      .matches(/^\d{1,14}$/, 'Phone number must contain only numbers')
      .required('Phone is required'),
    password: yup
      .string()
      .matches(
        /^[a-zA-Z0-9]{4,10}$/,
        'Password should be 6-10 characters, numbers and letters'
      )
      .required('Password is required'),
    country: yup.string().required('Country is required'),
    birth_date: yup
      .date()
      .required('Birth date is required')
      .max(new Date(), 'Birth date cannot be in the future')
  });

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formikRegister = useFormik({
    initialValues: {
      email: '',
      username: '',
      phone_number: '',
      password: '',
      country: '',
      birth_date: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorApi(null);
      try {
        localStorage.clear();
        const device_id = getDeviceId();
        const fullPhoneNumber = "+" + selectedCode.replace('+', '') + values.phone_number;
        const payload = { 
          email: values.email,
          username: values.username.trim(), 
          phone_number: fullPhoneNumber.trim(),
          password: values.password,
          country: values.country.toUpperCase(), 
          birth_date: formatDate(values.birth_date),
          device_id
        };
    
        const userData = { username: values.username, email: values.email };
    
        const { data } = await axios.post(
          `${API_BASE_URL}/register/`,
          payload
        );
    
        console.log('Response:', data); 
    
        if (data.message.includes("Account created successfully")) {
          toast.success('Registration successful! Please check your email to activate your account.', {
            position: "top-right",
            autoClose: 50000,
          });
          localStorage.setItem("user", JSON.stringify(userData));
    
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.error('Error:', error); 
    
        const errorMessage = error.response?.data?.message || 'Registration failed. Please contact us.';
        setErrorApi(errorMessage);
    
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    },
    
    
  });

  return (<>
  <Navbar/>
    {errorApi && (
      <div
        className="fixed z-50 flex items-center justify-center p-4 mb-4 text-sm text-red-800 transform -translate-x-1/2 border border-red-300 rounded-lg bg-red-50 top-16 left-1/2"
        role="alert"
      >
        <svg className="flex-shrink-0 w-4 h-4 mr-3" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <div>
          <span className="font-medium">Error:</span> {errorApi}
        </div>
      </div>
    )}
    <section className="bg-gray-800 md:flex justify-around items-center h-auto">
      <div className="flex flex-col items-center gap-2 py-8">
        <img src={logo} className="w-28" alt="" />
        <h1 className="text-4xl font-semibold text-white"> 
          <span className='text-5xl font-extrabold text-white'>ALEX</span>-MedLearn
        </h1>
        <h2 className="font-extrabold text-2xl text-blue-500">Please Sign Up</h2>
      </div>

      <form 
        onSubmit={formikRegister.handleSubmit}
        className="mt-32 bg-white my-6 p-6"
      >
        {loading && (
          <div className="flex justify-center mb-5">
            <BallTriangle height={80} width={80} color="#1d4ed8" visible={true} />
          </div>
        )}

        <div className="my-4">
          <label htmlFor="username" className="block text-lg font-medium text-gray-700">
            Full Name
          </label>
          <input
            value={formikRegister.values.username}
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            type="text"
            id="username"
            name="username"
            className="mt-1 w-full rounded-md border-2 py-2 px-3 border-gray-900 focus:border-blue-500 focus:ring-2 bg-white text-sm text-gray-700 shadow-xs"
          />
          {formikRegister.touched.username && formikRegister.errors.username && (
            <div className="text-sm text-red-500">{formikRegister.errors.username}</div>
          )}
        </div>

        <div className="my-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            value={formikRegister.values.email}
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            type="email"
            id="email"
            name="email"
            className="mt-1 w-full rounded-md border-2 py-2 px-3 border-gray-900 focus:border-blue-500 focus:ring-2 bg-white text-sm text-gray-700 shadow-xs"
          />
          {formikRegister.touched.email && formikRegister.errors.email && (
            <div className="text-sm text-red-500">{formikRegister.errors.email}</div>
          )}
        </div>

        <div className="my-4">
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Mobile</label>
           <div className='flex flex-col sm:flex-row gap-2'>
            <select
              className="border-2 w-full sm:w-auto py-2 px-3 border-gray-900 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-400"
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.dial_code}>
                  {country.flag} {country.name} ({country.dial_code})
                </option>
              ))}
            </select>

            <input
              type="tel"
              className="flex-1 px-3 border-2 py-2 border-gray-900 focus:border-blue-500 focus:ring-2 rounded-lg text-gray-700"
              placeholder="Enter your phone number"
              name="phone_number"
              value={formikRegister.values.phone_number}
              onChange={formikRegister.handleChange}
              onBlur={formikRegister.handleBlur}
            />
            </div>
          
          {formikRegister.touched.phone_number && formikRegister.errors.phone_number && (
            <div className="text-sm text-red-500">{formikRegister.errors.phone_number}</div>
          )}
        </div>

        <div className="my-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            value={formikRegister.values.password}
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            type="password"
            id="password"
            name="password"
            className="mt-1 w-full rounded-md border-2 py-2 px-3 border-gray-900 focus:border-blue-500 focus:ring-2 bg-white text-sm text-gray-700 shadow-xs"
          />
          {formikRegister.touched.password && formikRegister.errors.password && (
            <div className="text-sm text-red-500">{formikRegister.errors.password}</div>
          )}
        </div>

        <div className="my-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <select
            value={formikRegister.values.country}
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            id="country"
            name="country"
            className="mt-1 w-full rounded-md border-2 py-2 px-3 border-gray-900 focus:border-blue-500 focus:ring-2 bg-white text-sm text-gray-700 shadow-xs"
          >
            <option value="">Select a country</option>
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
          {formikRegister.touched.country && formikRegister.errors.country && (
            <div className="text-sm text-red-500">{formikRegister.errors.country}</div>
          )}
        </div>

        <div className="my-4">
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">Birth Date</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formikRegister.values.birth_date}
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            className="mt-1 w-full rounded-md border-2 py-2 px-3 border-gray-900 focus:border-blue-500 focus:ring-2 bg-white text-sm text-gray-700 shadow-xs"
          />
          {formikRegister.touched.birth_date && formikRegister.errors.birth_date && (
            <div className="text-sm text-red-500">{formikRegister.errors.birth_date}</div>
          )}
        </div>

        <div className="my-4 sm:flex sm:items-center sm:gap-4">
          <button
            className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:ring-3 focus:outline-hidden"
            disabled={loading} 
            type='submit'>
            Create an account
          </button>

          <p className="mt-4 text-sm text-gray-500 sm:mt-0">
            Already have an account?
            <NavLink to="/login" className="text-blue-700 px-3 underline">Log in</NavLink>.
          </p>
        </div>

      </form>
    </section>
    <Footer/>
  </>)
}