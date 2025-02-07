import React, { useContext } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import ContactUs from './Components/ContactUs/ContactUs'
import ForgotPass from './Authentication/ForgotPass/ForgotPass'
import Login from './Authentication/Login/Login'
import Logout from './Authentication/Logout/Logout'
import Register from './Authentication/Register/Register'
import Classes from './Components/Classes/Classes'
import Activation from "./Components/Activation/Activation"; 
import ActivationPass from './Components/Activation/ActivationPass'
import useAuthCheck from './Custom Hooks/useAuthCheck'
  import { userContext } from './Context/UserContext'
  import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
let { settoken } = useContext(userContext);


  useAuthCheck(settoken); 


  let paths =createBrowserRouter ([
    {
      path:"",
      element:<Layout/> ,
      children:[
        {index:true,element:<Home/>},
        { path: "contact", element: <ContactUs /> },
        {path:"login" ,element:<Login/>},
        { path: "register", element: <Register /> },
        { path: "logout", element: <Logout /> },
        { path: "forgotpass", element: <ForgotPass /> },
        { path: "classes", element: <Classes /> },
        {path:"activate/:id/:token" ,element:<Activation/>}, 
        {path:"password-reset-confirm/:id/:token" ,element:<ActivationPass/>} 





      ]
    }

  ])
  return (
<>

<ToastContainer />
<RouterProvider router={paths}/>
  </>
  )
}
