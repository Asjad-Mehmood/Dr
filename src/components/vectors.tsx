// Decorative medical vectors, drawn as SVG so they stay crisp at any size.
// Colours come from the --art-* tokens in globals.css and follow the theme.

export function CrossMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cross-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--art-mark-1)" }} />
          <stop offset="1" style={{ stopColor: "var(--art-mark-2)" }} />
        </linearGradient>
      </defs>
      <path
        d="M12.5 3h7a1.5 1.5 0 0 1 1.5 1.5V11h6.5a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H21v6.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5V21H4.5A1.5 1.5 0 0 1 3 19.5v-7A1.5 1.5 0 0 1 4.5 11H11V4.5A1.5 1.5 0 0 1 12.5 3Z"
        fill="url(#cross-mark)"
      />
      <path
        d="M12.5 4.2h3.2v6.6"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function SoftCross({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="soft-cross" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--art-1)" }} />
          <stop offset="1" style={{ stopColor: "var(--art-2)" }} />
        </linearGradient>
      </defs>
      <path
        d="M78 14h44a10 10 0 0 1 10 10v44h44a10 10 0 0 1 10 10v44a10 10 0 0 1-10 10h-44v44a10 10 0 0 1-10 10H78a10 10 0 0 1-10-10v-44H24a10 10 0 0 1-10-10V78a10 10 0 0 1 10-10h44V24a10 10 0 0 1 10-10Z"
        fill="url(#soft-cross)"
      />
      <path
        d="M80 22h36M22 80v36"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// A large, glassy line-art stethoscope for page backgrounds.
export function StethoscopeArt({ className = "" }: { className?: string }) {
  const tube = "url(#steth-tube)";
  return (
    <svg
      viewBox="0 0 420 560"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="steth-tube" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" style={{ stopColor: "var(--art-1)" }} />
          <stop offset="1" style={{ stopColor: "var(--art-2)" }} />
        </linearGradient>
        <radialGradient id="steth-bell" cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" style={{ stopColor: "var(--art-light)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--art-1)" }} />
          <stop offset="1" style={{ stopColor: "var(--art-2)" }} />
        </radialGradient>
      </defs>
      {/* Ear tubes joining at the yoke */}
      <path
        d="M118 42C100 140 128 214 196 252"
        stroke={tube}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M268 42C288 140 262 214 196 252"
        stroke={tube}
        strokeWidth="13"
        strokeLinecap="round"
      />
      {/* Main tube down to the chest piece */}
      <path
        d="M196 252C196 330 132 360 138 432C144 504 236 524 290 470C312 448 320 426 322 404"
        stroke={tube}
        strokeWidth="15"
        strokeLinecap="round"
      />
      {/* Glassy highlights */}
      <path
        d="M114 70C106 140 128 196 178 236"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M190 268C188 330 128 368 134 430"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Ear tips */}
      <circle cx="118" cy="34" r="13" fill="url(#steth-bell)" />
      <circle cx="268" cy="34" r="13" fill="url(#steth-bell)" />
      {/* Chest piece */}
      <circle cx="324" cy="362" r="52" fill="url(#steth-bell)" />
      <circle
        cx="324"
        cy="362"
        r="34"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="4"
      />
      <circle
        cx="324"
        cy="362"
        r="16"
        style={{ fill: "var(--art-light)" }}
        opacity="0.8"
      />
      <path
        d="M296 338a36 36 0 0 1 22-14"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DotGrid({
  className = "",
  rows = 4,
  cols = 8,
}: {
  className?: string;
  rows?: number;
  cols?: number;
}) {
  const gap = 14;
  return (
    <svg
      viewBox={`0 0 ${cols * gap} ${rows * gap}`}
      className={className}
      aria-hidden="true"
    >
      {Array.from({ length: rows * cols }, (_, i) => (
        <circle
          key={i}
          cx={(i % cols) * gap + gap / 2}
          cy={Math.floor(i / cols) * gap + gap / 2}
          r="2"
          style={{ fill: "var(--art-dot)" }}
        />
      ))}
    </svg>
  );
}

export function Rings({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      {[60, 110, 160, 210].map((r) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          style={{ stroke: "var(--art-ring)" }}
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

// The background used behind page headers and the home hero.
// The background used behind page headers and the home hero. The large
// version frames centred hero text; the small one keeps clear of the
// left-aligned page titles.
export function HeaderBackdrop({ large = false }: { large?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--art-glow),transparent_70%)]" />
      <Rings className="absolute -top-40 -left-40 size-[34rem] opacity-70" />
      {large ? (
        <>
          <SoftCross className="absolute top-[38%] left-4 hidden size-48 opacity-60 md:block" />
          <StethoscopeArt className="float-slow absolute -top-10 -right-36 h-[24rem] opacity-30 sm:-right-16 sm:h-[34rem] sm:opacity-60 md:-right-6 md:opacity-80 lg:right-4 lg:h-[36rem]" />
          <DotGrid className="absolute bottom-6 left-4 hidden w-32 opacity-80 sm:left-8 sm:block" />
          <DotGrid
            className="absolute right-6 bottom-6 hidden w-28 opacity-80 sm:block"
            rows={3}
            cols={7}
          />
        </>
      ) : (
        <>
          <StethoscopeArt className="float-slow absolute -top-10 -right-24 hidden h-80 opacity-80 sm:block lg:right-0" />
          <SoftCross className="absolute right-56 bottom-8 hidden size-20 opacity-50 lg:block" />
          <DotGrid
            className="absolute right-6 bottom-6 hidden w-28 opacity-80 sm:block"
            rows={3}
            cols={7}
          />
        </>
      )}
    </div>
  );
}
