// src/Dashboard.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container   from "react-bootstrap/Container";
import Button      from "react-bootstrap/Button";
import DatePicker  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import MedicineListContent from "./components/Medicine/MedicineListContent";
import MedicineForm        from "./components/Medicine/MedicineForm";
import MedicineDeleteDialog from "./components/Medicine/MedicineDeleteDialog";
import UsageForm           from "./components/Usage/UsageForm";
import { MedicineListContext } from "./components/Medicine/MedicineListProvider";
import usageApi            from "./api/usage-api";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showUsageForm, setShowUsageForm] = useState(false);

  // Nově lokální stav pro medicine-form
  const [showMedForm, setShowMedForm] = useState(false);
  const [formData, setFormData]       = useState(null);
  const [deleteData, setDeleteData]   = useState(null);

  const { handlerMap, data } = useContext(MedicineListContext);
  const medicines = data?.stockList || [];

  // Záznam užití
 const handleUsageSubmit = async dto => {
  // dto musí obsahovat medicineId, count, usageDate, note
  const res = await usageApi.create(dto);
  if (res.ok) {
    setShowUsageForm(false);
  }
  return res;
 };

  // Vytvoření nebo úprava léku
  const handleMedicineSubmit = async dto => {
    const res = dto.id
      ? await handlerMap.handleUpdate(dto)
      : await handlerMap.handleCreate(dto);
    if (res.ok) {
      setShowMedForm(false);
      setFormData(null);
    }
    return res;
  };

  return (
    <Container fluid className="mt-4" style={{ paddingBottom: "56px" }}>
      {/* Ovládací tlačítka */}
      <div className="d-flex align-items-center mb-3" style={{ marginTop: "80px" }}>
        <Button
          variant="primary"
          onClick={() => { setFormData({}); setShowMedForm(true); }}
        >
          Přidat lék
        </Button>

        <Button
          variant="warning"
          className="ms-2"
          onClick={() => setShowUsageForm(true)}
        >
          Užil jsem
        </Button>

        <div className="ms-auto">
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            dateFormat="dd.MM.yyyy"
          />
        </div>
      </div>

      {/* Seznam léků */}
      <MedicineListContent selectedDate={selectedDate} />

      {/* Stav zásob */}
      <div className="text-center mt-4">
        <Button variant="outline-danger" onClick={() => navigate("/lowstock")}>Stav zásob</Button>
      </div>

      {/* MedicineForm modal */}
      <MedicineForm
        show={showMedForm}
        onHide={() => setShowMedForm(false)}
        onSubmit={handleMedicineSubmit}
        initialData={formData || {}}
      />

      {/* Dialog pro smazání léku */}
      {deleteData && (
        <MedicineDeleteDialog
          data={deleteData}
          onClose={() => setDeleteData(null)}
        />
      )}

      {/* UsageForm modal */}
      <UsageForm
        show={showUsageForm}
        onHide={() => setShowUsageForm(false)}
        onSubmit={handleUsageSubmit}
        medicines={medicines}
        defaultDate={selectedDate}
      />
    </Container>
  );
}

export default Dashboard