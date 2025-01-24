import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import SidePanel from "../components/SidePanel";
import TodoList from "./TodoList";
import Header from "../components/Header";

const DashBoardPage = () => {
  return (
    <div>
      <SidePanel />
      <Header />
    </div>
  );
};

export default DashBoardPage;
