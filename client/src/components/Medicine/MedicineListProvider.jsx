// src/components/Medicine/MedicineListProvider.jsx

import { createContext, useState, useEffect } from "react";
// Wrapper nad všemi /medicine endpointy (list, create, lowStock, ackLowStock, updateStock)
import medicineApi from "../../api/medicine-api";

// Vytvoří Context, přes který budou komponenty číst stav a volat handlery
export const MedicineListContext = createContext();

function MedicineListProvider({ children }) {
  // medicineDto drží:
  // - state: "ready" | "pending" | "error"
  // - data: { stockList: [ ... ] }
  // - error: případná chybová zpráva
  const [medicineDto, setMedicineDto] = useState({
    state: "ready",
    data: null,
    error: null,
  });
  // pendingId – ID položky, u které právě probíhá operace (updateStock nebo ackLowStock)
  const [pendingId, setPendingId] = useState(null);

  /**
   * Načte celý seznam léků a uloží ho do stavu.
   */
  async function handleLoad() {
    setMedicineDto(curr => ({ ...curr, state: "pending" }));
    const result = await medicineApi.list();
    setMedicineDto(curr =>
      result.ok
        ? { state: "ready", data: result.data, error: null }
        : { state: "error", data: curr.data, error: result.data }
    );
  }

  /**
   * Vytvoří nový záznam léku.
   * dtoIn musí obsahovat { name, count, lowStockThreshold, category, … }
   */
  async function handleCreate(dtoIn) {
    setMedicineDto(curr => ({ ...curr, state: "pending" }));
    const result = await medicineApi.create(dtoIn);
    setMedicineDto(curr => {
      if (result.ok) {
        // Přidáme nově vytvořenou položku (result.data.medicine)
        const newList = [...(curr.data?.stockList || []), result.data.medicine];
        return { state: "ready", data: { stockList: newList }, error: null };
      } else {
        return { state: "error", data: curr.data, error: result.data };
      }
    });
    return result;
  }

  /**
   * Aktualizuje stav zásoby (delta může být kladná i záporná).
   * dtoIn = { id, delta }
   */
  async function handleUpdateStock(dtoIn) {
    setPendingId(dtoIn.id);
    setMedicineDto(curr => ({ ...curr, state: "pending" }));
    const result = await medicineApi.updateStock(dtoIn);
    setMedicineDto(curr => {
      if (result.ok) {
        // backend vrací { medicineId, currentStock }
        // proto v curr.data.stockList najdeme dané id a změníme jen count
        const list = curr.data.stockList.map(med =>
          med.id === result.data.medicineId
            ? { ...med, count: result.data.currentStock }
            : med
        );
        return { state: "ready", data: { stockList: list }, error: null };
      } else {
        return { state: "error", data: curr.data, error: result.data };
      }
    });
    setPendingId(null);
    return result;
  }

  /**
   * Potvrdí upozornění na nízkou zásobu (exclamation mark).
   * dtoIn = { medicineId }
   */
  async function handleAckLowStock(dtoIn) {
    setPendingId(dtoIn.medicineId);
    setMedicineDto(curr => ({ ...curr, state: "pending" }));
    const result = await medicineApi.ackLowStock(dtoIn);
    setMedicineDto(curr => {
      if (result.ok) {
        // backend vrací { medicineId, ordered }
        const list = curr.data.stockList.map(med =>
          med.id === result.data.medicineId
            ? { ...med, ordered: result.data.ordered }
            : med
        );
        return { state: "ready", data: { stockList: list }, error: null };
      } else {
        return { state: "error", data: curr.data, error: result.data };
      }
    });
    setPendingId(null);
    return result;
  }

  /**
   * Smaže lék a aktualizuje seznam
   * dtoIn = { id }
   */
  async function handleDelete(dtoIn) {
    setPendingId(dtoIn.id);
    setMedicineDto(curr => ({ ...curr, state: "pending" }));
    const result = await medicineApi.delete(dtoIn);
    if (result.ok) {
      // Odstraní jej z listu
      const list = medicineDto.data.stockList.filter(m => m.id !== dtoIn.id);
      setMedicineDto({ state: "ready", data: { stockList: list }, error: null });
    } else {
      setMedicineDto(curr => ({ state: "error", data: curr.data, error: result.data }));
    }
    setPendingId(null);
    return result;
  }

  // Načte data jednou při mountu
  useEffect(() => {
    handleLoad();
  }, []);

  // Hodnoty, které poskytuje
  const value = {
    ...medicineDto,       // state, data, error
    pendingId,            // ID probíhající operace
    handlerMap: {         // funkce pro CRUD a acknowledge
      handleLoad,
      handleCreate,
      handleUpdateStock,
      handleAckLowStock,
      handleDelete, 
    },
  };

  return (
    <MedicineListContext.Provider value={value}>
      {children}
    </MedicineListContext.Provider>
  );
}

export default MedicineListProvider;
