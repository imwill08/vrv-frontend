import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Table, Modal, Button, Form } from "react-bootstrap";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import { format, isAfter, set } from 'date-fns';

const columnHelper = createColumnHelper();

function CheckTable() {
  const [users, setUser] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch leave data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      fetchLeaveData(user.emp_code);
    }
  }, []);

  const fetchLeaveData = async (employeeCode) => {
    try {
      const response = await axios.get(`https://vrv-backend-ut2g.onrender.com/leavedetails/${employeeCode}`);
      if (response.data && Array.isArray(response.data)) {
        setLeaveData(response.data);
      } else {
        setLeaveData([]); // Fallback in case response data is not an array
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave data:", error); 
      setLeaveData([]); // Fallback in case of error
      setLoading(false);
    }
  };

  const handleEdit = (leave) => {
    // Redirect to the edit page with the leave data passed as route state
    navigate(`/user/leave/${leave.id}`, { state: { leave } });
  };

  const handleDelete = async (leave) => {
    if (window.confirm('Do you want to delete this leave application?')) {
      try {
        await axios.delete(`https://vrv-backend-ut2g.onrender.com/leavedetails/delete/${leave.id}`, { data: leave });
        alert('Leave detail deleted successfully');
        fetchLeaveData(users.emp_code);
      } catch (error) {
        console.error("Error deleting leave data:", error);
        alert('Failed to delete leave detail. Please try again later.');
      }
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const columns = [
    columnHelper.accessor("emp_code", {
      header: () => <p className="text-sm font-bold text-gray-600">Emp Code</p>,
      cell: (info) => <p className="text-sm font-bold">{info.getValue()}</p>,
    }),
    columnHelper.accessor("name", {
      header: () => <p className="text-sm font-bold text-gray-600">Name</p>,
      cell: (info) => <p className="text-sm font-bold">{info.getValue()}</p>,
    }),
    columnHelper.accessor("leavetype", {
      header: () => <p className="text-sm font-bold text-gray-600">Leave Type</p>,
      cell: (info) => <p className="text-sm font-bold">{info.getValue()}</p>,
    }),
    columnHelper.accessor("applied_leave_dates", {
      header: () => <p className="text-sm font-bold text-gray-600">Applied Date</p>,
      cell: (info) => <p className="text-sm font-bold">{formatDate(info.getValue())}</p>,
    }),
    
    columnHelper.accessor("startdate", {
      header: () => <p className="text-sm font-bold text-gray-600">Start Date</p>,
      cell: (info) => <p className="text-sm font-bold">{formatDate(info.getValue())}</p>,
    }),
    columnHelper.accessor("enddate", {
      header: () => <p className="text-sm font-bold text-gray-600">End Date</p>,
      cell: (info) => <p className="text-sm font-bold">{formatDate(info.getValue())}</p>,
    }),
    columnHelper.accessor("status", {
      header: () => <p className="text-sm font-bold text-gray-600">Status</p>,
      cell: (info) => (
        <span className={`px-2 py-1 text-xs font-bold rounded ${
          info.getValue() === "Approved"
            ? "bg-green-500 text-white"
            : info.getValue() === "Pending"
            ? "bg-yellow-500 text-white"
            : "bg-red-300 text-white"
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("actions", {
      header: () => <p className="text-sm font-bold text-gray-600">Actions</p>,
      cell: ({ row }) => {
        const leave = row.original;
    
        // Get today's date and set time to 10:30 am
        const today = new Date();
        const todayAt1030 = set(today, { hours: 10, minutes: 30, seconds: 0, milliseconds: 0 });
    
        // Check if leave's start date is yesterday and the current time is past 10:30 am
        const isLeaveDatePassed = new Date(leave.startdate) < today;
        const isAfter1030 = isAfter(today, todayAt1030);
    
        // Disable actions if it’s the day after leave was applied and past 10:30 am
        const disableActions = isLeaveDatePassed && isAfter1030;

        
        return (
          <div className="actions">
            <button
              className={`edit-button px-4 py-2 mr-2 font-bold text-white bg-green-500 rounded ${disableActions ? "opacity-50 cursor-not-allowed" : ""}`}
              // disabled={disableActions}
            >
              Edit
            </button>
            <button
              className={`cancel-button px-4 py-2 font-bold text-white bg-red-500 rounded ${disableActions ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={disableActions}
            >
              Cancel
            </button>
          </div>
        );
        
      },
    }),
    
  ];

  const table = useReactTable({
    data: leaveData,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        {/* <div className="text-xl font-bold text-navy-700 dark:text-white">
          User Leaves
        </div> */}
        {/* <CardMenu /> */}
      </header>

      <div className="mt-0 overflow-x-scroll xl:overflow-x-scroll">
        <table className="w-full min-w-max">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                    <div className="items-center justify-between text-xs text-gray-200">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {leaveData && leaveData.length > 0 ? (
              table.getRowModel()?.rows?.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="min-w-[75px] border-white/0 py-3 pr-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>No leave data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default CheckTable;
