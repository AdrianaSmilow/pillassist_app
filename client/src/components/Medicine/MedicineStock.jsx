// src/components/Medicine/MedicineStock.jsx

import { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
// Context pro data
import { MedicineListContext } from "./MedicineListProvider";
// Ikony
import { CapsulePill, DatabaseExclamation, Pencil } from "react-bootstrap-icons";

function MedicineStock() {
  const { state, data } = useContext(MedicineListContext);
  const [allMedicines, setAllMedicines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (state === "ready") {
      // Zkopíruje seznam, seřadí podle počtu (vzestupně)
      const list = data?.stockList?.slice() || [];
      list.sort((a, b) => a.count - b.count);
      setAllMedicines(list);
    }
  }, [state, data]);

  // Loading / Error
  if (state === "pending") {
    return (
      <Container className="mt-5 pt-5 text-center">
        <p>Načítám seznam léků…</p>
      </Container>
    );
  }
  if (state === "error") {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="danger">
          Došlo k chybě při načítání seznamu léků. Zkuste stránku obnovit.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-5 pt-5">
      {/* Hlavička s titulem a ikonou pro návrat */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Celkový přehled léků</h2>
        <Button
          variant="secondary"
          onClick={() => navigate("/")}
          title="Zpět na Dashboard"
        >
          <CapsulePill /> 
        </Button>
      </div>

      {/* Pokud prázdné */}
      {allMedicines.length === 0 ? (
        <Alert variant="info">Zatím není vložen žádný lék.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Název léku</th>
              <th>Aktuální počet</th>
              <th>Práh zásoby</th>
              <th>Upozornění</th>
              <th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {allMedicines.map((med) => {
              const isLow = med.count < med.lowStockThreshold && !med.ordered;
              return (
                <tr key={med.id}>
                  <td>{med.name}</td>
                  <td>{med.count}</td>
                  <td>{med.lowStockThreshold}</td>
                  <td className="text-center">
                    {isLow && (
                      <DatabaseExclamation color="orange" title="Nízká zásoba" />
                    )}
                  </td>
                  <td className="text-center">
                    {/* Otevře detail pro úpravu */}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/medicine/${med.id}`)}
                      title="Upravit informace"
                    >
                      <Pencil />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default MedicineStock



