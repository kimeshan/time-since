// Pick a readable text colour (black/white) for a given background hex.

export function textOn(hex: string): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  // Relative luminance (sRGB, simplified).
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.6 ? "#0b1220" : "#ffffff";
}

/** Darken a hex colour by a factor (0..1) for gradients. */
export function darken(hex: string, factor = 0.55): string {
  const m = hex.replace("#", "");
  const r = Math.round((parseInt(m.slice(0, 2), 16) * factor));
  const g = Math.round((parseInt(m.slice(2, 4), 16) * factor));
  const b = Math.round((parseInt(m.slice(4, 6), 16) * factor));
  return `rgb(${r}, ${g}, ${b})`;
}
