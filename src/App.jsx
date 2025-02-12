import React, { useContext } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import ContactUs from './Components/ContactUs/ContactUs'
import ForgotPass from './Authentication/ForgotPass/ForgotPass'
import Login from './Authentication/Login/Login'
import Register from './Authentication/Register/Register'
import Classes from './Components/Classes/Classes'
import Activation from "./Components/Activation/Activation"; 
import ActivationPass from './Components/Activation/ActivationPass'
import useAuthCheck from './Custom Hooks/useAuthCheck'
import { userContext } from './Context/UserContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './Context/ThemeContext';
import Resources from './Components/Resources/Resources'
import Systems from './Components/Systems/Systems'
import BooksList from './Components/BooksList/BooksList'
import Profile from './Components/Profile/Profile'
import MyBooks from './Components/MyBooks/MyBooks'
import PDFViewer from './Components/PdfViewer/PdfViewer'
import AllLectures from './Components/Lectures/AllLectures'
import QuestionBank from './Components/Questions/QuestionBank'
import MyLectures from './Components/MyLectures/MyLectures'
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
        { path: "forgotpass", element: <ForgotPass /> },
        { path: "classes", element: <Classes/> },
        {path:"activate/:id/:token" ,element:<Activation/>}, 
        {path:"password-reset-confirm/:id/:token" ,element:<ActivationPass/>} ,
        {path:"/resources/:yearId" ,element:<Resources/>},
        {path:"/systems/:yearId/:resourceId", element:<Systems/>},
        {path: "/systems/:yearId/2/:systemId", element: <BooksList/> },
        {path: "/systems/:yearId/1/:systemId", element: <AllLectures/> },
       {path: "/systems/:yearId/3/:systemId", element: <QuestionBank/> }, 
        {path:"profile" ,element:<Profile/>}, 
        {path:"mybooks" ,element:<MyBooks/>}, 
        {path:"pdf-viewer" ,element:<PDFViewer/>}, 
        {path:"mylectures" ,element:<MyLectures/>}, 




             




      ]
    }

  ])
  return (
<>
<ThemeProvider>

<ToastContainer />

<RouterProvider router={paths}/>
</ThemeProvider>
  </>
  )
}
