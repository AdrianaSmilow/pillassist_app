// src/components/Medicine/MedicineListContent.jsx

import { useContext, useState, useEffect } from "react";
import { MedicineListContext } from "./MedicineListProvider";
import usageApi from "../../api/usage-api";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import {
  CheckCircleFill,
  SlashCircle,
  PlusSlashMinus,
  DatabaseExclamation,
} from "react-bootstrap-icons";

function MedicineListContent({ selectedDate }) {
  const { state, data, pendingId, handlerMap } = useContext(MedicineListContext);
  const [usedMap, setUsedMap] = useState({});

  // Po načtení léků si načteme i historii použití pro každý med.id
  useEffect(() => {
    // jen když máme data a stav 'ready'
    const stockList = data?.stockList || [];
    if (state === "ready" && stockList.length > 0) {
      stockList.forEach(async (med) => {
        const res = await usageApi.list({ medicineId: med.id });
        if (res.ok) {
          const usedToday = res.data.usageList.some(
            (u) => new Date(u.usageDate).toDateString() === selectedDate.toDateString()
          );
          setUsedMap((m) => ({ ...m, [med.id]: usedToday }));
        }
      });
    }
  }, [state, data, selectedDate]);

  // Loading
  if (state === "pending") {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  // Error
  if (state === "error") {
    return (
      <Container className="py-5">
        Chyba při načítání dat: {data?.message || "neznámá chyba"}
      </Container>
    );
  }

  // Když je ready, ale žádná data (nebo prázdné pole), vykreslíme prázdnou zprávu
  const stockList = data?.stockList || [];
  if (stockList.length === 0) {
    return <Container className="py-5">Žádné léky ve skladu.</Container>;
  }

  // Rozčlenění na léky a suplementy
  const meds = stockList.filter((m) => m.category === "Lék");
  const sups = stockList.filter((m) => m.category === "Suplement");

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
                <td>{med.name}</td>
                <td className="text-center">
                  {used ? <CheckCircleFill /> : <SlashCircle />}
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
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={isPending}
                    onClick={() =>
                      handlerMap.handleUpdateStock({ id: med.id, delta: 1 })
                    }
                  >
                    <PlusSlashMinus />
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
      {renderGroup("Lék", meds)}
      {renderGroup("Suplement", sups)}
    </Container>
  );
}

export default MedicineListContent;
