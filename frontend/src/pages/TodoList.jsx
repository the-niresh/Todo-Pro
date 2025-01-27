import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { useState, useEffect, useMemo, useContext } from "react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AppContent } from "../context/app.context";
import SidePanel from "../components/SidePanel";

// Register the ClientSideRowModelModule
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const TodoList = () => {
  const { getTodosList, todoslist } = useContext(AppContent);
  const [rowData, setRowData] = useState([]);

  // Define column definitions for the grid
  const [colDefs] = useState([
    // { field: "id", headerName: "ID", sortable: true, filter: true },
    { field: "title", headerName: "Title", sortable: true, filter: true },
    { field: "status", headerName: "Status", sortable: true, filter: true },
    { field: "due", headerName: "Due Date", sortable: true, filter: true },
    { field: "owner", headerName: "Owner", sortable: true, filter: true },
    { field: "createdAt", headerName: "Created on", sortable: true, filter: true, },
    { field: "updatedAt", headerName: "Updated on", sortable: true, filter: true, },
  ]);

  // Fetch todos list on component mount
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
            defaultColDef={{ resizable: true }} // resizable
          />
        </div>
      </div>
    </div>
  );
};

export default TodoList;
