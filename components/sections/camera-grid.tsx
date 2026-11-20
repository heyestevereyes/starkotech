import { site } from "@/content/site";

/** Mini panel en UI (no imagen) para la card de Videovigilancia: 4 cámaras abstractas con REC y estado en línea. */
export function CameraGrid() {
  const c = site.services.featuredCameras;
  return (
    <div aria-hidden="true" className="flex h-full flex-col rounded-[20px] border border-cobalt/50 bg-ink/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="grid flex-1 grid-cols-2 gap-2.5 sm:gap-3 lg:grid-rows-2">
        {c.cams.map((cam, i) => (
          <div
            key={cam.id}
            className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[7rem] rounded-xl border border-cobalt/40 bg-[radial-gradient(120%_100%_at_50%_100%,var(--color-cobalt)_0%,var(--color-navy)_70%)]"
          >
            {/* escena abstracta: horizonte, retícula y una silueta */}
            <div className="bg-blueprint absolute inset-0 opacity-70 [mask-image:none]" />
            <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
              <path d={["M0 70 H160", "M0 62 H160", "M0 74 H160", "M0 66 H160"][i]} stroke="var(--color-signal)" strokeOpacity="0.25" />
              <path d={["M30 70 V50 H60 V70", "M90 74 L110 40 L130 74", "M20 62 H70 M45 62 V35", "M100 66 V40 H140 V66"][i]} stroke="var(--color-signal)" strokeOpacity="0.55" strokeLinejoin="round" />
            </svg>
            <span className="absolute left-2 top-2 rounded-md bg-ink/80 px-1.5 py-0.5 font-mono text-[0.625rem] tracking-[0.08em] text-signal sm:text-[0.6875rem]">
              {cam.id}
            </span>
            <span className="absolute right-2 top-2 flex items-center gap-1 font-mono text-[0.625rem] tracking-[0.08em] text-mist">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-alert" />
              {c.rec}
            </span>
            <span className="absolute bottom-2 left-2 font-mono text-[0.625rem] text-mist/70 sm:text-[0.6875rem]">{cam.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[0.6875rem] tracking-[0.06em] text-mist/70">
        <span>{c.nvr}</span>
        <span className="inline-flex items-center gap-1.5 text-online">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-online" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-online" />
          </span>
          {c.statusLabel}
        </span>
      </div>
    </div>
  );
}
