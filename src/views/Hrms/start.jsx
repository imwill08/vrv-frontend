import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Form, Image } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";
import bgImage from "assets/img/hrms/bg1.jpg";

function Start() {
  const navigate = useNavigate();
  const backgroundImageStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh'
  };
  return (
    <Container fluid className="bttn vh-100 loginPage" style={backgroundImageStyle}>
      <Row 
      className="justify-content-center align-items-center">
        <Col md={5} className="p-4 text-center">
          <Form>
            <Row className="mb-3">
              <Col>
                <Button className="bttun"
                  size="md"
                  onClick={() => navigate("/auth/sign-in")}
                  style={{
                    width: "150px",
                    height: "50px",
                    marginTop: "110px",
                    backgroundColor: "#E55A1B",
                    outline: "none",
                    border: "none",
                    color: "#FFFFFF",
                  }}
                >
                  HRMS
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Start;
