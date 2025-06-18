// src/Dashboard.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import MedicineListProvider from "./components/Medicine/MedicineListProvider";
import MedicineListContent from "./components/Medicine/MedicineListContent";
import MedicineForm from "./components/Medicine/MedicineForm";
import MedicineDeleteDialog from "./components/Medicine/MedicineDeleteDialog";

function Dashboard() {
  const navigate = useNavigate();

  // Ovládání modalů
  const [formData, setFormData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  // Vybrané datum pro zobrazení, které se předá do MedicineListContent
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <MedicineListProvider>
      <Container fluid className="mt-4">

        {/* --- Horní ovládací řádek --- */}
        <div className="d-flex align-items-center mb-3">
          {/* Přidat nový lék */}
          <Button variant="primary" onClick={() => setFormData({})}>
            Přidat lék
          </Button>

          {/* Zaznamenat užití */}
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => {
              /* Otevře UsageForm modal – ještě nedodělané */
            }}
          >
            Užil jsem
          </Button>

          {/* Výběr data */}
          <div className="ms-auto">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd.MM.yyyy"
            />
          </div>
        </div>

        {/* --- Seznam léků --- */}
        <MedicineListContent
          selectedDate={selectedDate}
          onEdit={(med) => setFormData(med)}
          onDelete={(med) => setDeleteData(med)}
        />

        {/* --- Tlačítko nízké zásoby --- */}
        <div className="text-center mt-4">
          <Button
            variant="outline-danger"
            onClick={() => navigate("/lowstock")}
          >
            Nízká zásoba
          </Button>
        </div>
      </Container>

      {/* --- Modal pro přidání/úpravu léku --- */}
      {formData && (
        <MedicineForm
          initialData={formData}
          onClose={() => setFormData(null)}
        />
      )}

      {/* --- Dialog pro potvrzení smazání léku --- */}
      {deleteData && (
        <MedicineDeleteDialog
          data={deleteData}
          onClose={() => setDeleteData(null)}
        />
      )}
    </MedicineListProvider>
  );
}

export default Dashboard