import { useContext } from "react";
import { AppContent } from "../context/app.context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Header = () => {
  const navigate = useNavigate();
  const {userData, backendURL} = useContext(AppContent);
  
  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
        <img src="/header_img.png" alt="header_img" className="w-36 h-36 rounder-full mb-6" />
        <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
            Hey {userData ? userData.fullName : "Developer"}.!!
            <img src="hand_wave.png" alt="hand_wave" className="w-8 aspect-square" />
        </h1>
        <h2 className="text-3xl sm:text-5xl font-semibold mb-4">Welcome to Todo-Pro..!!</h2>
        <p className="mb-8 max-w-md ">Let's organize our Todo-lists collaboratively like a pro..!!</p>
        <button className="border border-gray-500 rounded-full px-8 pu-2.5 hover:bg-gray-100 transition-all"
        onClick={userData.isUserVerified ? ()=> navigate("/dashboard") : ()=> navigate("/email-verify")}>{userData ? userData.isUserVerified ? "Dashboard..!!" : "Verify Email" : "Get Started..!!"}</button>
    </div>
  )
}

export default Header