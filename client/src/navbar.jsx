// pillassist_app/client/src/navbar.jsx
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

function NavBar() {
  const navigate = useNavigate();

  return (
    <Navbar
      expand="md"
      bg="primary"
      data-bs-theme="dark"
      fixed="top"
      collapseOnSelect
    >
      <Container>
        {/* Ikona kapsle + text, naviguje na "/Dashboard" */}
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <i className="bi bi-capsule me-2" style={{ fontSize: "1.5rem" }} />
          PillAssist
        </Navbar.Brand>

        {/* Tlačítko Přidat lék a Zaznamenat užití */}
        <div className="d-flex ms-auto">
          <Button
            variant="success"
            size="sm"
            className="me-2"
            onClick={() => navigate("/add-medicine")}
          >
            <i className="bi bi-plus-lg me-1" />
            Přidat lék
          </Button>
          <Button
            variant="info"
            size="sm"
            onClick={() => navigate("/record-usage")}
          >
            <i className="bi bi-pencil-square me-1" />
            Zaznamenat užití
          </Button>
        </div>

        <Navbar.Toggle aria-controls="pillassist-navbar-nav" size="sm" />
      </Container>
    </Navbar>
  );
}
export default NavBar;
