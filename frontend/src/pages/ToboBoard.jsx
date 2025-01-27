import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import SidePanel from "../components/SidePanel";

const TodoBoard = () => {
  const initialData = [
    { id: 1, title: "Task 1", status: "Todo" },
    { id: 2, title: "Task 2", status: "In-progress" },
    { id: 3, title: "Task 3", status: "Done" },
  ];

  const [todoData, setTodoData] = useState(
    initialData.filter((t) => t.status === "Todo")
  );
  const [inProgressData, setInProgressData] = useState(
    initialData.filter((t) => t.status === "In-progress")
  );
  const [doneData, setDoneData] = useState(
    initialData.filter((t) => t.status === "Done")
  );

  const getRowId = (params) => params.data.id;

  const handleRowDrop = (event, targetGrid, setTargetData, setSourceData) => {
    const movingRow = event.api.getSelectedNodes()[0]?.data;

    if (movingRow) {
      setSourceData((prev) => prev.filter((row) => row.id !== movingRow.id));
      setTargetData((prev) => [...prev, { ...movingRow, status: targetGrid }]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SidePanel />
      <div className="TodoBoard py-24 w-full">
        <h1 className="text-4xl p-4">Todo Board..!!</h1>
        <div style={{ display: "flex", gap: "20px", margin: "20px" }}>
          {/* Todo Grid */}
          <div className="ag-theme-alpine" style={{ width: 300, height: 400 }}>
            <h3>Todo</h3>
            <AgGridReact
              rowData={todoData}
              columnDefs={[
                { field: "title", headerName: "Tasks", rowDrag: true },
              ]}
              getRowId={getRowId}
              rowDragManaged={true}
              animateRows={true}
              onRowDragEnd={(params) =>
                handleRowDrop(params, "In-progress", setInProgressData, setTodoData)
              }
            />
          </div>

          {/* In-progress Grid */}
          <div className="ag-theme-alpine" style={{ width: 300, height: 400 }}>
            <h3>In-Progress</h3>
            <AgGridReact
              rowData={inProgressData}
              columnDefs={[
                { field: "title", headerName: "Tasks", rowDrag: true },
              ]}
              getRowId={getRowId}
              rowDragManaged={true}
              animateRows={true}
              onRowDragEnd={(params) =>
                handleRowDrop(params, "Done", setDoneData, setInProgressData)
              }
            />
          </div>

          {/* Done Grid */}
          <div className="ag-theme-alpine" style={{ width: 300, height: 400 }}>
            <h3>Done</h3>
            <AgGridReact
              rowData={doneData}
              columnDefs={[
                { field: "title", headerName: "Tasks", rowDrag: true },
              ]}
              getRowId={getRowId}
              rowDragManaged={true}
              animateRows={true}
              onRowDragEnd={(params) =>
                handleRowDrop(params, "Todo", setTodoData, setDoneData)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoBoard;
