import { useState, useEffect } from "react";
import type { Variant } from "@/themes";

interface PaletteProps {
  variant: Variant;
  onSelect: (name: string) => void;
}

export function Palette({ variant, onSelect }: PaletteProps) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => { console.log(`mounted: ${variant.name}`); }, [variant]);
  return <ul className="palette">{variant.swatches.map(s => (
    <li key={s.id} onClick={() => { setActive(s.id); onSelect(s.id); }}>{s.hex}</li>
  ))}</ul>;
}
