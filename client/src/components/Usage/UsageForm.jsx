// src/components/Usage/UsageForm.jsx

import { useState, useEffect } from "react";
import Modal  from "react-bootstrap/Modal";
import Form   from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert  from "react-bootstrap/Alert";

/**
 * Modal pro vytvoření záznamu užití.
 * Props:
 *  - show: boolean
 *  - onHide: () => void
 *  - onSubmit: (dto) => Promise<{ok, data, status}>
 *  - medicines: [{ id, name }]
 *  - defaultDate: Date
 */
function UsageForm({ show, onHide, onSubmit, medicines = [], defaultDate }) {
  const [values, setValues] = useState({
    medicineId: medicines[0]?.id || "",
    count:      "",
    usageDate:  defaultDate?.toISOString().split("T")[0] || "",
    note:       "",
  });
  const [error, setError] = useState(null);

  // Když se změní defaultDate (v Dashboardu), synchronizujeme
  useEffect(() => {
    setValues(v => ({
      ...v,
      usageDate: defaultDate?.toISOString().split("T")[0] || "",
    }));
  }, [defaultDate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setError(null);
    const dto = {
      medicineId: values.medicineId,
      count:      Number(values.count),
      usageDate:  values.usageDate,
      note:       values.note,
    };
    const res = await onSubmit(dto);
    if (!res.ok) {
      setError(res.data?.message || "Chyba při ukládání užití.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard>
      <Form onSubmit={handleSave}>
        <Modal.Header closeButton>
          <Modal.Title>Přidat užití</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Lék *</Form.Label>
            <Form.Select
              name="medicineId"
              value={values.medicineId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Vyber lék
              </option>
              {medicines.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Datum *</Form.Label>
            <Form.Control
              type="date"
              name="usageDate"
              value={values.usageDate}
              onChange={handleChange}
              required
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
          <Button variant="secondary" onClick={onHide}>
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

export default UsageForm;

