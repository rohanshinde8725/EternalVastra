import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ className = "h-11 sm:h-14 lg:h-16", to = "/", light = false }) => {
  const content = (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 320 72"
        className="h-full w-auto max-h-full"
        style={{ aspectRatio: "320 / 72", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="evGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D77F" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#C59B27" />
            <stop offset="100%" stopColor="#9A7B1C" />
          </linearGradient>
          <linearGradient id="evCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={light ? "#FFA5B4" : "#8E1F36"} />
            <stop offset="50%" stopColor={light ? "#FFD1DA" : "#701A2B"} />
            <stop offset="100%" stopColor={light ? "#FFFFFF" : "#4A0E1A"} />
          </linearGradient>
          <linearGradient id="evText" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={light ? "#FFFFFF" : "#701A2B"} />
            <stop offset="100%" stopColor={light ? "#FFE4E8" : "#4A1521"} />
          </linearGradient>
        </defs>

        {/* ================= ROYAL EMBLEM ================= */}
        <g transform="translate(6, 4)">
          {/* Outer Ring */}
          <circle cx="32" cy="32" r="30" stroke="url(#evGold)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7" fill="none" />
          <circle cx="32" cy="32" r="26.5" stroke="url(#evCrimson)" strokeWidth="1" opacity="0.3" fill="none" />

          {/* Central Lotus Petals */}
          {/* Center Main Petal */}
          <path d="M32 9 C29 17, 27 24, 32 33 C37 24, 35 17, 32 9 Z" fill="url(#evCrimson)" />
          <circle cx="32" cy="9" r="1.5" fill="url(#evGold)" />

          {/* Left Upper Petal */}
          <path d="M32 33 C23 27, 17 21, 19 15 C23 17, 27 24, 32 33 Z" fill="url(#evGold)" opacity="0.9" />

          {/* Right Upper Petal */}
          <path d="M32 33 C41 27, 47 21, 45 15 C41 17, 37 24, 32 33 Z" fill="url(#evGold)" opacity="0.9" />

          {/* Left Wing Petal */}
          <path d="M32 33 C22 32, 11 31, 12 23 C17 24, 25 28, 32 33 Z" fill="url(#evCrimson)" />

          {/* Right Wing Petal */}
          <path d="M32 33 C42 32, 53 31, 52 23 C47 24, 39 28, 32 33 Z" fill="url(#evCrimson)" />

          {/* Bottom Royal Base Arch */}
          <path d="M20 40 C24 37, 28 35, 32 36 C36 35, 40 37, 44 40 C41 44, 36 46, 32 45 C28 46, 23 44, 20 40 Z" fill="url(#evGold)" />

          {/* Center Pearl & Accents */}
          <circle cx="32" cy="33" r="3.5" fill="url(#evGold)" />
          <circle cx="32" cy="33" r="1.8" fill="#FFFFFF" />
          <circle cx="32" cy="50" r="1.8" fill="url(#evGold)" />

          {/* Symmetrical Bottom Flourish */}
          <path d="M26 53 L32 49 L38 53" stroke="url(#evGold)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>

        {/* ================= TYPOGRAPHY ================= */}
        {/* Main Wordmark: ETERNAL VASTRA */}
        <text
          x="78"
          y="35"
          fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
          fontSize="23"
          fontWeight="800"
          letterSpacing="3"
          fill="url(#evText)"
        >
          ETERNAL
        </text>
        <text
          x="196"
          y="35"
          fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
          fontSize="23"
          fontWeight="400"
          letterSpacing="3"
          fill={light ? "#FCE7EB" : "#5A1624"}
        >
          VASTRA
        </text>

        {/* Thin Gold Separator Line */}
        <line x1="80" y1="43" x2="310" y2="43" stroke="url(#evGold)" strokeWidth="1" opacity="0.75" />
        <polygon points="195,40.5 198,43 195,45.5 192,43" fill="url(#evGold)" />

        {/* Subtitle: HERITAGE WEAVES & COUTURE */}
        <text
          x="195"
          y="56"
          textAnchor="middle"
          fontFamily="'Montserrat', 'Inter', sans-serif"
          fontSize="8"
          fontWeight="700"
          letterSpacing="4"
          fill={light ? "#E8BAC3" : "#8C4B59"}
        >
          HERITAGE WEAVES &amp; COUTURE
        </text>
      </svg>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="flex items-center flex-shrink-0 group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
        title="Eternal Vastra"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
