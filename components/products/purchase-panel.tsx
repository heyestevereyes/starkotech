"use client";

import { ClipboardList } from "lucide-react";
import { useState } from "react";
import { formatMXN, type Product } from "@/content/products";
import { site } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/icons";
import { trackCta } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/contact";
import { useQuoteList } from "@/lib/quote-list";
import { AddToQuoteButton } from "./add-button";
import { InstallSwitch, QuantityStepper } from "./quantity-stepper";

const D = site.shop.detail;
const money = (n: number) => `${formatMXN(n)} ${site.shop.card.currency}`;

/** Cantidad, instalación y salidas (agregar a la lista o preguntar por WhatsApp) del detalle de producto. */
export function PurchasePanel({ product }: { product: Product }) {
  const { openList, has } = useQuoteList();
  const [qty, setQty] = useState(1);
  const [install, setInstall] = useState(false);
  const [added, setAdded] = useState(false);

  const hasInstallAmount = typeof product.installFrom === "number";
  const hint = hasInstallAmount
    ? D.install.hintFrom.replace("{price}", formatMXN(product.installFrom as number))
    : product.installNote
      ? D.install.hintNote.replace("{note}", product.installNote)
      : undefined;

  const waMessage = D.whatsappMessage.replace("{name}", product.name).replace("{price}", formatMXN(product.price));

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <QuantityStepper
          value={qty}
          onChange={setQty}
          label={D.quantity}
          decreaseLabel={D.decrease}
          increaseLabel={D.increase}
        />
        {qty > 1 ? (
          <p className="font-mono text-[0.9375rem] text-graphite">
            {money(product.price * qty)}
            {install && hasInstallAmount ? ` + ${formatMXN((product.installFrom as number) * qty)} ${D.installShort}` : ""}
          </p>
        ) : null}
      </div>

      <InstallSwitch checked={install} onChange={setInstall} label={D.install.label} hint={hint} className="mt-4" />

      <div className="mt-6 flex flex-col gap-3">
        <AddToQuoteButton
          product={product}
          variant="pill"
          qty={qty}
          install={install}
          label={D.add}
          doneLabel={D.added}
          onAdded={() => setAdded(true)}
          className="!bg-ink !text-mist hover:!bg-navy"
        />
        <a
          href={whatsappUrl(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCta("detalle_producto", `${D.whatsapp}: ${product.slug}`)}
          className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full border border-ink/30 px-7 text-[1.0625rem] font-medium text-ink transition-[border-color,background-color,transform] duration-300 ease-out-expo hover:border-ink hover:bg-ink/[0.05] active:scale-[0.98] active:bg-ink/10"
        >
          <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
          {D.whatsapp}
        </a>
      </div>

      {added || has(product.slug) ? (
        <button
          type="button"
          onClick={openList}
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-full px-1 text-[0.9375rem] font-medium text-cobalt underline underline-offset-4 transition-colors duration-200 hover:text-ink"
        >
          <ClipboardList className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          {D.viewList}
        </button>
      ) : null}
    </div>
  );
}
