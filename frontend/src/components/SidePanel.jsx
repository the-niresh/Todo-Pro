import { BellDot, CircleUserRound, CircuitBoard, ListTodo, Menu } from "lucide-react";
import { useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/app.context";
import toast from "react-hot-toast";
import axios from "axios";

const SidePanel = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { backendURL, setIsLoggedIn, getUserData } = useContext(AppContent);

  // functions for each item APi call
  const onClickTodoList = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/todo/getAll`, { withCredentials: true });
      if (data.success) {
        setIsLoggedIn(true);
        navigate("/todo-list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch Todo List");
    }
  };

  const onClickTodoBoard = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/board/getAll`, { withCredentials: true });
      if (data.success) {
        navigate("/todo-board");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch Todo Board");
    }
  };

  const onClickNotifications = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/notifications`, { withCredentials: true });
      if (data.success) {
        toast.success("Fetched Notifications");
        navigate("/notifications");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch Notifications");
    }
  };

  const onClickProfile = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/profile`, { withCredentials: true });
      if (data.success) {
        getUserData();
        navigate("/profile");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch Profile");
    }
  };

  
  const SIDEBAR_ITEMS = [
    { name: "Todo list..!!", icon: ListTodo, color: "#6366f1", href: "/todo-list", onClick: onClickTodoList },
    { name: "Todo board..!!", icon: CircuitBoard, color: "#8B5CF6", href: "/todo-board", onClick: onClickTodoBoard },
    { name: "Notifications", icon: BellDot, color: "#EC4899", href: "/notifications", onClick: onClickNotifications },
    { name: "Profile", icon: CircleUserRound, color: "#10B981", href: "/profile", onClick: onClickProfile }
  ];

  return (
    <motion.div
      className={`relative z-50 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        {/* Sidebar toggle button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        {/* Navigation Links */}
        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <motion.div
              key={item.href}
              className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 cursor-pointer"
              onClick={item.onClick}
            >
              <item.icon
                size={20}
                style={{ color: item.color, minWidth: "20px" }}
              />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    className="ml-4 whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default SidePanel;
