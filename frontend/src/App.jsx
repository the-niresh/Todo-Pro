import { Route, Routes, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import Navbar from "./components/Navbar";

import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AppContent } from "./context/app.context";
import DashBoardPage from "./pages/DashBoardPage";
import TodoList from "./pages/TodoList";
import SidePanel from "./components/SidePanel";

export default function App() {
  const {userData} = useContext(AppContent)
  const location = useLocation();
  
  return (
    <div className="flex h-screen">
      {!userData.isUserVerified && 
      (<div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>)}
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!userData ? <LoginPage /> : !userData.isUserVerified ? <EmailVerifyPage /> : <HomePage />} />
        <Route path="/email-verify" element={!userData ? <LoginPage /> : !userData.isUserVerified ? <EmailVerifyPage /> : <HomePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={!userData.isUserVerified ? <EmailVerifyPage /> : <DashBoardPage />} />
        <Route path='/todo-list' element={<TodoList />} />
				<Route path='/todo-board' element={<TodoList />} />
				<Route path='/notifications' element={<TodoList />} />
				<Route path='/profile' element={<TodoList />} />
      </Routes>

      <Toaster />
    </div>
  );
}
