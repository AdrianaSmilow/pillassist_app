// pillassist_app/client/src/components/Medicine/MedicineList.jsx

import React, { useContext } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { MedicineListContext } from "./MedicineListProvider.jsx";
import MedicineItem from "./MedicineItem.jsx";

/**
 * MedicineList bere data z kontextu MedicineListContext a vykreslí je v tabulce.
 * Pokud je prázdný seznam, nabídne tlačítko pro přidání nového léku.
 */
function MedicineList({ onEdit, onDelete }) {
  const { state, data, handlerMap } = useContext(MedicineListContext);
  // state = "ready" | "pending" | "error"
  // data = { itemList: [ ... ] } nebo null
  // handlerMap obsahuje handleCreate, handleDelete, handleUpdateStock, …

  if (state === "pending") {
    return <p>Načítám seznam léků…</p>;
  }
  if (state === "error") {
    return (
      <div className="alert alert-danger">
        Došlo k chybě při načítání léků.
      </div>
    );
  }

  // Pokud ještě není žádné data, nebo je prázdné pole:
  const medicines = data ? data.itemList : [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Seznam léků</h2>
        <Button variant="primary" onClick={() => onEdit(null)}>
          Přidat nový lék
        </Button>
      </div>

      {medicines.length === 0 ? (
        <p>Žádné léky nejsou vloženy.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Název</th>
              <th>Kategorie</th>
              <th>Počet</th>
              <th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <MedicineItem
                key={med.id}
                med={med}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
export default MedicineList;
