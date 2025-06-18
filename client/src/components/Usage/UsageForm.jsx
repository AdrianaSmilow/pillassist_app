// src/components/Usage/UsageForm.jsx

import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

/**
 * Modal pro přidání nového záznamu užití.
 * onSubmit(dto) → { medicineId, count, usageDate, note }
 */
function UsageForm({ onClose, onSubmit }) {
  const [values, setValues] = useState({
    count: "",
    usageDate: "",
    note: "",
  });
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(cur => ({ ...cur, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setError(null);
    const dto = {
      count: Number(values.count),
      usageDate: values.usageDate,
      note: values.note,
    };
    const res = await onSubmit(dto);
    if (!res.ok) {
      setError(res.data.message || "Chyba při vytváření záznamu.");
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Form onSubmit={handleSave}>
        <Modal.Header closeButton>
          <Modal.Title>Přidat užití</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Datum</Form.Label>
            <Form.Control
              type="date"
              name="usageDate"
              value={values.usageDate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Počet *</Form.Label>
            <Form.Control
              type="number"
              name="count"
              value={values.count}
              onChange={handleChange}
              required
              min={1}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Poznámka</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="note"
              value={values.note}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Zrušit
          </Button>
          <Button variant="primary" type="submit">
            Uložit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UsageForm