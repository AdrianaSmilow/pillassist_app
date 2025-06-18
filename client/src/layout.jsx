// src/LAYOUT.JSX

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { Outlet, useNavigate } from "react-router-dom";

import NavBar from "./navbar";
import Footer from "./footer";
import MedicineForm from "./components/Medicine/MedicineForm";
import UsageForm from "./components/Usage/UsageForm";
import medicineApi from "./api/medicine-api";

function Layout() {
  const navigate = useNavigate();
  const [showMedForm, setShowMedForm] = useState(false);
  const [showUsageForm, setShowUsageForm] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  // Načteme počet položek s nízkou zásobou
  useEffect(() => {
    (async () => {
      const res = await medicineApi.lowStock();
      if (res.ok) {
        setLowStockCount(res.data.stockList.length);
      }
    })();
  }, []);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Horní lišta */}
      <NavBar
        onAddMedicine={() => setShowMedForm(true)}
        onRecordUsage={() => setShowUsageForm(true)}
      />

      {/* Hlavní obsah */}
      <Container
        fluid
        className="flex-grow-1 p-0"
        style={{ paddingTop: "56px", paddingBottom: "56px" }}
      >
        <Outlet />
      </Container>

      {/* Spodní lišta */}
      <Footer
        onLowStockClick={() => navigate("/lowstock")}
        lowStockCount={lowStockCount}
      />

      {/* Modály */}
      {showMedForm && <MedicineForm onClose={() => setShowMedForm(false)} />}
      {showUsageForm && <UsageForm onClose={() => setShowUsageForm(false)} />}
    </div>
  );
}

export default Layout



