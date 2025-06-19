// src/layout.jsx
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { Outlet, useNavigate } from "react-router-dom";

import NavBar      from "./navbar";
import Footer      from "./footer";
import medicineApi from "./api/medicine-api";
import MedicineListProvider from "./components/Medicine/MedicineListProvider";

function Layout() {
  const navigate = useNavigate();
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await medicineApi.lowStock();
      if (res.ok) setLowStockCount(res.data.stockList.length);
    })();
  }, []);

  return (
    <MedicineListProvider>
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <NavBar />

        <Container
          fluid
          className="flex-grow-1 p-0"
          style={{ paddingTop: "80px", paddingBottom: "56px" }}
        >
          {/* Jediný Outlet, vše pod ním má kontext */}
          <Outlet />
        </Container>

        <Footer
          onLowStockClick={() => navigate("/lowstock")}
          lowStockCount={lowStockCount}
        />
      </div>
    </MedicineListProvider>
  );
}

export default Layout;





