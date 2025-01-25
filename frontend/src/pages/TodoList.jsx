import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, themeBalham } from "ag-grid-community"; // For registering modules
import { ClientSideRowModelModule } from "ag-grid-community"; // Import required module
import { useState, useEffect, useMemo, useContext } from "react";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme CSS
import { AppContent } from "../context/app.context";
import SidePanel from "../components/SidePanel";

// Register the ClientSideRowModelModule
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const TodoList = () => {
  const { getTodosList, todoslist } = useContext(AppContent); // Extracting needed functions and state
  const [rowData, setRowData] = useState([]); // Local state for grid data

  // Define column definitions for the grid
  const [colDefs] = useState([
    // { field: "id", headerName: "ID", sortable: true, filter: true },
    { field: "title", headerName: "Title", sortable: true, filter: true },
    { field: "status", headerName: "Status", sortable: true, filter: true },
    { field: "due", headerName: "Due Date", sortable: true, filter: true },
    { field: "owner", headerName: "assigned to", sortable: true, filter: true },
    {
      field: "createdAt",
      headerName: "Created on",
      sortable: true,
      filter: true,
    },
    {
      field: "updatedAt",
      headerName: "Updated on",
      sortable: true,
      filter: true,
    },
  ]);

  // Fetch todos list on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      await getTodosList(); // Call context function to fetch todos
    };
    fetchTodos();
  }, [getTodosList]);

  useEffect(() => {
    const transformedData = todoslist.map((todo) => ({
      title: todo.title,
      status: todo.status,
      createdAt: new Date(todo.createdAt).toLocaleString(),
    }));
    setRowData(transformedData);
  }, [todoslist]);

  return (
    <div className='flex h-screen overflow-hidden'>
      <SidePanel />
      <div className="TodoList py-24 w-full">
        <h1 className="text-4xl p-3">TodoList..!!</h1>
        <div
          className="ag-theme-alpine p-2"
          style={{ height: "80%", width: "100%" }}
        >
          <AgGridReact
            domLayout="autoHeight"
            // onGridReady={onGridReady}
            rowData={rowData}
            columnDefs={colDefs}
            animateRows={true}
            defaultColDef={{ resizable: true }} // Make columns resizable
          />
        </div>
      </div>
    </div>
  );
};

export default TodoList;
