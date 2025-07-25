// src/components/Usage/UsageList.jsx

import { useContext } from "react";
import { UsageListContext } from "./UsageListProvider.jsx";
import UsageItem from "./UsageItem.jsx";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";

/**
 * UsageList – komponenta, která vykreslí historii užití jako tabulku.
 * Používá UsageListContext pro načtení dat a handlery.
 */
function UsageList() {
  const { state, data, pendingId, handlerMap } = useContext(UsageListContext);

  // Zobrazení načítání
  if (state === "pending") {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  // Zobrazení chyby
  if (state === "error") {
    return <Alert variant="danger">Chyba při načítání historie užití.</Alert>;
  }

  // Data
  const list = data?.usageList ?? [];
  if (list.length === 0) {
    return <Alert variant="info">Žádné záznamy užití.</Alert>;
  }

  // Funkce pro smazání
  const handleDelete = (id) => {
    handlerMap.handleDelete({ usageId: id });
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Počet</th>
          <th>Poznámka</th>
          <th>Akce</th>
        </tr>
      </thead>
      <tbody>
        {list.map((u) => (
          <UsageItem
            key={u.id}
            usage={u}
            pendingId={pendingId}
            onDelete={handleDelete}
          />
        ))}
      </tbody>
    </Table>
  );
}

export default UsageList