// src/navbar.jsx

import { useNavigate } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { CapsulePill } from "react-bootstrap-icons";

function NavBar() {
  const navigate = useNavigate();

  return (
    <Navbar
      expand="md"
      fixed="top"
      style={{ backgroundColor: "#d4f0d4" }} // světle zelené
      variant="light"
    >
      <Container>
        <Navbar.Brand
          style={{ cursor: "pointer", color: "#155724" }}
          onClick={() => navigate("/")}
        >
          PillAssist
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center">
          {/* Ikona kapsle-pilule jako odkaz na Dashboard */}
          <Nav.Link onClick={() => navigate("/")}>
            <CapsulePill size={24} color="#155724" />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;

