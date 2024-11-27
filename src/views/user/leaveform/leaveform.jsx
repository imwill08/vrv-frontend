import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import festivaldata from "../festivalData";
import "../../../assets/css/LeaveForm.css"
const LeaveForm = ({ festivalData: propFestivalData }) => {
  const [festivalData, setFestivalData] = useState(festivaldata);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState([]);
  const [applyDate, setApplyDate] = useState([]);
  const [users, setUser] = useState(null);
  const [empCode, setEmpCode] = useState();
  const [loading, setLoading] = useState(true);
  const [depart, setDepart] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [leaveDuration, setLeaveDuration] = useState("full");
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEmpCode(parsedUser.emp_code);
      setEmail(parsedUser.email);
      setDepart(parsedUser.department);
    }

    const employeeCode = JSON.parse(storedUser).emp_code;
    if (employeeCode) {
      fetchLeaveData(employeeCode);
    }
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayDate = getCurrentDate();

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const fetchLeaveData = async (employeeCode) => {
    try {
      setLoading(true);
      const url = `https://vrv-backend-ut2g.onrender.com/leavedetails/${employeeCode}`;
      const response = await axios.get(url);
      const leaveDates = response.data.map((leave) =>
        formatDate(leave.applied_leave_dates)
      );
      setApplyDate(leaveDates);
      setLeaveData(response.data);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 for Sunday, 6 for Saturday
  };

  const isFestival = (date) => {
    const formattedDate = date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
    const isFestivalDate = festivalData.some(festival => {
      try {
        const [day, month, year] = festival.date.split('-');
        const festivalDate = new Date(`${year}-${month}-${day}`);
        const formattedFestivalDate = festivalDate.toISOString().slice(0, 10);
        if (isNaN(festivalDate.getTime())) {
          return false;
        }

        return formattedDate === formattedFestivalDate;
      } catch (error) {
        return false;
      }
    });

    return isFestivalDate;
  };

  const countWeekdays = (start, end) => {
    let count = 0;
    let current = new Date(start);
    while (current <= end) {
      if (!isWeekend(current) && !isFestival(current)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    if (!startDate || !endDate) {
      alert("Please provide valid start and end dates.");
      setLoadingSubmit(false);
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert("Invalid date format. Please select valid dates.");
      setLoadingSubmit(false);
      return;
    }
    if (leaveDuration !== "full" && startDate !== endDate) {
      alert("For a half-day leave, the start date and end date must be the same.");
      setLoadingSubmit(false);
      return;
    }

    const daysOfLeave = leaveDuration === "full" ? countWeekdays(start, end) : 0.5;
    const leaveRequest = {
      name: users ? users.name : "",
      leaveType,
      empCode: empCode || "",
      startDate,
      endDate,
      daysOfLeave,
      reason,
      email,
      status: "Pending",
      total_leave: 18,
      depart,
      leaveDuration,
    };
    console.log("%%%%%0", leaveRequest);

    try {
      await axios.post("https://vrv-backend-ut2g.onrender.com/leave-applications", leaveRequest);
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/user/data-tables");
      }, 3000);
    } catch (error) {
      console.error("Error submitting leave application:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      <div className="leave-form-container">
        <h2>Leave Form Request</h2>
        {loading ? (
          <div
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "20px auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "720px",
          }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
        ) : applyDate.includes(todayDate) ? (
          <Alert
            variant="danger"
            style={{
              width: "100%",
              maxWidth: "600px",
              margin: "20px auto",
              border: "2px solid white",
              height: "130px",
            }}
          >
            You can apply for leave only once in one day.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label style={{ fontWeight: "bold" }}>Name:</Form.Label>
              <Form.Control
                type="text"
                value={users ? users.name : ""}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="leaveType">
              <Form.Label style={{ fontWeight: "bold" }}>Leave Type:</Form.Label>
              <br/>
              <Form.Select
              style={{ fontWeight: "/", width: "100%",height: "35px" }}
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
                <option value="">Please select leave type</option>
                <option value="Vacation Leave">Vacation Leave</option>
                <option value="Sick Leave/Casual leave">Sick Leave/Casual leave</option>
                <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
                <option value="Study Leave">Study Leave</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="leaveDuration">
              <Form.Label style={{ fontWeight: "bold" }}>Leave Duration:</Form.Label>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Form.Check
                  type="checkbox"
                  label="Full Day"
                  name="leaveDuration"
                  value="full"
                  checked={leaveDuration.includes("full")}
                  onChange={() => setLeaveDuration(prev =>
                    prev.includes("full") ? prev.filter(d => d !== "full") : [...prev, "full"]
                  )}
                  style={{ marginRight: "10px" }}
                />
                <Form.Check
                  type="checkbox"
                  label="First Half"
                  name="leaveDuration"
                  value="firstHalf"
                  checked={leaveDuration.includes("firstHalf")}
                  onChange={() => setLeaveDuration(prev => 
                    prev.includes("firstHalf") ? prev.filter(d => d !== "firstHalf") : [...prev, "firstHalf"]
                  )}
                  style={{ marginRight: "10px" }}
                />
                <Form.Check
                  type="checkbox"
                  label="Second Half"
                  name="leaveDuration"
                  value="secondHalf"
                  checked={leaveDuration.includes("secondHalf")}
                  onChange={() => setLeaveDuration(prev => 
                    prev.includes("secondHalf") ? prev.filter(d => d !== "secondHalf") : [...prev, "secondHalf"]
                  )}
                />
              </div>
            </Form.Group>

            <Form.Group controlId="empCode">
              <Form.Label style={{ fontWeight: "bold" }}>Emp Code:</Form.Label>
              <Form.Control type="text" value={empCode} readOnly />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label style={{ fontWeight: "bold" }}>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="depart">
              <Form.Label style={{ fontWeight: "bold" }}>Department:</Form.Label>
              <Form.Control type="text" value={depart} readOnly />
            </Form.Group>

            <Form.Group controlId="startDate">
              <Form.Label style={{ fontWeight: "bold" }}>Start Date:</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                min={todayDate}
              />
            </Form.Group>

            <Form.Group controlId="endDate">
              <Form.Label style={{ fontWeight: "bold" }}>End Date:</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate ? startDate : todayDate}
              />
            </Form.Group>

            <Form.Group controlId="reason">
              <Form.Label style={{ fontWeight: "bold" }}>Reason:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? <Spinner as="span" animation="border" size="sm" /> : "Submit"}
            </Button>
          </form>
        )}
        {showAlert && <Alert variant="success">Leave application submitted successfully!</Alert>}
        {showErrorAlert && <Alert variant="danger">Error submitting leave application. Please try again.</Alert>}
      </div>
    </div>
  );
};

export default LeaveForm;
