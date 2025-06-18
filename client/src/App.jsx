// pillassist_app/client/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1) Layout musí být default export z ./layout.jsx
import Layout from "./layout";
// 2) Dashboard je default export z ./Dashboard.jsx
import Dashboard from "./Dashboard";
// 3) MedicineDetail je default export z ./components/Medicine/MedicineDetail.jsx
import MedicineDetail from "./components/Medicine/MedicineDetail.jsx";
// 4) MedicineStock je default export z ./components/Medicine/MedicineStock.jsx
import MedicineStock from "./components/Medicine/MedicineStock.jsx";
// 5) UsageHistoryPage je default export 
import UsageHistoryPage from "./components/Usage/UsageHistoryPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* indexová routa */}
          <Route index element={<Dashboard />} />
          {/* detail léku */}
          <Route path="medicine/:id" element={<MedicineDetail />} />
          {/* historie užití */}
          <Route path="medicine/:id/usage-history" element={<UsageHistoryPage />} />
          {/* celkový přehled všech léků */}
          <Route path="lowstock" element={<MedicineStock />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;



