// src/components/Usage/UsageItem.jsx

import Button from "react-bootstrap/Button";
import { Trash } from "react-bootstrap-icons";

/**
 * UsageItem – jeden řádek tabulky pro záznam užití.
 * @param {{ usage: {id:string, usageDate:string, count:number, note:string}, pendingId: string, onDelete: (id:string)=>void }} props
 */
function UsageItem({ usage, pendingId, onDelete }) {
  const isPending = pendingId === usage.id;

  return (
    <tr>
      {/* Datum užití */}
      <td>{usage.usageDate || "-"}</td>
      {/* Počet kusů */}
      <td>{usage.count}</td>
      {/* Poznámka */}
      <td>{usage.note || "-"}</td>
      {/* Tlačítko smazat */}
      <td className="text-center">
        <Button
          variant="outline-danger"
          size="sm"
          disabled={isPending}
          onClick={() => onDelete(usage.id)}
        >
          <Trash />
        </Button>
      </td>
    </tr>
  );
}

export default UsageItem
