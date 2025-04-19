import Navbar from "./components/Navbar";
import HomePage from "./pages/Homepage";
import SettingsPage from "./pages/SettingsPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import {Routes,Route, Navigate} from "react-router-dom";
import { useEffect } from "react";
//import { axiosInstance } from "./lib/axios";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import {Loader} from "lucide-react";
import { Toaster } from "react-hot-toast";
const App = () => {
  //destructure unpack elements from arry/props object into distinct variables

  //call hook and detsructure state/function(authUser) whatever that value and grab it
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}= useAuthStore();
  const { theme } = useThemeStore();

  console.log({onlineUsers});
//  // check if user is authenticated or not when app loads
// calling twice in cnsole bcoz of react strict mode 
  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

  console.log({authUser});
  // loading state while that loads
  //in 1 second it loads and understand user not logedin so it just renders application
  if(isCheckingAuth && !authUser)
    return  (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
 //  axiosInstance.interceptors.response.use
 // get put post requests
 //zustand gsm state for authenticated userr used in all pages instead of creatinh here create authstore
 //whenever state changes it updates ui
  return(<div data-theme={theme} >
    <Navbar/>


    <Routes>
    <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

    </Routes>

    <Toaster/>
   </div>)};

export default App;
// if authenticated(loggedin) homepage not--login
// if authenticated(loggedin) homepage not loggedin then signup,login