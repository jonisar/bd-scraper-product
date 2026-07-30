"use client";

import { createContext, useContext, useState } from "react";

type CatalogState = {
  query: string;
  setQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
};

const Ctx = createContext<CatalogState | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  return (
    <Ctx.Provider value={{ query, setQuery, category, setCategory }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}
