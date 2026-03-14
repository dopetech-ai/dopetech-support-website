export function SmartphoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="40" cy="76" rx="14" ry="2" fill="white" fillOpacity="0.03" />
      {/* Phone body - rounded with depth */}
      <rect x="22" y="4" width="36" height="68" rx="8" fill="#1a1a2e" stroke="#2a2a44" strokeWidth="1.5" />
      {/* Side highlight */}
      <rect x="22" y="4" width="36" height="68" rx="8" fill="url(#phoneSheen)" />
      {/* Screen bezel */}
      <rect x="25" y="10" width="30" height="56" rx="4" fill="#0d0d1a" />
      {/* Screen */}
      <rect x="26" y="11" width="28" height="54" rx="3" fill="#111122" />
      {/* Status bar */}
      <rect x="28" y="13" width="24" height="2" rx="1" fill="white" fillOpacity="0.04" />
      <circle cx="31" cy="14" r="0.6" fill="#00e5ff" fillOpacity="0.6" />
      <rect x="44" y="13.4" width="6" height="1.2" rx="0.6" fill="white" fillOpacity="0.15" />
      {/* Notch / dynamic island */}
      <rect x="33" y="12" width="14" height="3.5" rx="1.75" fill="#0a0a16" stroke="#222238" strokeWidth="0.5" />
      <circle cx="38" cy="13.75" r="1" fill="#1a1a30" stroke="#333350" strokeWidth="0.3" />
      {/* App icons row 1 */}
      <rect x="29" y="20" width="8" height="8" rx="2" fill="#00e5ff" fillOpacity="0.15" />
      <rect x="29" y="20" width="8" height="8" rx="2" stroke="#00e5ff" strokeWidth="0.3" strokeOpacity="0.3" />
      <rect x="40" y="20" width="8" height="8" rx="2" fill="#0088ff" fillOpacity="0.15" />
      <rect x="40" y="20" width="8" height="8" rx="2" stroke="#0088ff" strokeWidth="0.3" strokeOpacity="0.3" />
      {/* App icons row 2 */}
      <rect x="29" y="31" width="8" height="8" rx="2" fill="#6366f1" fillOpacity="0.15" />
      <rect x="29" y="31" width="8" height="8" rx="2" stroke="#6366f1" strokeWidth="0.3" strokeOpacity="0.3" />
      <rect x="40" y="31" width="8" height="8" rx="2" fill="#22c55e" fillOpacity="0.15" />
      <rect x="40" y="31" width="8" height="8" rx="2" stroke="#22c55e" strokeWidth="0.3" strokeOpacity="0.3" />
      {/* App labels */}
      <rect x="30" y="29.5" width="6" height="1" rx="0.5" fill="white" fillOpacity="0.08" />
      <rect x="41" y="29.5" width="6" height="1" rx="0.5" fill="white" fillOpacity="0.08" />
      {/* Bottom card / menu preview */}
      <rect x="28" y="43" width="24" height="14" rx="2.5" fill="white" fillOpacity="0.04" stroke="white" strokeWidth="0.3" strokeOpacity="0.08" />
      <rect x="30" y="45.5" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.12" />
      <rect x="30" y="49" width="16" height="1" rx="0.5" fill="white" fillOpacity="0.06" />
      <rect x="30" y="51.5" width="12" height="1" rx="0.5" fill="white" fillOpacity="0.06" />
      <rect x="42" y="45" width="8" height="3" rx="1.5" fill="#00e5ff" fillOpacity="0.2" />
      {/* Home indicator */}
      <rect x="34" y="62" width="12" height="2.5" rx="1.25" fill="white" fillOpacity="0.12" />
      {/* Side buttons */}
      <rect x="57.5" y="22" width="1.5" height="6" rx="0.75" fill="#2a2a44" />
      <rect x="57.5" y="32" width="1.5" height="10" rx="0.75" fill="#2a2a44" />
      <rect x="21" y="26" width="1.5" height="5" rx="0.75" fill="#2a2a44" />
      {/* Screen glow reflection */}
      <rect x="26" y="11" width="28" height="54" rx="3" fill="url(#screenGlow)" />
      <defs>
        <linearGradient id="phoneSheen" x1="22" y1="4" x2="58" y2="72">
          <stop offset="0" stopColor="white" stopOpacity="0.06" />
          <stop offset="0.5" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="0.03" />
        </linearGradient>
        <radialGradient id="screenGlow" cx="0.3" cy="0.2" r="0.8">
          <stop offset="0" stopColor="#00e5ff" stopOpacity="0.03" />
          <stop offset="1" stopColor="#00e5ff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export function LaptopIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="48" cy="74" rx="34" ry="3" fill="white" fillOpacity="0.03" />
      {/* Screen lid */}
      <rect x="12" y="4" width="72" height="48" rx="4" fill="#1a1a2e" stroke="#2a2a44" strokeWidth="1.5" />
      <rect x="12" y="4" width="72" height="48" rx="4" fill="url(#lidSheen)" />
      {/* Screen bezel */}
      <rect x="16" y="8" width="64" height="40" rx="2" fill="#0d0d1a" />
      {/* Screen */}
      <rect x="17" y="9" width="62" height="38" rx="1.5" fill="#111122" />
      {/* Camera */}
      <circle cx="48" cy="6" r="1.2" fill="#1a1a30" stroke="#333350" strokeWidth="0.4" />
      <circle cx="48" cy="6" r="0.5" fill="#22c55e" fillOpacity="0.3" />
      {/* Browser chrome */}
      <rect x="19" y="11" width="58" height="5" rx="1" fill="white" fillOpacity="0.04" />
      {/* Traffic lights */}
      <circle cx="22" cy="13.5" r="1.2" fill="#ff5f57" fillOpacity="0.7" />
      <circle cx="26" cy="13.5" r="1.2" fill="#ffbd2e" fillOpacity="0.7" />
      <circle cx="30" cy="13.5" r="1.2" fill="#28ca42" fillOpacity="0.7" />
      {/* URL bar */}
      <rect x="34" y="12" width="40" height="3" rx="1.5" fill="white" fillOpacity="0.06" />
      <rect x="36" y="13" width="14" height="1" rx="0.5" fill="white" fillOpacity="0.1" />
      {/* Website content - hero */}
      <rect x="19" y="18" width="58" height="12" rx="1" fill="url(#webGradient)" fillOpacity="0.12" />
      <rect x="25" y="21" width="20" height="2" rx="1" fill="white" fillOpacity="0.15" />
      <rect x="25" y="25" width="14" height="1.5" rx="0.75" fill="white" fillOpacity="0.08" />
      {/* Product cards */}
      <rect x="19" y="32" width="18" height="12" rx="1.5" fill="white" fillOpacity="0.04" stroke="white" strokeWidth="0.3" strokeOpacity="0.06" />
      <rect x="39" y="32" width="18" height="12" rx="1.5" fill="white" fillOpacity="0.04" stroke="white" strokeWidth="0.3" strokeOpacity="0.06" />
      <rect x="59" y="32" width="18" height="12" rx="1.5" fill="white" fillOpacity="0.04" stroke="white" strokeWidth="0.3" strokeOpacity="0.06" />
      {/* Card content */}
      <rect x="21" y="34" width="14" height="5" rx="1" fill="#0088ff" fillOpacity="0.1" />
      <rect x="41" y="34" width="14" height="5" rx="1" fill="#00e5ff" fillOpacity="0.1" />
      <rect x="61" y="34" width="14" height="5" rx="1" fill="#6366f1" fillOpacity="0.1" />
      <rect x="21" y="41" width="10" height="1" rx="0.5" fill="white" fillOpacity="0.08" />
      <rect x="41" y="41" width="10" height="1" rx="0.5" fill="white" fillOpacity="0.08" />
      <rect x="61" y="41" width="10" height="1" rx="0.5" fill="white" fillOpacity="0.08" />
      {/* Keyboard base */}
      <path d="M4 54 C4 52 8 52 12 52 L84 52 C88 52 92 52 92 54 L92 58 C92 60 90 62 88 62 L8 62 C6 62 4 60 4 58 Z" fill="#1a1a2e" stroke="#2a2a44" strokeWidth="1.5" />
      <path d="M4 54 C4 52 8 52 12 52 L84 52 C88 52 92 52 92 54 L92 58 C92 60 90 62 88 62 L8 62 C6 62 4 60 4 58 Z" fill="url(#baseSheen)" />
      {/* Keyboard keys */}
      {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
        <rect key={`k1-${i}`} x={14 + i * 6} y="54" width="4.5" height="2.5" rx="0.5" fill="white" fillOpacity="0.04" stroke="white" strokeWidth="0.2" strokeOpacity="0.06" />
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10].map((i) => (
        <rect key={`k2-${i}`} x={16 + i * 6} y="57.5" width="4.5" height="2.5" rx="0.5" fill="white" fillOpacity="0.04" stroke="white" strokeWidth="0.2" strokeOpacity="0.06" />
      ))}
      {/* Trackpad */}
      <rect x="34" y="63" width="28" height="8" rx="2" fill="#161628" stroke="#2a2a44" strokeWidth="0.75" />
      {/* Hinge line */}
      <line x1="8" y1="52.5" x2="88" y2="52.5" stroke="white" strokeWidth="0.3" strokeOpacity="0.06" />
      {/* Screen glow */}
      <rect x="17" y="9" width="62" height="38" rx="1.5" fill="url(#laptopScreenGlow)" />
      <defs>
        <linearGradient id="lidSheen" x1="12" y1="4" x2="84" y2="52">
          <stop offset="0" stopColor="white" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="baseSheen" x1="4" y1="54" x2="92" y2="62">
          <stop offset="0" stopColor="white" stopOpacity="0.04" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="webGradient" x1="19" y1="18" x2="77" y2="30">
          <stop offset="0" stopColor="#00e5ff" />
          <stop offset="1" stopColor="#0088ff" />
        </linearGradient>
        <radialGradient id="laptopScreenGlow" cx="0.4" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#0088ff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#0088ff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export function KioskIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 90" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="40" cy="86" rx="20" ry="2.5" fill="white" fillOpacity="0.03" />
      {/* Screen housing */}
      <rect x="8" y="2" width="64" height="48" rx="4" fill="#1a1a2e" stroke="#2a2a44" strokeWidth="1.5" />
      <rect x="8" y="2" width="64" height="48" rx="4" fill="url(#kioskSheen)" />
      {/* Screen */}
      <rect x="12" y="6" width="56" height="40" rx="2" fill="#0d0d1a" />
      <rect x="13" y="7" width="54" height="38" rx="1.5" fill="#111122" />
      {/* Top bar */}
      <rect x="15" y="9" width="50" height="4" rx="1" fill="white" fillOpacity="0.04" />
      <rect x="17" y="10.5" width="12" height="1.5" rx="0.75" fill="#00e5ff" fillOpacity="0.3" />
      <rect x="50" y="10" width="13" height="2.5" rx="1.25" fill="#00e5ff" fillOpacity="0.15" stroke="#00e5ff" strokeWidth="0.3" strokeOpacity="0.3" />
      {/* Menu grid - product tiles */}
      <rect x="15" y="16" width="16" height="14" rx="2" fill="white" fillOpacity="0.04" stroke="white" strokeWidth="0.3" strokeOpacity="0.06" />
      <rect x="33" y="16" width="16" height="14" rx="2" fill="white" fillOpacity="0.04" stroke="white" strokeWidth="0.3" strokeOpacity="0.06" />
      <rect x="51" y="16" width="16" height="14" rx="2" fill="white" fillOpacity="0.04" stroke="white" strokeWidth="0.3" strokeOpacity="0.06" />
      {/* Product images */}
      <rect x="17" y="18" width="12" height="7" rx="1" fill="#22c55e" fillOpacity="0.1" />
      <rect x="35" y="18" width="12" height="7" rx="1" fill="#f59e0b" fillOpacity="0.1" />
      <rect x="53" y="18" width="12" height="7" rx="1" fill="#6366f1" fillOpacity="0.1" />
      {/* Product names */}
      <rect x="17" y="27" width="10" height="1" rx="0.5" fill="white" fillOpacity="0.1" />
      <rect x="35" y="27" width="10" height="1" rx="0.5" fill="white" fillOpacity="0.1" />
      <rect x="53" y="27" width="10" height="1" rx="0.5" fill="white" fillOpacity="0.1" />
      {/* Cart / checkout bar */}
      <rect x="15" y="34" width="50" height="8" rx="2" fill="white" fillOpacity="0.03" stroke="white" strokeWidth="0.3" strokeOpacity="0.06" />
      <rect x="18" y="36.5" width="14" height="1.5" rx="0.75" fill="white" fillOpacity="0.1" />
      <rect x="18" y="39" width="8" height="1" rx="0.5" fill="white" fillOpacity="0.06" />
      <rect x="49" y="36" width="14" height="4" rx="2" fill="#00e5ff" fillOpacity="0.2" stroke="#00e5ff" strokeWidth="0.3" strokeOpacity="0.3" />
      {/* Stand - tapered neck */}
      <path d="M33 50 L35 50 L37 68 L43 68 L45 50 L47 50 L44 70 L36 70 Z" fill="#1a1a2e" stroke="#2a2a44" strokeWidth="1" />
      <path d="M33 50 L35 50 L37 68 L43 68 L45 50 L47 50 L44 70 L36 70 Z" fill="url(#standSheen)" />
      {/* Base plate */}
      <rect x="22" y="70" width="36" height="6" rx="3" fill="#1a1a2e" stroke="#2a2a44" strokeWidth="1.5" />
      <rect x="22" y="70" width="36" height="6" rx="3" fill="url(#baseGrad)" />
      {/* Base highlight */}
      <rect x="30" y="72" width="20" height="1" rx="0.5" fill="white" fillOpacity="0.04" />
      {/* Card reader on side */}
      <rect x="70" y="58" width="6" height="14" rx="2" fill="#1a1a2e" stroke="#2a2a44" strokeWidth="1" />
      <rect x="71.5" y="61" width="3" height="5" rx="0.5" fill="#0d0d1a" stroke="#333350" strokeWidth="0.3" />
      <rect x="72" y="62.5" width="2" height="1" rx="0.5" fill="#00e5ff" fillOpacity="0.2" />
      {/* Card reader slot */}
      <rect x="71" y="68" width="4" height="1" rx="0.5" fill="#0a0a16" />
      {/* Screen glow */}
      <rect x="13" y="7" width="54" height="38" rx="1.5" fill="url(#kioskGlow)" />
      <defs>
        <linearGradient id="kioskSheen" x1="8" y1="2" x2="72" y2="50">
          <stop offset="0" stopColor="white" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="standSheen" x1="33" y1="50" x2="47" y2="70">
          <stop offset="0" stopColor="white" stopOpacity="0.03" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="22" y1="70" x2="58" y2="76">
          <stop offset="0" stopColor="white" stopOpacity="0.03" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="kioskGlow" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#00e5ff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#00e5ff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
