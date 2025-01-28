import { useNavigate } from "react-router-dom";
import SidePanel from "../components/SidePanel";
import axios from "axios";
import { useContext, useState } from "react";
import { AppContent } from "@/context/app.context";
import toast from "react-hot-toast";

const DashBoardPage = () => {
  const navigate = useNavigate();
  const { backendURL } = useContext(AppContent);

  const [activeForm, setActiveForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoData, setTodoData] = useState({
    title: "",
    description: "",
    status: "Todo",
    due: "",
    owner: "",
  });
  const [teamData, setTeamData] = useState({
    teamName: "",
    teamImg: "",
    users: [],
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name === "users") {
      setTeamData((prev) => ({
        ...prev,
        [name]: value.split(","),
      }));
    } else {
      setTodoData((prev) => ({ ...prev, [name]: value }));
      setTeamData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateTODO = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendURL + "/api/todo/create",
        todoData
      );
      if (data.success) {
        toast.success("Todo created successfully!");
        setTodoData({
          title: "",
          description: "",
          status: "todo",
          due: "",
          owner: "",
        });
        // setIsModalOpen(false);
        setActiveForm(null);
      }
    } catch (error) {
      toast.error("Failed to create Todo");
    }
  };

  const handleCreateTEAM = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendURL + "/api/team/create",
        teamData
      );
      if (data.success) {
        toast.success("Team created successfully!");
        setTeamData({ teamName: "", teamImg: "", users: [] });
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to create Team");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <SidePanel />
      {/* Main Content */}
      <div
        className={`${
          isModalOpen ? "blur-sm" : ""
        } flex flex-col items-center mt-20 px-96 p-32 text-center text-gray-800`}
      >
        <img
          src="/header_img.png"
          alt="header_img"
          className="w-36 h-36 rounder-full mb-6"
        />
        <h1 className="text-xl font-bold">Todo App</h1>
        <button
          onClick={() => setActiveForm("todo")}
          className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Todo
        </button>
        <button
          onClick={() => setActiveForm("team")}
          className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Team
        </button>
      </div>

      {/* Modal */}
      {activeForm === "todo" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Create Todo</h2>
            <form onSubmit={handleCreateTODO}>
              {/* Todo Fields */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required={true}
                  value={todoData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter todo title"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={todoData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={todoData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Todo">Todo</option>
                  <option value="In-progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  name="due"
                  value={todoData.due}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Owner
                </label>
                <input
                  type="text"
                  name="owner"
                  value={todoData.owner}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter owner name"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveForm(null)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Team Fields */}
      {activeForm === "team" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4 mt-6">Create Team</h2>
            <form onSubmit={handleCreateTEAM}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Team Name
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={teamData.teamName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Team Image URL
                </label>
                <input
                  type="text"
                  name="teamImg"
                  value={teamData.teamImg}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team image URL"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Add Users (separated usernames)
                </label>
                <input
                  type="text"
                  name="users"
                  value={teamData.users.join(",")}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter user emails"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveForm(null)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoardPage;
