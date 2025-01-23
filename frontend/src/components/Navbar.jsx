import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, Search } from "lucide-react";
import { FcTodoList } from "react-icons/fc";
import { useState, useEffect, useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { AppContent } from "../context/app.context";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode, setIsLoggedIn, setUserData] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() 
  
  const {userData ,backendURL} = useContext(AppContent)

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendURL + "/api/auth/logout")
      console.log("data",data)
      data.success && setIsLoggedIn(false)
      data.success && setUserData(false)
      navigate("/")
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setIsDarkMode(currentTheme === "light");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    const newTheme = !isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme; // Apply the theme to body
  };

  return (
    <header className="w-full flex justify-between p-4 sm:px-24 top-0 sm:p-6 absolute">
    {/* className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-16"> */}
      <div className="flex items-center gap-2">
        <Link to="/">
          <FcTodoList className="size-10" />
        </Link>
        <Link to="/">
          <h1 className="text-2xl font-bold">Todo-Pro..!!</h1>
        </Link>
      </div>

      
      {/* right side */}
      {userData ? 
      (<div className="flex items-center gap-2">
      
      <Link to={"/"}>
        <Search className="size-6 cursor-pointer" />
      </Link>

      <LogOut className="size-6 cursor-pointer" />

      <div>
        <Menu className="size-6 cursor-pointer" />
      </div>

      <button onClick={toggleTheme} className="ml-4 p-2 rounded bg-white border-black hover:bg-gray-300">
            {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>
      
      <div className="flex justify-center items-center rounded cursor-pointer relative group">
        <img
          src="/avatar1.png"
          alt="user"
          className="h-8 w-8" />
        <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
          <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
            {/* <li className="px-2 py-1 hover:bg-gray-300 cursor-pointer">Logout</li> */}
            <li onClick={logout} className="px-2 py-1 hover:bg-gray-300 cursor-pointer">Logout</li>
          </ul>
        </div>
      </div>

      <p className="text-l">Admin/User</p>
    </div>) : location.pathname !== '/login'?  (
      <button className="flex items-center gap-4 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all" onClick={() => navigate("/login")}>
        Login..!!
      </button>
    ) : (<div></div>)
  }
      
    </header>
  );
};

export default Navbar;
