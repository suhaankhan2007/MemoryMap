import React from "react";

export function MemoryMapLogo({ className = "w-10 h-10", ...props }) {
  const gradientId = "memory-map-gradient-logo";
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={className} 
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333ea"/>
          <stop offset="50%" stopColor="#2563eb"/>
          <stop offset="100%" stopColor="#0891b2"/>
        </linearGradient>
      </defs>
      <text 
        x="50" 
        y="80" 
        fontFamily="sans-serif" 
        fontWeight="900" 
        fontSize="85" 
        textAnchor="middle" 
        fill={`url(#${gradientId})`}
      >
        M
      </text>
    </svg>
  );
}



