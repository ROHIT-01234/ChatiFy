import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { useAuthStore } from './store/useAuthStore'
import { CloudSnow, Loader } from 'lucide-react'
import {Toaster} from 'react-hot-toast'


function App() {

  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  console.log(onlineUsers);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  // show loading while authenticating
  if (isCheckingAuth && !authUser) {
      return (
      <div className="flex items-center justify-center h-screen">
        {/* lucide-react for icons */}
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }


  return (
    <div>

      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />  {/* authenticated user hai to homepage pe nhi to loginpage pe */}
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>

    <Toaster/>
    </div>
  )
}

export default App
