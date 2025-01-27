import { useContext } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { AppContent } from "@/context/app.context";
import SidePanel from "@/components/SidePanel";

const HomePage = () => {
  const {userData} = useContext(AppContent)
  return (
    <div className="absolute inset-0 -z-100 h-full w-full">
      {userData && <SidePanel />}
      <Header />
    </div>
  )
}

export default HomePage