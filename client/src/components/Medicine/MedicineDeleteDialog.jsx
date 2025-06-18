// client/src/components/Medicine/MedicineDeleteDialog.jsx

import { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { MedicineListContext } from "./MedicineListProvider";

function MedicineDeleteDialog({ data, onClose }) {
  const { handlerMap, state } = useContext(MedicineListContext);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    const result = await handlerMap.handleDelete({ id: data.id });
    if (result.ok) {
      onClose();
    } else {
      setError(result.data);
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Smazat lék</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error.message}</Alert>}
        Opravdu chcete smazat lék <strong>{data.name}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={state === "pending"}>
          Zrušit
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={state === "pending"}>
          Smazat
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MedicineDeleteDialog

