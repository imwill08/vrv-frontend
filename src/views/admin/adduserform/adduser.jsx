import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Alert, FormGroup, FormControl } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import festivaldata from "../festivalData";
import "../../../assets/css/LeaveForm.css"
const LeaveForm = ({ festivalData: propFestivalData }) => {
  const navigate = useNavigate();
  const [picture, setPicture] = useState(null); 
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({}); // State variable for form errors
  const [submitted, setSubmitted] = useState(false); // State variable for form submission message
  const [formData, setFormData] = useState({
      emp_code: '',
      username: '',
      password: '',
      confirmpassword: '',
      dob:'',
      name: '',
      dateofjoining: '',
      designation: '',
      department: ''

  });

  useEffect(() => {
    // Reset the submitted state after 3 seconds
    if (submitted) {
        const timeout = setTimeout(() => {
            setSubmitted(false);
        }, 3000);

        return () => clearTimeout(timeout);
    }
}, [submitted]);

const [adminName, setAdminName] = useState('');

useEffect(() => {
    fetchAdminName();
}, []);

const fetchAdminName = async () => {
    try {
        const response = await axios.get('https://vrv-backend-ut2g.onrender.com//admin/profile');
        setAdminName(response.data.name);
    } catch (error) {
        console.error('Error fetching admin name:', error);
    }
}; 


  const handleChange = (e) => {
      setFormData((prevFormData) => ({
          ...prevFormData,
          [e.target.name]: e.target.value
          
      }));

// Clear the error message when the user starts typing again
setErrors((prevErrors) => ({
  ...prevErrors,
  [e.target.name]: ''
}));

  };
  const handlePictureChange = (e) => {
      setFile(e.target.files[0]); // Grab the first file from the selected files array
  };
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          if (!file) {
              alert('Please upload an image');
              return;
          }
          const formDataToSend = new FormData();
          formDataToSend.append('image', file);
          Object.entries(formData).forEach(([key, value]) => {
              formDataToSend.append(key, value);
          });
          await axios.post('https://vrv-backend-ut2g.onrender.com/newuserdata', formDataToSend);
          setFormData({
              emp_code: '',
              username: '',
              password: '',
              confirmpassword: '',
              dob: '',
              name: '',
              dateofjoining: '',
              designation: '',
              department: ''
          });
          setFile(null);
          setSubmitted(true);
          alert("Employee details saved successfully")
      } catch (error) {
          console.error('Error saving employee details:', error);
      }
  };
  
  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      <div className="leave-form-container">
        <h2>Add User Form</h2>
        {submitted && (
                                <Alert variant="success" className="mt-3">
                                    Form submitted successfully!
                                </Alert>
                            )}

                    <Form onSubmit={handleSubmit}>
            
                        <div style={{ padding: '20px' }}>
                  
                            <FormGroup controlId="emp_code">
                                <Form.Label>Employee Code:</Form.Label>
                                <FormControl
                                    type="text"
                                    placeholder="Enter employee code"
                                    value={formData.emp_code}
                                    onChange={handleChange}
                                    required
                                    name="emp_code"
                                />
                             {/* {errors.emp_code && <p className="text-danger">{errors.emp_code}</p>} */}
                            </FormGroup>

                            <FormGroup controlId="username">
                                <Form.Label>Username:</Form.Label>
                                <FormControl
                                    type="text"
                                    placeholder="Enter username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    name="username"
                                />
                               {/* {errors.username && <p className="text-danger">{errors.username}</p>} */}
                            </FormGroup>

                            <FormGroup controlId="picture">
                                <Form.Label>Upload Picture:</Form.Label>
                                <FormControl
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePictureChange}
                                    name="picture"
                                />
                            </FormGroup>
                            <FormGroup controlId="password">
                                <Form.Label>Password:</Form.Label>
                                <FormControl
                                    type="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    name="password"
                                />
                                 {/* {errors.password && <p className="text-danger">{errors.password}</p>} */}
                         
                            </FormGroup>
                            <FormGroup controlId="confirmPassword">
                                <Form.Label>Confirm Password:</Form.Label>
                                <FormControl
                                    type="password"
                                    placeholder="Confirm password"
                                    value={formData.confirmpassword}
                                    onChange={handleChange}
                                    required
                                    name="confirmpassword"
                                />
                                {/* {errors.confirmpassword && <p className="text-danger">{errors.confirmpassword}</p>} */}
                            </FormGroup>

                            <FormGroup controlId="dob">
                                <Form.Label>Date of Birth:</Form.Label>
                                <FormControl
                                    type="date"
                                    placeholder="Date of Birth"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                    name="dob"
                                />
                               
                            </FormGroup>

                            <FormGroup controlId="name">
                                <Form.Label>Name:</Form.Label>
                                <FormControl
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    name="name"
                                />
                                  {/* {errors.name && <p className="text-danger">{errors.name}</p>} */}
                            </FormGroup>

                            <FormGroup controlId="dateofjoining">
                                <Form.Label>Date of Joining:</Form.Label>
                                <FormControl
                                    type="date"
                                    value={formData.dateofjoining}
                                    onChange={handleChange}
                                    required
                                    name="dateofjoining"
                                />
                            </FormGroup>
                            <FormGroup controlId="designation">
                                <Form.Label>Designation:</Form.Label>
                                <FormControl
                                    type="text"
                                    placeholder="Enter designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    required
                                    name="designation"
                                />
                                {/* {errors.designation && <p className="text-danger">{errors.designation}</p>} */}
                            </FormGroup>
                            <FormGroup controlId="department">
                                <Form.Label>Department:</Form.Label>
                                <FormControl
                                    as="select"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    name="department"
                                >
                                    <option value="" disabled>Select Department</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Production">Production</option>
                                    <option value="Support">Support</option>
                                    <option value="Accounts">Accounts</option>
                                    <option value="IT">IT</option>
                                    <option value="Operation">Operation</option>
                                </FormControl>
                            </FormGroup>

                            <Button
                             style={{
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                backgroundColor: '#E55A1B',
                                color:"white",
                                border: 'none',
                                marginTop: '20px',
                                width: '200px', // Adjust the width as needed
                              }}
                            variant="primary" type="submit" className="btn btn-primary mt-4 mx-4">
                                Submit
                            </Button>
                            

                        </div>
                    </Form>
      </div>
    </div>
  );
};

export default LeaveForm;
