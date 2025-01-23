import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import { Toaster } from "react-hot-toast";
import SidePanel from "./components/SidePanel";
import { useContext } from "react";
import { AppContent } from "./context/app.context";
import DashBoardPage from "./pages/DashBoardPage";

export default function App() {
  const {userData} = useContext(AppContent)
  return (
    <div>
      {/* bg-gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
      {/* <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div> */}

      
      {/* <Navbar /> */}
      {/* <SidePanel /> */}
      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={! userData ? <LoginPage /> : !userData.isUserVerified ? <EmailVerifyPage /> : <DashBoardPage />} />
        <Route path="/email-verify" element={!userData ? <LoginPage /> : !userData.isUserVerified ? <EmailVerifyPage /> : <DashBoardPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<DashBoardPage />} />
      </Routes>
      {/* <Footer /> */}

      <Toaster />
    </div>
  );
}
