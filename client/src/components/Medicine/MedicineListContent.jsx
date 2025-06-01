// pillassist_app/client/src/components/Medicine/MedicineListContent.jsx

import { useContext } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { MedicineListContext } from "./MedicineListProvider.jsx";

function MedicineListContent({ onDeleteClick }) {
  const { medicines, state, error } = useContext(MedicineListContext);

  // Pokud se právě načítají (stav pending) a ještě není žádný záznam 
  if (state === "pending" && medicines.length === 0) {
    return <p>Načítají se léky…</p>;
  }

  // Pokud došlo k chybě při načítání seznamu
  if (error) {
    return <Alert variant="danger">Chyba: {error.message}</Alert>;
  }

  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>Název</th>
          <th>Stav skladu</th>
          <th>Akce</th>
        </tr>
      </thead>
      <tbody>
        {medicines.map((med) => (
          <tr key={med.id}>
            <td>{med.name}</td>
            <td>{med.stock != null ? med.stock : "-"}</td>
            <td>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDeleteClick(med)}
              >
                Smazat
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default MedicineListContent;
