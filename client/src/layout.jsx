// pillassist_app/client/src/layout.jsx

import { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";   // <- tady je ten import
import { Outlet, useNavigate } from "react-router-dom";

import NavBar from "./navbar.jsx";
import Footer from "./footer.jsx";
import { MedicineListContext } from "./components/Medicine/MedicineListProvider.jsx";

function Layout() {
  const navigate = useNavigate();
  const { state, handlerMap } = useContext(MedicineListContext);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    if (state === "ready") {
      (async () => {
        const res = await handlerMap.handleLowStock();
        if (res.ok) {
          setLowStockCount(res.data.length);
        }
      })();
    }
  }, [state, handlerMap]);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* 1) Navigační lišta nahoře */}
      <NavBar />

      {/* 2) Hlavní obsah: Outlet vykreslí Dashboard, MedicineDetail atd. */}
      <Container
        fluid
        className="flex-grow-1 p-0"
        style={{
          paddingTop: "56px",   // odsazení, aby obsah nebyl schovaný pod Navbar
          paddingBottom: "56px" // odsazení, aby obsah nezasahoval do Footer
        }}
      >
        <Outlet />
      </Container>

      {/* 3) Footer dolní lišta */}
      <Footer
        onLowStockClick={() => navigate("/lowstock")}
        lowStockCount={lowStockCount}
      />
    </div>
  );
}
export default Layout;


