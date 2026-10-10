'use client';

import Image from 'next/image';
import React from 'react';

interface DandiyaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function DandiyaLogo({ className = 'w-10 h-10', size, showText = false }: DandiyaLogoProps) {
  const dimension = size ? { width: size, height: size } : {};

  return (
    <div className="flex items-center space-x-3">
      <Image
        src="/logo.svg"
        alt="Dandiya Night 3.0 Royal Festive Emblem"
        width={size ?? 120}
        height={size ?? 120}
        className={className}
        style={dimension}
        priority
      />

      {showText && (
        <div>
          <span className="block font-serif text-lg font-bold tracking-wider gold-gradient-text uppercase leading-none">
            Dandiya Night Katoria
          </span>
          <span className="block text-[10px] tracking-widest text-[#F5EFEB]/70 uppercase font-sans mt-0.5">
            Katoria's Ultimate Dandiya Utsav
          </span>
        </div>
      )}
    </div>
  );
}

export default DandiyaLogo;
