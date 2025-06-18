// src/components/Medicine/MedicineListContent.jsx

import { useContext, useState, useEffect } from "react";
import { MedicineListContext } from "./MedicineListProvider";
import usageApi from "../../api/usage-api";  // import pro dotazy na historii užití
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
  const { state, data, pendingId, handlerMap } =
    useContext(MedicineListContext);

  // usedMap: { [medicineId]: boolean } – už měl medicine záznam užití v selectedDate?
  const [usedMap, setUsedMap] = useState({});

  // Po načtení dat načte i historii užití pro každý med.id
  useEffect(() => {
    if (state === "ready") {
      (data.stockList || []).forEach(async (med) => {
        const res = await usageApi.list({ medicineId: med.id });
        if (res.ok) {
          const usedToday = res.data.usageList.some(
            (u) =>
              new Date(u.usageDate).toDateString() ===
              selectedDate.toDateString()
          );
          setUsedMap((m) => ({ ...m, [med.id]: usedToday }));
        }
      });
    }
  }, [state, data, selectedDate]);

  if (state === "pending") {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (state === "error") {
    return <Container>Chyba při načítání dat: {data?.message}</Container>;
  }

  const list = data?.stockList || [];
  const meds = list.filter((m) => m.category === "Lék");
  const sups = list.filter((m) => m.category === "Suplement");

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
            const used = usedMap[med.id] || false; // jestli už bylo použito

            return (
              <tr key={med.id}>
                <td>{med.name}</td>

                {/* Užito podle usedMap */}
                <td className="text-center">
                  {used ? (
                    <CheckCircleFill color="green" />
                  ) : (
                    <SlashCircle />
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
                      <DatabaseExclamation color="orange" />
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

export default MedicineListContent