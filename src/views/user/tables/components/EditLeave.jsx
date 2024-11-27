import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Modal } from 'react-bootstrap';
import Card from "components/card";
// import "../../../../assets/css/editleaves.css"
function EditLeave() {
  const location = useLocation();
  const navigate = useNavigate();
  const { leave } = location.state; // Get the leave data from the state
  console.log(leave)
  const [leaveType, setLeaveType] = useState(leave.leavetype);
  const [currentLeave, setCurrentLeave] = useState({
    startdate: leave.startdate,
    enddate: leave.enddate,
    daysofleave: leave.daysofleave,
  });
  const [reason, setReason] = useState(leave.reason);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLeave((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`https://vrv-backend-ut2g.onrender.com/leavedetails/${leave.id}`, {
        leavetype: leaveType,
        startdate: currentLeave.startdate,
        enddate: currentLeave.enddate,
        daysofleave: currentLeave.daysofleave,
        reason: reason,
      });
      alert('Leave details updated successfully');
      navigate('/admin/data-tables'); // Redirect back to the list after saving
    } catch (error) {
      console.error("Error updating leave data:", error);
      alert('Failed to update leave details. Please try again later.');
    }
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      <div className="leave-form-container">
      <h1>Edit Leave</h1>
      <Form>
        <Form.Group controlId="leaveType">
          <Form.Label>Leave Type:</Form.Label>
          <Form.Select
            value={leaveType}
            name="leavetype"
            onChange={(e) => setLeaveType(e.target.value)}
            required
          >
            <option value="">Select Leave Type</option>
            <option value="Vacation Leave">Vacation Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
            <option value="Study Leave">Study Leave</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formStartDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="startdate"
            value={currentLeave.startdate}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formEndDate">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="enddate"
            value={currentLeave.enddate}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formDaysOfLeave">
          <Form.Label>Days of Leave</Form.Label>
          <Form.Control
            type="number"
            name="daysofleave"
            value={currentLeave.daysofleave}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formReason">
          <Form.Label>Reason</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Form.Group>

        <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  }}
>
  <Button
    variant="primary"
    style={{
      backgroundImage: '-webkit-linear-gradient(270deg, #4318ff, #4318ff)',
      color:'white',
      borderRadius:'7px',
      border: 'none',
      width: '200px', // Adjust width as needed
    }}
    onClick={handleSaveChanges}
  >
    Save Changes
  </Button>

  <Button
    variant="secondary"
    style={{
      backgroundImage: '-webkit-linear-gradient(270deg, #4318ff, #4318ff)',
      borderRadius:'7px',
      color:'white',
      border: 'none',
      width: '100px', // Adjust width as needed
    }}
    onClick={() => navigate(-1)}
  >
    Back
  </Button>
</div>


      </Form>
    </div>
    </div>
  );
}

export default EditLeave;
