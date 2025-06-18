// src/components/Medicine/MedicineForm.jsx
import { useState, useEffect } from "react";
import Modal  from "react-bootstrap/Modal";
import Form   from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert  from "react-bootstrap/Alert";

/**
 * Props:
 *  - show: boolean
 *  - onHide: () => void
 *  - onSubmit: (dto) => Promise<{ ok, data, status }>
 *  - initialData?: {
 *      id?,
 *      category?,
 *      name?,
 *      count?,
 *      lowStockThreshold?,
 *      activeSubstance?,
 *      strength?,
 *      dosage?,
 *      note?
 *    }
 */
function MedicineForm({ show, onHide, onSubmit, initialData = {} }) {
  const [values, setValues] = useState({
    category:          initialData.category          || "Lék",
    name:              initialData.name              || "",
    count:             initialData.count             || 0,
    lowStockThreshold: initialData.lowStockThreshold || 0,
    activeSubstance:   initialData.activeSubstance   || "",
    strength:          initialData.strength          || "",
    dosage:            initialData.dosage            || "",
    note:              initialData.note              || "",
  });
  const [error, setError] = useState(null);

  // Synchronizace při změně initialData (např. edit)
  useEffect(() => {
    setValues({
      category:          initialData.category          || "Lék",
      name:              initialData.name              || "",
      count:             initialData.count             || 0,
      lowStockThreshold: initialData.lowStockThreshold || 0,
      activeSubstance:   initialData.activeSubstance   || "",
      strength:          initialData.strength          || "",
      dosage:            initialData.dosage            || "",
      note:              initialData.note              || "",
    });
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setError(null);
    const dto = {
      ...values,
      count:             Number(values.count),
      lowStockThreshold: Number(values.lowStockThreshold),
      id:                initialData.id,
    };
    const res = await onSubmit(dto);
    if (!res.ok) {
      setError(res.data?.message || "Chyba při ukládání léku.");
    } else {
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard>
      <Form onSubmit={handleSave}>
        <Modal.Header closeButton>
          <Modal.Title>
            {initialData.id ? "Upravit lék/suplement" : "Přidat nový lék/suplement"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* 1) Info o povinných polích */}
          <p className="text-muted mb-3">
            Pole označená <span className="text-danger">*</span> jsou povinná
          </p>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* 2) Kategorie jako první */}
          <Form.Group className="mb-3">
            <Form.Label>Kategorie *</Form.Label>
            <div>
              <Form.Check
                inline
                label="Lék"
                name="category"
                type="radio"
                id="cat-med"
                value="Lék"
                checked={values.category === "Lék"}
                onChange={handleChange}
                required
              />
              <Form.Check
                inline
                label="Suplement"
                name="category"
                type="radio"
                id="cat-sup"
                value="Suplement"
                checked={values.category === "Suplement"}
                onChange={handleChange}
              />
            </div>
          </Form.Group>

          {/* 3) Povinné políčka */}
          <Form.Group className="mb-3">
            <Form.Label>Název *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Počet kusů *</Form.Label>
            <Form.Control
              type="number"
              name="count"
              value={values.count}
              onChange={handleChange}
              required
              min={0}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hranice nízké zásoby v kusech *</Form.Label>
            <Form.Control
              type="number"
              name="lowStockThreshold"
              value={values.lowStockThreshold}
              onChange={handleChange}
              required
              min={0}
            />
          </Form.Group>

          {/* 4) Nepovinné textové pole další informace */}
          <Form.Group className="mb-3">
            <Form.Label>Účinná látka</Form.Label>
            <Form.Control
              type="text"
              name="activeSubstance"
              value={values.activeSubstance}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Síla látky na dávku</Form.Label>
            <Form.Control
              type="text"
              name="strength"
              value={values.strength}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Doporučené dávkování</Form.Label>
            <Form.Control
              type="text"
              name="dosage"
              value={values.dosage}
              onChange={handleChange}
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

export default MedicineForm