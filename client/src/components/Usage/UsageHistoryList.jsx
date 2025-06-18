// src/components/Usage/UsageHistoryList.jsx

import { useContext } from "react";
import { UsageListContext } from "./UsageListProvider.jsx";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";

function UsageHistoryList() {
  const { state, data } = useContext(UsageListContext);

  if (state === "pending") {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (state === "error") {
    return <Alert variant="danger">Chyba při načítání historie užití.</Alert>;
  }

  const list = data?.usageList || [];
  if (list.length === 0) {
    return <Alert variant="info">Žádné záznamy užití.</Alert>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Počet</th>
          <th>Poznámka</th>
        </tr>
      </thead>
      <tbody>
        {list.map((u) => (
          <tr key={u.id}>
            <td>{u.usageDate || "-"}</td>
            <td>{u.count}</td>
            <td>{u.note || "-"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UsageHistoryList