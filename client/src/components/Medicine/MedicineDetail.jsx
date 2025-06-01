// pillassist_app/client/src/components/Medicine/MedicineDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMedicineById } from '../../api/medicine-api';

function MedicineDetail() {
  const { id } = useParams();             // parametr :id z URL
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        // Načte detail léku z backendu
        const med = await getMedicineById(id);
        setMedicine(med);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return <p>Načítám detail léku…</p>;
  }
  if (error) {
    return <div className="alert alert-danger">Chyba: {error}</div>;
  }
  if (!medicine) {
    return <div className="alert alert-warning">Lék s ID {id} nebyl nalezen.</div>;
  }

  return (
    <div>
      <h2>Detail léku: {medicine.name}</h2>

      <div className="card mb-4">
        <div className="card-body">
          <p><strong>ID:</strong> {medicine.id}</p>
          <p><strong>Kategorie:</strong> {medicine.category}</p>
          <p><strong>Aktuální počet:</strong> {medicine.count}</p>
          <p><strong>Hranice nízké zásoby:</strong> {medicine.lowStockThreshold}</p>
          {medicine.activeSubstance && (
            <p><strong>Účinná látka:</strong> {medicine.activeSubstance}</p>
          )}
          {medicine.doseStrength && (
            <p><strong>Síla dávky:</strong> {medicine.doseStrength}</p>
          )}
          {medicine.dosageRecommend && (
            <p><strong>Doporučené dávkování:</strong> {medicine.dosageRecommend}</p>
          )}
          {medicine.note && (
            <p><strong>Poznámka:</strong> {medicine.note}</p>
          )}
        </div>
      </div>

      <Link to="/" className="btn btn-secondary">
        Zpět na přehled
      </Link>
    </div>
  );
}
export default MedicineDetail;

