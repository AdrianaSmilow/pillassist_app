// src/components/Medicine/MedicineListContent.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MedicineListContext } from "./MedicineListProvider";
import usageApi from "../../api/usage-api";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import {
  CheckCircleFill,
  SlashCircle,
  Plus,
  Dash,
  DatabaseExclamation,
} from "react-bootstrap-icons";

function MedicineListContent({ selectedDate }) {
  const navigate = useNavigate();
  const { state, data, pendingId, handlerMap } = useContext(MedicineListContext);
  const [usedMap, setUsedMap] = useState({});

  // Načteme, které léky byly užity k vybranému dni
  useEffect(() => {
    if (state !== "ready") return;
    const list = data.stockList || [];
    list.forEach(async (med) => {
      const res = await usageApi.list({ medicineId: med.id });
      if (res.ok) {
        const usedToday = res.data.usageList.some(
          (u) => new Date(u.usageDate).toDateString() === selectedDate.toDateString()
        );
        setUsedMap((m) => ({ ...m, [med.id]: usedToday }));
      }
    });
  }, [state, data, selectedDate]);

  if (state === "pending") {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (state === "error") {
    return <Container className="py-5">Chyba: {data?.message}</Container>;
  }

  const stockList = data.stockList || [];
  if (!stockList.length) {
    return <Container className="py-5">Žádné léky ve skladu.</Container>;
  }

  const groups = {
    Lék:     stockList.filter((m) => m.category === "Lék"),
    Suplement: stockList.filter((m) => m.category === "Suplement"),
  };

  const renderGroup = (title, items) => (
    <>
      <h5 className="mt-4">{title}</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Název</th>
            <th>Užito</th>
            <th>Zásoba</th>
            <th>Stav</th>
            <th>Akce</th>
          </tr>
        </thead>
        <tbody>
          {items.map((med) => {
            const isLow = med.count < med.lowStockThreshold && !med.ordered;
            const isPending = pendingId === med.id;
            const used = usedMap[med.id] || false;

            return (
              <tr key={med.id}>
                <td
                  style={{ cursor: "pointer", color: "#0d6efd" }}
                  onClick={() => navigate(`/medicine/${med.id}`)}
                >
                  {med.name}
                </td>
                <td className="text-center">
                  {used ? (
                    <CheckCircleFill color="green" />
                  ) : (
                    <SlashCircle color="gray" />
                  )}
                </td>
                <td className="text-center">{med.count}</td>
                <td className="text-center">
                  {isLow && (
                    <Button
                      variant="link"
                      disabled={isPending}
                      onClick={() =>
                        handlerMap.handleAckLowStock({ medicineId: med.id })
                      }
                    >
                      <DatabaseExclamation />
                    </Button>
                  )}
                </td>
                <td className="text-center">
                  {/* Zvlášť plus */}
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="me-1"
                    disabled={isPending}
                    onClick={() =>
                      handlerMap.handleUpdateStock({ id: med.id, delta: +1 })
                    }
                  >
                    <Plus />
                  </Button>
                  {/* Zvlášť minus */}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={isPending}
                    onClick={() =>
                      handlerMap.handleUpdateStock({ id: med.id, delta: -1 })
                    }
                  >
                    <Dash />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );

  return (
    <Container>
      {renderGroup("Lék", groups.Lék)}
      {renderGroup("Suplement", groups.Suplement)}
    </Container>
  );
}

export default MedicineListContent;
