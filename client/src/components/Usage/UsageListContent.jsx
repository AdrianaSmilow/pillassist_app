// src/components/Usage/UsageListContent.jsx

import { useContext, useState } from "react";
import { UsageListContext } from "./UsageListProvider.jsx";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import { Trash } from "react-bootstrap-icons";
import UsageForm from "./UsageForm.jsx";
import UsageDeleteDialog from "./UsageDeleteDialog.jsx";

/**
 * Vykreslí historii užití v tabulce a umožní přidávat / mazat záznamy.
 */
function UsageListContent() {
  const { state, data, pendingId, handlerMap } = useContext(UsageListContext);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>Historie užití</h4>
        <Button onClick={() => setShowForm(true)}>Přidat užití</Button>
      </div>

      {list.length === 0 ? (
        <Alert variant="info">Žádné záznamy užití.</Alert>
      ) : (
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
            {list.map(u => (
              <tr key={u.id}>
                <td>{u.usageDate || "-"}</td>
                <td>{u.count}</td>
                <td>{u.note || "-"}</td>
                <td className="text-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={pendingId === u.id}
                    onClick={() => setDeleteId(u.id)}
                  >
                    <Trash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal pro přidání */}
      {showForm && (
        <UsageForm
          onClose={() => setShowForm(false)}
          onSubmit={async dto => {
            const res = await handlerMap.handleCreate(dto);
            if (res.ok) setShowForm(false);
          }}
        />
      )}

      {/* Dialog pro mazání */}
      {deleteId && (
        <UsageDeleteDialog
          usageId={deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={async id => {
            const res = await handlerMap.handleDelete({ usageId: id });
            if (res.ok) setDeleteId(null);
          }}
        />
      )}
    </Container>
  );
}

export default UsageListContent