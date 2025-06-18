// src/footer.jsx

import { Navbar, Container, Nav } from "react-bootstrap";
import { CapsulePill } from "react-bootstrap-icons";

function Footer({ onLowStockClick, lowStockCount }) {
  return (
    <Navbar
      fixed="bottom"
      style={{ backgroundColor: "#d4f0d4" }} // světle zelené
      variant="light"
      className="border-top"
    >
      <Container className="justify-content-between">
        <span style={{ color: "#155724" }}>
          &copy; {new Date().getFullYear()} PillAssist
        </span>
        <Nav>
          <Nav.Link
            onClick={onLowStockClick}
            className="d-flex align-items-center"
            style={{ color: "#155724" }}
          >
            <CapsulePill className="me-1" />
            {lowStockCount} 
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Footer
