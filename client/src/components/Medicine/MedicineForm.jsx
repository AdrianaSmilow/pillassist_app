// src/components/Medicine/MedicineForm.jsx

import { useContext, useState } from "react";
// Bootstrap komponenty
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
// Kontext pro CRUD přes medicineApi
import { MedicineListContext } from "./MedicineListProvider";

function MedicineForm({ onClose }) {
  // Z contextu získáme:
  // - state: řídí disable tlačítek při probíhající operaci
  // - error: chybová zpráva z backendu
  // - handlerMap.handleCreate: funkce pro vytvoření záznamu
  const { state, error, handlerMap } = useContext(MedicineListContext);

  // Stav pro hodnoty formuláře
  const [values, setValues] = useState({
    name: "",
    count: "",
    lowStockThreshold: "",
    category: "Lék",       // výchozí kategorie
    activeSubstance: "",
    strength: "",
    dosage: "",
    note: "",
  });

  // Zpracování odeslání formuláře
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Připraví DTO, upraví čísla
    const dto = {
      name: values.name,
      count: Number(values.count),
      lowStockThreshold: Number(values.lowStockThreshold),
      category: values.category,
      // Volitelná pole přidáme jen pokud nejsou prázdná
      ...(values.activeSubstance && { activeSubstance: values.activeSubstance }),
      ...(values.strength && { strength: values.strength }),
      ...(values.dosage && { dosage: values.dosage }),
      ...(values.note && { note: values.note }),
    };
    // Volá backend
    const result = await handlerMap.handleCreate(dto);
    if (result.ok) {
      onClose(); // zavřeme modal, když to proběhlo OK
    }
    // v chybovém případě ponecháme modal otevřený a zobrazíme Alert
  };

  // Změna hodnot v políčkách
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(curr => ({ ...curr, [name]: value }));
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Přidat nový lék / suplement</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Chybová hláška z backendu */}
          {state === "error" && (
            <Alert variant="danger">{error?.message}</Alert>
          )}

          {/* Název */}
          <Form.Group className="mb-3">
            <Form.Label>Název *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              disabled={state === "pending"}
              required
            />
          </Form.Group>

          {/* Počáteční zásoba */}
          <Form.Group className="mb-3">
            <Form.Label>Počáteční zásoba *</Form.Label>
            <Form.Control
              type="number"
              name="count"
              value={values.count}
              onChange={handleChange}
              disabled={state === "pending"}
              required
            />
          </Form.Group>

          {/* Hranice nízké zásoby */}
          <Form.Group className="mb-3">
            <Form.Label>Hranice nízké zásoby *</Form.Label>
            <Form.Control
              type="number"
              name="lowStockThreshold"
              value={values.lowStockThreshold}
              onChange={handleChange}
              disabled={state === "pending"}
              required
            />
          </Form.Group>

          {/* Kategorie */}
          <Form.Group className="mb-3">
            <Form.Label>Kategorie *</Form.Label>
            <Form.Select
              name="category"
              value={values.category}
              onChange={handleChange}
              disabled={state === "pending"}
              required
            >
              <option value="Lék">Lék</option>
              <option value="Suplement">Suplement</option>
            </Form.Select>
          </Form.Group>

          {/* Volitelná pole */}
          <Form.Group className="mb-3">
            <Form.Label>Účinná látka</Form.Label>
            <Form.Control
              type="text"
              name="activeSubstance"
              value={values.activeSubstance}
              onChange={handleChange}
              disabled={state === "pending"}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Síla dávky</Form.Label>
            <Form.Control
              type="text"
              name="strength"
              value={values.strength}
              onChange={handleChange}
              disabled={state === "pending"}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dávkování</Form.Label>
            <Form.Control
              type="text"
              name="dosage"
              value={values.dosage}
              onChange={handleChange}
              disabled={state === "pending"}
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
              disabled={state === "pending"}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={state === "pending"}
          >
            Zavřít
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={state === "pending"}
          >
            Uložit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default MedicineForm