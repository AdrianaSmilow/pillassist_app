// src/components/Medicine/MedicineDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import medicineApi from "../../api/medicine-api";
import { Pencil } from "react-bootstrap-icons";
import MedicineDeleteDialog from "./MedicineDeleteDialog.jsx"; // import dialogu

function MedicineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Stav načítání / editace / error
  const [state, setState] = useState("loading"); // loading | ready | saving | error
  const [error, setError] = useState(null);

  // Data a dočasné hodnoty formuláře
  const [med, setMed] = useState(null);
  const [values, setValues] = useState({});
  // Které pole je právě editované
  const [editMode, setEditMode] = useState({
    name: false,
    count: false,
    category: false,
  });

  // Stav pro zobrazení confirm dialogu
  const [showDelete, setShowDelete] = useState(false);

  // Načtení dat z backendu
  useEffect(() => {
    (async () => {
      const res = await medicineApi.get({ id });
      if (res.ok) {
        setMed(res.data.medicine);
        setValues({
          name: res.data.medicine.name,
          count: res.data.medicine.count,
          category: res.data.medicine.category,
        });
        setState("ready");
      } else {
        setError(res.data);
        setState("error");
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((cur) => ({ ...cur, [name]: value }));
  };

  const toggleEdit = (field) => {
    setEditMode((cur) => ({ ...cur, [field]: !cur[field] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setState("saving");
    const dto = {
      id,
      name: values.name,
      count: Number(values.count),
      category: values.category,
    };
    const res = await medicineApi.update(dto);
    if (res.ok) {
      navigate("/");
    } else {
      setError(res.data);
      setState("error");
    }
  };

  if (state === "loading") {
    return <Container className="mt-5 pt-5">Načítám detail…</Container>;
  }
  if (state === "error") {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="danger">{error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-5 pt-5" style={{ maxWidth: 600 }}>
      <h2>Detail léku</h2>
      <Form onSubmit={handleSave}>
        {/* Name */}
        <Form.Group className="mb-3 d-flex align-items-center">
          <Form.Label className="me-2 mb-0">Název:</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            disabled={!editMode.name || state === "saving"}
            required
          />
          <Pencil
            className="ms-2"
            style={{ cursor: "pointer" }}
            onClick={() => toggleEdit("name")}
          />
        </Form.Group>

        {/* Count */}
        <Form.Group className="mb-3 d-flex align-items-center">
          <Form.Label className="me-2 mb-0">Zásoba:</Form.Label>
          <Form.Control
            type="number"
            name="count"
            value={values.count}
            onChange={handleChange}
            disabled={!editMode.count || state === "saving"}
            required
          />
          <Pencil
            className="ms-2"
            style={{ cursor: "pointer" }}
            onClick={() => toggleEdit("count")}
          />
        </Form.Group>

        {/* Category */}
        <Form.Group className="mb-3 d-flex align-items-center">
          <Form.Label className="me-2 mb-0">Kategorie:</Form.Label>
          <Form.Select
            name="category"
            value={values.category}
            onChange={handleChange}
            disabled={!editMode.category || state === "saving"}
          >
            <option value="Lék">Lék</option>
            <option value="Suplement">Suplement</option>
          </Form.Select>
          <Pencil
            className="ms-2"
            style={{ cursor: "pointer" }}
            onClick={() => toggleEdit("category")}
          />
        </Form.Group>

        {/* Spodní panel tlačítek */}
        <div className="d-flex justify-content-between mt-4">
          <div>
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}   // vrátí zpět
            >
              Zpět
            </Button>
          </div>
          <div>
            <Button
              variant="info"
              className="me-2"
              onClick={() => navigate(`/medicine/${id}/usage-history`)}
            >
              Historie užití
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={state === "saving"}
            >
              Uložit změny
            </Button>
            <Button
              variant="danger"
              className="ms-2"
              disabled={state === "saving"}
              onClick={() => setShowDelete(true)}
            >
              Smazat lék
            </Button>
          </div>
        </div>
      </Form>

      {/* Potvrzovací dialog smazání */}
      {showDelete && (
        <MedicineDeleteDialog
          data={med}
          onClose={() => setShowDelete(false)}
        />
      )}
    </Container>
  );
}

export default MedicineDetail

