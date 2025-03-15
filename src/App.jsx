import React, { useContext, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import useAuthCheck from './Custom Hooks/useAuthCheck';
import { userContext } from './Context/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './Context/ThemeContext';
import { ReferFriendModalProvider } from './Context/ReferContext';
import ErrorBoundary from './Components/ErrorBoundry/ErrorBoundry';
import ErrorPage from './Components/ErrorPage/ErrorPage';

const Home = React.lazy(() => import('./Components/Home/Home'));
const ContactUs = React.lazy(() => import('./Components/ContactUs/ContactUs'));
const ForgotPass = React.lazy(() => import('./Authentication/ForgotPass/ForgotPass'));
const Login = React.lazy(() => import('./Authentication/Login/Login'));
const Register = React.lazy(() => import('./Authentication/Register/Register'));
const Classes = React.lazy(() => import('./Components/Classes/Classes'));
const Activation = React.lazy(() => import('./Components/Activation/Activation'));
const ActivationPass = React.lazy(() => import('./Components/Activation/ActivationPass'));
const Resources = React.lazy(() => import('./Components/Resources/Resources'));
const Systems = React.lazy(() => import('./Components/Systems/Systems'));
const BooksList = React.lazy(() => import('./Components/BooksList/BooksList'));
const AllLectures = React.lazy(() => import('./Components/Lectures/AllLectures'));
const QuestionBank = React.lazy(() => import('./Components/Questions/QuestionBank'));
const Profile = React.lazy(() => import('./Components/Profile/Profile'));
const MyBooks = React.lazy(() => import('./Components/MyBooks/MyBooks'));
const PDFViewer = React.lazy(() => import('./Components/PdfViewer/PdfViewer'));
const MyLectures = React.lazy(() => import('./Components/MyLectures/MyLectures'));
const CreateTest = React.lazy(() => import('./Components/CreateTest/CreateTest'));
const DisplayNotes = React.lazy(() => import('./Components/DisplayNotes/DisplayNotes'));
const TestCard = React.lazy(() => import('./Components/TestCard/TestCard'));
const Test = React.lazy(() => import('./Components/Test/Test'));
const Displayflashcards = React.lazy(() => import('./Components/DisplayFlashCards/DisplayFlash'));
const MarkedQuestion = React.lazy(() => import('./Components/MarkedQuestion/MarkedQuestion'));
const ResetAccount = React.lazy(() => import('./Components/ResetAcc/ResetAcc'));
const Performance = React.lazy(() => import('./Components/Performance/Performance'));

export default function App() {
  let { settoken } = useContext(userContext);
  useAuthCheck(settoken);

  let paths = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> , errElement: <ErrorPage /> },
        { path: "contact", element: <ContactUs />, errElement: <ErrorPage /> },
        { path: "login", element: <Login /> , errElement: <ErrorPage /> },
        { path: "register", element: <Register /> , errElement: <ErrorPage /> },
        { path: "forgotpass", element: <ForgotPass /> , errElement: <ErrorPage /> },
        { path: "classes", element: <Classes />, errElement: <ErrorPage />  },
        { path: "activate/:id/:token", element: <Activation /> , errElement: <ErrorPage /> },
        { path: "password-reset-confirm/:id/:token", element: <ActivationPass />, errElement: <ErrorPage />  },
        { path: "/resources/:yearId", element: <Resources /> , errElement: <ErrorPage />  },
        { path: "/systems/:yearId/:resourceId", element: <Systems /> , errElement: <ErrorPage />  },
        { path: "/systems/:yearId/2/:systemId", element: <BooksList /> , errElement: <ErrorPage />  },
        { path: "/systems/:yearId/1/:systemId", element: <AllLectures /> , errElement: <ErrorPage />  },
        { path: "/questionBank/:yearId", element: <QuestionBank /> , errElement: <ErrorPage />  },
        { path: "profile", element: <Profile /> , errElement: <ErrorPage />  },
        { path: "mybooks", element: <MyBooks /> , errElement: <ErrorPage />  },
        { path: "pdf-viewer", element: <PDFViewer /> , errElement: <ErrorPage />  },
        { path: "mylectures", element: <MyLectures /> , errElement: <ErrorPage />  },
        { path: "createTest/:yearId", element: <CreateTest /> , errElement: <ErrorPage />  },
        { path: "/test/:yearId", element: <Test /> , errElement: <ErrorPage />  },
        { path: "displayNotes/:yearId", element: <DisplayNotes /> , errElement: <ErrorPage />  },
        { path: "testCard/:yearId", element: <TestCard /> , errElement: <ErrorPage />  },
        { path: "marked/:yearId", element: <MarkedQuestion /> , errElement: <ErrorPage />  },
        { path: "displayFlashCards/:yearId", element: <Displayflashcards /> , errElement: <ErrorPage />  },
        { path: "resetAcc/:yearId", element: <ResetAccount /> , errElement: <ErrorPage />  },
        { path: "performance/:yearId", element: <Performance /> , errElement: <ErrorPage />  },
        { path: "*", element: <ErrorPage/> , errElement: <ErrorPage />  },

      ]
    }
  ]);

  return (
    <>
      <ThemeProvider>
        <ToastContainer />
        <ReferFriendModalProvider>
          <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>
            <RouterProvider router={paths} />
            </ErrorBoundary>
          </Suspense>
        </ReferFriendModalProvider>
      </ThemeProvider>
    </>
  );
}
