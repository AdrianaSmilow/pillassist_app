// pillassist_app/client/src/components/Medicine/MedicineDeleteDialog.jsx

import { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { MedicineListContext } from "./MedicineListProvider.jsx";

function MedicineDeleteDialog({ data, onClose }) {
  const [localError, setLocalError] = useState(null);
  const { state, pendingId, handlerMap } = useContext(MedicineListContext);
  const { id, name } = data;

  const onDeleteClick = async () => {
    const result = await handlerMap.handleDelete({ id });
    if (result.ok) {
      onClose();
    } else {
      setLocalError(result.error);
    }
  };

  const isPendingForThis = state === "pending" && pendingId === id;

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Smazat lék</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {localError && <Alert variant="danger">{localError}</Alert>}
        {`Opravdu chcete smazat lék „${name}“?`}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isPendingForThis}
        >
          Zavřít
        </Button>
        <Button
          variant="danger"
          onClick={onDeleteClick}
          disabled={isPendingForThis}
        >
          Smazat
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default MedicineDeleteDialog;
