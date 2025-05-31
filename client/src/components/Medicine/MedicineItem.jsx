// pillassist_app/client/src/components/Medicine/MedicineItem.jsx

import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

/**
 * MedicineItem vykreslí jeden řádek v tabulce léků.
 *
 * @param {Object} props
 * @param {Object} props.med         - Objekt léku { id, name, category, count, … }
 * @param {function(Object|null): void} props.onEdit   - Callback pro editaci (nebo přidání, pokud med=null)
 * @param {function(Object): void} props.onDelete - Callback pro smazání položky
 */
export default function MedicineItem({ med, onEdit, onDelete }) {
  return (
    <tr>
      {/* Název jako odkaz na detail */}
      <td>
        <Link to={`/medicine/${med.id}`} className="text-decoration-none">
          {med.name}
        </Link>
      </td>
      <td>{med.category}</td>
      <td>{med.count}</td>
      <td>
        <Button
          variant="outline-primary"
          size="sm"
          className="me-2"
          onClick={() => onEdit(med)}
        >
          Edit
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(med)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
}
