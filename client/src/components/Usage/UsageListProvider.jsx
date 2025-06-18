// src/components/Usage/UsageListProvider.jsx

import { createContext, useState, useEffect } from "react";
import usageApi from "../../api/usage-api";

// Context, přes který komponenty získají data a handlery
export const UsageListContext = createContext();

function UsageListProvider({ medicineId, children }) {
  // Stav načítání / připravenosti / chyby
  const [dto, setDto] = useState({
    state: "pending",   // "pending" | "ready" | "error"
    data: null,         // { usageList: [...] }
    error: null,
  });
  // ID položky, u které právě probíhá delete nebo create
  const [pendingId, setPendingId] = useState(null);

  // Načteme historii užití
  async function handleLoad() {
    setDto({ ...dto, state: "pending" });
    const result = await usageApi.list({ medicineId });
    if (result.ok) {
      setDto({ state: "ready", data: result.data, error: null });
    } else {
      setDto({ state: "error", data: null, error: result.data });
    }
  }

  // Zaznamenání nového užití
  async function handleCreate(dtoIn) {
    setPendingId("create");
    setDto(curr => ({ ...curr, state: "pending" }));
    const result = await usageApi.create({ ...dtoIn, medicineId });
    if (result.ok) {
      // Doplní nový záznam do seznamu
      const newList = [...(dto.data?.usageList || []), result.data.usage];
      setDto({ state: "ready", data: { usageList: newList }, error: null });
    } else {
      setDto(curr => ({ state: "error", data: curr.data, error: result.data }));
    }
    setPendingId(null);
    return result;
  }

  // Smazání záznamu užití
  async function handleDelete(dtoIn) {
    setPendingId(dtoIn.usageId);
    setDto(curr => ({ ...curr, state: "pending" }));
    const result = await usageApi.delete(dtoIn);
    if (result.ok) {
      // Odebereme podle ID
      const filtered = dto.data.usageList.filter(u => u.id !== dtoIn.usageId);
      setDto({ state: "ready", data: { usageList: filtered }, error: null });
    } else {
      setDto(curr => ({ state: "error", data: curr.data, error: result.data }));
    }
    setPendingId(null);
    return result;
  }

  // Načte při mountu a při změně medicineId
  useEffect(() => {
    handleLoad();
  }, [medicineId]);

  return (
    <UsageListContext.Provider
      value={{
        ...dto,
        pendingId,
        handlerMap: { handleLoad, handleCreate, handleDelete },
      }}
    >
      {children}
    </UsageListContext.Provider>
  );
}

export default UsageListProvider