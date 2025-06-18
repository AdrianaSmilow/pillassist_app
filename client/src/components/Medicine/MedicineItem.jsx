// src/components/Medicine/MedicineItem.jsx

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Pencil } from "react-bootstrap-icons";

/**
 * MedicineItem – jedna karta / řádek seznamu.
 * Kliknutím na název nebo na tužku se přejde do detailu.
 */
function MedicineItem({ med }) {
  const navigate = useNavigate();

  return (
    <Card className="mb-3">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div style={{ cursor: "pointer" }} onClick={() => navigate(`/medicine/${med.id}`)}>
          <Card.Title>{med.name}</Card.Title>
          <Card.Text>
            Zásoba: {med.count}  |  Práh: {med.lowStockThreshold}
          </Card.Text>
        </div>
        <Button
          variant="outline-primary"
          onClick={() => navigate(`/medicine/${med.id}`)}
          title="Upravit informace"
        >
          <Pencil />
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MedicineItem
