// pillassist_app/client/src/footer.jsx
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// Footer s tlačítkem „Stav zásob“ 
function Footer({ onLowStockClick, lowStockCount }) {
  return (
    <footer className="bg-light py-3 mt-auto">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} className="text-center text-md-start mb-2 mb-md-0">
            © {new Date().getFullYear()} PillAssist
          </Col>
          <Col xs={12} md={6} className="text-center text-md-end">
            <Button variant="warning" onClick={onLowStockClick}>
              Stav zásob
              {lowStockCount > 0 && (
                <span className="badge bg-danger ms-2">
                  {lowStockCount}
                </span>
              )}
            </Button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
export default Footer;
