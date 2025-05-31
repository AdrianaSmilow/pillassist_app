// pillassist_app/client/src/Dashboard.jsx

import React, { useContext, useState, useEffect } from "react";
import MedicineListProvider, { MedicineListContext } from "./components/Medicine/MedicineListProvider.jsx";
import MedicineList from "./components/Medicine/MedicineList.jsx";
import MedicineForm from "./components/Medicine/MedicineForm.jsx";             // připravíme ho později
import MedicineDeleteDialog from "./components/Medicine/MedicineDeleteDialog.jsx"; // připravíme ho později

function Dashboard() {
  // State pro otevření/uzavření modalu pro formulář (Add/Edit)
  const [formData, setFormData] = useState(null);
  // State pro potvrzovací dialog smazání
  const [deleteData, setDeleteData] = useState(null);

  return (
    <MedicineListProvider>
      <DashboardContent
        onEdit={(med) => setFormData(med)}
        onDelete={(med) => setDeleteData(med)}
      />

      {/* Pokud je formData != null, vykreslí se modal pro Add/Edit */}
      {formData !== null && (
        <MedicineForm
          initialData={formData}
          onClose={() => setFormData(null)}
        />
      )}

      {/* Pokud je deleteData != null, vykreslí se potvrzovací dialog */}
      {deleteData !== null && (
        <MedicineDeleteDialog
          data={deleteData}
          onClose={() => setDeleteData(null)}
        />
      )}
    </MedicineListProvider>
  );
}
export default Dashboard;

function DashboardContent({ onEdit, onDelete }) {
  const { state, data, handlerMap } = useContext(MedicineListContext);
  // state: "ready" | "pending" | "error"
  // data.itemList: pole medicín
  // handlerMap.handleDelete, handleCreate, atd.

  if (state === "pending") {
    return <p>Načítám léky…</p>;
  }
  if (state === "error") {
    return (
      <div className="alert alert-danger">
        Chyba při načítání léků, zkuste to znovu.
      </div>
    );
  }

  // data.itemList je pole léků
  const medicines = data ? data.itemList : [];

  return (
    <div className="container mt-4">
      <MedicineList onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
export default Dashboard; 