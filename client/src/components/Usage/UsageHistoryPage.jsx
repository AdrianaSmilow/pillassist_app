// src/components/Usage/UsageHistoryPage.jsx

import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import UsageListProvider from "./UsageListProvider.jsx";
import UsageHistoryList from "./UsageHistoryList.jsx";

function UsageHistoryPage() {
  const { id: medicineId } = useParams();
  const navigate = useNavigate();

  return (
    <UsageListProvider medicineId={medicineId}>
      <Container fluid className="mt-5 pt-5" style={{ maxWidth: 800 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Historie užití</h3>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Zpět
          </Button>
        </div>
        <UsageHistoryList />
      </Container>
    </UsageListProvider>
  );
}

export default UsageHistoryPage