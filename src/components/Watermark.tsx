"use client";

export function Watermark() {
  return (
    <a
      href="https://moodlyai.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-[9998] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white shadow-lg hover:bg-black/90 transition-all hover:scale-105 select-none pointer-events-auto"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <svg width="14" height="11" viewBox="0 0 25 22" fill="none">
        <path d="M11.731 5.43c1.295 2.776 4.11 4.706 7.367 4.706v2.827h-.028c-4.479 0-8.124 3.65-8.124 8.136H8.122v-.002c0-4.096 2.255-7.675 5.588-9.556a11 11 0 0 1-3.387-2.992c.616-.97 1.09-2.02 1.408-3.12M10.946 2c0 2.929-1.138 5.68-3.207 7.752a11 11 0 0 1-2.346 1.793c1.32.751 2.469 1.77 3.375 2.98a12.2 12.2 0 0 0-1.415 3.101c-1.25-2.655-3.894-4.529-6.98-4.669q-.187.006-.373.006V10.12q.188 0 .373.006a8.07 8.07 0 0 0 5.372-2.374A8.08 8.08 0 0 0 8.122 2z" fill="white"/>
      </svg>
      <span className="text-[11px] font-medium tracking-tight">Made with Together</span>
    </a>
  );
}
