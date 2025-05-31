// Medicine/MedicineListProvider
// pillassist_app/client/src/components/Medicine/MedicineListProvider.jsx

import React, { createContext, useState, useEffect } from "react";
import {
  listMedicines,
  createMedicine,
  deleteMedicine,
  updateStock,
  getLowStockItems,
  acknowledgeLowStock,
} from "../../api/medicine-api";

// 1) Kontext pro seznam Medicine a souvisejících metod
export const MedicineListContext = createContext();

/**
 * MedicineListProvider 
 * Udržuje stav všech léků, načítá je z backendu, umožňuje CRUD operace a předává
 * data (včetně stavu pending/ready/error) do potomek.
 */
function MedicineListProvider({ children }) {
  // Stav, který sleduje načtení celého seznamu
  const [medicineListDto, setMedicineListDto] = useState({
    state: "ready", // one of "ready" | "pending" | "error"
    data: null,     // očekává se { itemList: [ { id, name, category, count, … }, … ] }
    error: null,
    pendingId: undefined, // pokud je třeba označit konkrétní položku jako "pending" (např. delete/updateStock)
  });

  // Stav pro vybraný měsíc/datum 
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // 2) handleLoad – načte aktuální seznam léků
  async function handleLoad() {
    setMedicineListDto((current) => ({ ...current, state: "pending" }));
    try {
      // Volání na GET /medicine/list
      const items = await listMedicines();
      // Po úspěchu uloží data
      setMedicineListDto({
        state: "ready",
        data: { itemList: items },
        error: null,
        pendingId: undefined,
      });
    } catch (err) {
      // V případě chyby uložíme error
      setMedicineListDto((current) => ({
        ...current,
        state: "error",
        error: err.message || "Chyba při načítání seznamu medicín",
      }));
    }
  }

  // 3) handleCreate – vytvoří nový lék (POST /medicine/create)
  async function handleCreate(dtoIn) {
    // Před voláním vytvoření změníme stav na "pending"
    setMedicineListDto((current) => ({ ...current, state: "pending" }));
    try {
      const created = await createMedicine(dtoIn);
      // Po úspěchu přidáme do current.data.itemList novou položku a obnovíme seznam
      setMedicineListDto((current) => {
        const updatedList = current.data
          ? [...current.data.itemList, created]
          : [created];
        return {
          state: "ready",
          data: { itemList: updatedList },
          error: null,
          pendingId: undefined,
        };
      });
      return { ok: true };
    } catch (err) {
      setMedicineListDto((current) => ({
        ...current,
        state: "error",
        error: err.message || "Chyba při vytváření léku",
      }));
      return { ok: false, error: err.message };
    }
  }

  // 4) handleUpdateStock – aktualizuje stav zásob léku (PUT /medicine/updateStock)
  async function handleUpdateStock(dtoIn) {
    // dtoIn = { medicineId, usedCount }
    setMedicineListDto((current) => ({
      ...current,
      state: "pending",
      pendingId: dtoIn.medicineId,
    }));
    try {
      const updated = await updateStock(dtoIn);
      // Po úspěchu najdeme položku v seznamu a aktualizujeme count
      setMedicineListDto((current) => {
        const idx = current.data.itemList.findIndex(
          (m) => m.id === dtoIn.medicineId
        );
        if (idx === -1) {
          // Nelze najít, vrátíme původní
          return {
            ...current,
            state: "ready",
            pendingId: undefined,
          };
        }
        // Kopie seznamu a update konkrétní položky
        const copyList = current.data.itemList.slice();
        copyList[idx] = { ...copyList[idx], count: updated.newCount };
        return {
          state: "ready",
          data: { itemList: copyList },
          error: null,
          pendingId: undefined,
        };
      });
      return { ok: true };
    } catch (err) {
      setMedicineListDto((current) => ({
        ...current,
        state: "error",
        error: err.message || "Chyba při aktualizaci zásoby",
        pendingId: undefined,
      }));
      return { ok: false, error: err.message };
    }
  }

  // 5) handleDelete – smaže lék (DELETE /medicine/delete)
  async function handleDelete(dtoIn) {
    // dtoIn = { id }
    setMedicineListDto((current) => ({
      ...current,
      state: "pending",
      pendingId: dtoIn.id,
    }));
    try {
      const result = await deleteMedicine(dtoIn.id);
      // Po úspěšném smazání odstraníme položku z itemList
      setMedicineListDto((current) => {
        const filtered = current.data.itemList.filter(
          (m) => m.id !== dtoIn.id
        );
        return {
          state: "ready",
          data: { itemList: filtered },
          error: null,
          pendingId: undefined,
        };
      });
      return { ok: true };
    } catch (err) {
      setMedicineListDto((current) => ({
        ...current,
        state: "error",
        error: err.message || "Chyba při mazání léku",
        pendingId: undefined,
      }));
      return { ok: false, error: err.message };
    }
  }

  // 6) handleLowStock – načtení položek s nízkou zásobou (GET /medicine/lowStock)
  async function handleLowStock() {
    try {
      const lowItems = await getLowStockItems();
      return { ok: true, data: lowItems };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  // 7) handleAcknowledgeLowStock – potvrdí, že uživatel viděl nízkou zásobu (PUT /medicine/ackLowStock)
  async function handleAcknowledgeLowStock(id) {
    try {
      await acknowledgeLowStock(id);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  // 8) useEffect, který zavolá handleLoad na začátku (podobně jako u FinManova CategoryListProvider)
  useEffect(() => {
    handleLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 9) Definice hodnoty, kterou provider předává do Contextu
  const value = {
    ...medicineListDto,
    selectedDate,
    setSelectedDate,
    handlerMap: {
      handleLoad,
      handleCreate,
      handleUpdateStock,
      handleDelete,
      handleLowStock,
      handleAcknowledgeLowStock,
    },
  };

  return (
    <MedicineListContext.Provider value={value}>
      {children}
    </MedicineListContext.Provider>
  );
}
export default MedicineListProvider;
