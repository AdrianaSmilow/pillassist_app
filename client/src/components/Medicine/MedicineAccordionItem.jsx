// pillassist_app/client/src/components/Medicine/MedicineAccordionItem.jsx

import { useContext } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/esm/Stack';

import { MedicineListContext } from './MedicineListProvider';
import MedicineItem from './MedicineItem'; // komponenta, která umí vykreslit detail jednoho léku (např. karta nebo formulář)

function MedicineAccordionItem({ medicineId, setMedicineFormData, setMedicineDeleteDialog }) {
  const { data } = useContext(MedicineListContext);
  const med = data?.medicineMap[medicineId];

  if (!med) return null;

  return (
    <Accordion.Item eventKey={medicineId} style={{ width: '100%' }}>
      <Accordion.Header className="p-0">
        <Stack direction="horizontal" gap={2}>
          {/* Levá část: název léku */}
          <div style={{ flexGrow: 1 }}>{med.name}</div>
          {/* Pravá část: aktuální počet */}
          <div className="text-end">{med.count}</div>
        </Stack>
      </Accordion.Header>

      <Accordion.Body>
        <Row>
          {/* Zde můžete např. vykreslit komponentu, která ukáže detail nebo další akce */}
          <MedicineItem
            med={med}
            setMedicineFormData={setMedicineFormData}
            setMedicineDeleteDialog={setMedicineDeleteDialog}
          />
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default MedicineAccordionItem;