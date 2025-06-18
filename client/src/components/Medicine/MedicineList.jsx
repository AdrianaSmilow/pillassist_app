// src/components/Medicine/MedicineList.jsx

import { useContext } from "react";
import { MedicineListContext } from "./MedicineListProvider";
import MedicineItem from "./MedicineItem.jsx";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

/**
 * MedicineList – vykreslí všechny léky jako řadu karet.
 */
function MedicineList() {
  const { state, data } = useContext(MedicineListContext);

  if (state === "pending") {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (state === "error") {
    return (
      <Alert variant="danger">
        Chyba při načítání léků.
      </Alert>
    );
  }

  const list = data?.stockList || [];
  if (list.length === 0) {
    return <Alert variant="info">Zatím není vložen žádný lék.</Alert>;
  }

  return (
    <div>
      {list.map(med => (
        <MedicineItem key={med.id} med={med} />
      ))}
    </div>
  );
}

export default MedicineList