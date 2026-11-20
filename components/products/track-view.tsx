"use client";

import { useEffect } from "react";
import type { Product } from "@/content/products";
import { track } from "@/lib/analytics";

/** Dispara view_item una vez por visita al detalle de un producto. */
export function TrackView({ product }: { product: Product }) {
  useEffect(() => {
    track("view_item", {
      currency: "MXN",
      value: product.price,
      items: [{ item_id: product.sku ?? product.slug, item_name: product.name, item_category: product.category, price: product.price }],
    });
  }, [product]);
  return null;
}
