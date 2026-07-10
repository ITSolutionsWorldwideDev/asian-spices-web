// components/ui/CountryFlag.tsx

import Image from "next/image";

interface CountryFlagProps {
  iso2: string; // e.g. "US", "DK", "PK"
  alt?: string;
  size?: number;
}

export default function CountryFlag({ iso2, alt = "flag", size = 20 }: CountryFlagProps) {
  if (!iso2) return null;
  
  const code = iso2.toLowerCase();
  
  return (
    <Image
      // Using the w80 asset directly guarantees crispness on retina/high-res screens
      src={`https://flagcdn.com/w80/${code}.png`}
      width={size}
      height={Math.round(size * 0.75)}
      alt={alt}
      className="inline-block object-contain rounded-sm shadow-sm"
      unoptimized
    />
  );
}