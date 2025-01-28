import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  PaginationModule,
  ValidationModule,
  createGrid,
  ClientSideRowModelModule,
} from "ag-grid-community";

import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { useState, useEffect, useContext } from "react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AppContent } from "../context/app.context";
import SidePanel from "../components/SidePanel";
import axios from "axios";
import toast from "react-hot-toast";

ModuleRegistry.registerModules([
  PaginationModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  ValidationModule,
  ClientSideRowModelModule
]);

const TodoList = () => {
  const { getTodosList, todoslist, backendURL } = useContext(AppContent);
  const [rowData, setRowData] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null); // State for selected todo
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define column definitions for the grid
  const [colDefs] = useState([
    { field: "title", headerName: "Title", sortable: true, filter: true },
    { field: "status", headerName: "Status", sortable: true, filter: true },
    { field: "due", headerName: "Due Date", sortable: true, filter: true },
    { field: "owner", headerName: "Owner", sortable: true, filter: true },
    { field: "createdAt", headerName: "Created on", sortable: true, filter: true },
    { field: "updatedAt", headerName: "Updated on", sortable: true, filter: true },
    { field: "description", headerName: "Description" },
  ]);

  useEffect(() => {
    const fetchTodos = async () => {
      await getTodosList();
    };
    fetchTodos();
  }, [getTodosList]);

  useEffect(() => {
    const transformedData = todoslist.map((todo) => ({
      title: todo.title,
      status: todo.status,
      owner: todo.owner,
      due: todo.due,
      description: todo.description,
      createdAt: new Date(todo.createdAt).toLocaleString(),
      updatedAt: new Date(todo.updatedAt).toLocaleString(),
      id: todo.id,
    }));
    setRowData(transformedData);
  }, [todoslist]);

  // Handler for click event
  const onRowClick = (event) => {
    setSelectedTodo(event.data);
    setIsModalOpen(true);
  };

  const onClickCancel = () => {
    setSelectedTodo(null);
    setIsModalOpen(false);
  };

  const onClickDelete = async (event) => {
    event.preventDefault();
    const todoId = selectedTodo.id;
    try {
      const { data } = await axios.delete(`${backendURL}/api/todo/${todoId}`);
      if (data.success) {
        toast.success("Todo deleted successfully!");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to delete Todo");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SidePanel />
      <div className="TodoList py-24 w-full">
        <h1 className="text-4xl p-3">TodoList..!!</h1>
        <div
          className="ag-theme-alpine p-2"
          style={{ height: "80%", width: "100%" }}
        >
          <AgGridReact
            domLayout="autoHeight"
            rowData={rowData}
            columnDefs={colDefs}
            animateRows={true}
            defaultColDef={{
              resizable: true,
              cellStyle: { padding: "20px" },
            }}
            rowStyle={{
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onRowClicked={onRowClick}
            pagination={true}
            paginationPageSize={20}
            suppressPaginationPanel={false}
          />
        </div>

        {/* Display the form/modal if a todo is selected */}
        {selectedTodo && (
          <div className="todo-detail-form fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-lg font-bold mb-4">Todo Details</h2>
              <form>
                <div>
                  <label>Title: </label>
                  <input type="text" value={selectedTodo.title} readOnly />
                </div>
                <div>
                  <label>Status: </label>
                  <input type="text" value={selectedTodo.status} readOnly />
                </div>
                <div>
                  <label>Owner: </label>
                  <input type="text" value={selectedTodo.owner} readOnly />
                </div>
                <div>
                  <label>Due Date: </label>
                  <input type="text" value={selectedTodo.due} readOnly />
                </div>
                <div>
                  <label>Description: </label>
                  <input
                    type="text"
                    value={selectedTodo.description}
                    readOnly
                  />
                </div>
                <div>
                  <label>Created On: </label>
                  <input type="text" value={selectedTodo.createdAt} readOnly />
                </div>
                <div>
                  <label>Updated On: </label>
                  <input type="text" value={selectedTodo.updatedAt} readOnly />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onClickDelete}
                    className="mr-2 px-4 py-2 rounded-lg bg-red-400 hover:bg-red-500"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={onClickCancel}
                    className="mr-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Edit/Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
