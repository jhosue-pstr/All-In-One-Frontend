import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { sitioService } from "../services/sitio";
import type { Sitio } from "../models";

interface SiteContextType {
  siteId: number | null;
  siteNombre: string | null;
  sitios: Sitio[];
  setSite: (id: number, nombre: string) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteId, setSiteId] = useState<number | null>(null);
  const [siteNombre, setSiteNombre] = useState<string | null>(null);
  const [sitios, setSitios] = useState<Sitio[]>([]);

  useEffect(() => {
    sitioService.getAll().then((data) => {
      const list = Array.isArray(data) ? data : [];
      setSitios(list);
      if (list.length > 0) {
        setSiteId(list[0].id);
        setSiteNombre(list[0].nombre);
      }
    }).catch(() => {});
  }, []);

  const setSite = useCallback((id: number, nombre: string) => {
    setSiteId(id);
    setSiteNombre(nombre);
  }, []);

  return (
    <SiteContext.Provider value={{ siteId, siteNombre, sitios, setSite }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite debe usarse dentro de <SiteProvider>");
  return ctx;
}
