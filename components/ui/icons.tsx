import {
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  Building,
  Building2,
  CalendarCheck,
  CarFront,
  Cctv,
  Check,
  Cpu,
  FileQuestion,
  FileText,
  Fence,
  Home,
  Key,
  Laptop,
  Layers,
  LifeBuoy,
  LockKeyhole,
  Network,
  PackageCheck,
  RefreshCcw,
  Replace,
  Route,
  Ruler,
  ScanFace,
  SearchX,
  Siren,
  Stethoscope,
  UserCheck,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Registro de iconos por nombre: services.ts y site.ts guardan el nombre Lucide como texto. */
export const iconMap: Record<string, LucideIcon> = {
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  Building,
  Building2,
  CalendarCheck,
  CarFront,
  Cctv,
  Check,
  Cpu,
  FileQuestion,
  FileText,
  Fence,
  Home,
  Key,
  Laptop,
  Layers,
  LifeBuoy,
  LockKeyhole,
  Network,
  PackageCheck,
  RefreshCcw,
  Replace,
  Route,
  Ruler,
  ScanFace,
  SearchX,
  Siren,
  Stethoscope,
  UserCheck,
  Workflow,
  Wrench,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = iconMap[name];
  return Cmp ? <Cmp className={className} aria-hidden /> : null;
}

type SvgProps = { className?: string };

export function WhatsAppIcon({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm.01 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

/** Iconos de redes sociales (trazo 1.5px, consistentes con el resto de iconografía). */
export function SocialIcon({ id, className }: { id: string; className?: string }) {
  const common = { className, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (id) {
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07Z" />
        </svg>
      );
    case "whatsapp":
      return <WhatsAppIcon className={className} />;
    default:
      return null;
  }
}
