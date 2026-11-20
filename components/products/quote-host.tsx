"use client";

import dynamic from "next/dynamic";
import { useQuoteList } from "@/lib/quote-list";

// El drawer (formulario, zod, react-hook-form) se descarga solo cuando alguien abre "Mi cotización".
const QuoteDrawer = dynamic(() => import("./quote-drawer"), { ssr: false });

export function QuoteHost() {
  const { isOpen } = useQuoteList();
  return isOpen ? <QuoteDrawer /> : null;
}
