// pillassist_app/client/src/components/Medicine/MedicineStock.jsx
import React, { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

import { MedicineListContext } from "./MedicineListProvider.jsx";

/**
 * MedicineStock (celkový přehled všech léků)
 * Tato komponenta načte ze serveru (přes Context) úplný seznam léků
 * a zobrazí je v tabulce. 
 * Setřízena bude sestupně podle počtu (count), aby se nahoře zobrazily 
 * léky s nejnižšími hodnotami dle potřeby.
 * Pokud seznam léků neobsahuje žádné položky, vypíše informační Alert.
 * Horní tlačítko „Zpět na Dashboard“ vás přenese zpátky na Dashboard - změním na ikonu capsulle pill z Bootstrap
 * Dodělám alerty k nízkým zásobám - ikona vykřičníku
 */
function MedicineStock() {
  const { state, data, handlerMap } = useContext(MedicineListContext);
  const [allMedicines, setAllMedicines] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let canceled = false;

    // Jakmile je context state "ready", převezmeme data.itemList (seznam všech léků)
    if (state === "ready") {
      // data.itemList je již načtené v kontextu z handleLoad()
      const medicines = data ? data.itemList.slice() : [];
      // Řazení sestupně podle počtu (count)
      const sorted = medicines.sort((a, b) => a.count - b.count);
      if (!canceled) {
        setAllMedicines(sorted);
      }
    } else if (state === "pending") {
      setLoading(true);
    }

    return () => {
      canceled = true;
    };
  }, [state, data]);

  // Zobrazení Loading / Error
  if (state === "pending") {
    return (
      <Container className="mt-5 pt-5">
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

  // Po načtení (state === "ready")
  return (
    <Container fluid className="mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Celkový přehled léků</h2>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Zpět na Dashboard
        </Button>
      </div>

      {!allMedicines || allMedicines.length === 0 ? (
        <Alert variant="info">Zatím není vložen žádný lék.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Název léku</th>
              <th>Aktuální počet</th>
              <th>Práh zásoby</th>
            </tr>
          </thead>
          <tbody>
            {allMedicines.map((med) => (
              <tr key={med.id}>
                <td>{med.name}</td>
                <td>{med.count}</td>
                <td>{med.lowStockThreshold}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
export default MedicineStock;



