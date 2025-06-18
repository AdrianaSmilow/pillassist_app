// src/components/Usage/UsageDeleteDialog.jsx

import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

/**
 * Dialog pro potvrzení smazání záznamu užití.
 * usageId: ID, onConfirm(id): Potvrzení, zavření (): void
 */
function UsageDeleteDialog({ usageId, onConfirm, onClose }) {
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    const res = await onConfirm(usageId);
    if (!res.ok) {
      setError(res.data.message || "Chyba při mazání.");
    }
    setPending(false);
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Smazat záznam užití</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        Opravdu chcete smazat tento záznam užití?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={pending}>
          Zrušit
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={pending}>
          Smazat
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UsageDeleteDialog