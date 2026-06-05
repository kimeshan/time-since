import { ImageResponse } from "next/server";

// Dynamically generated social preview image (1200x630).
// Replaces the old hardcoded V1 screenshot. Served at /opengraph-image.
export const runtime = "edge";
export const alt = "Time Since — your club won a real trophy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(150deg, #EF0107 0%, #7a0c0c 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          ⏱  Time Since
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 900,
            lineHeight: 1.05,
            marginTop: 18,
          }}
        >
          Time Since
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            marginTop: 8,
            opacity: 0.95,
          }}
        >
          your club won a real trophy
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 40,
            padding: "14px 28px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.25)",
          }}
        >
          Only the league &amp; the Champions League count. The FA Cup doesn&apos;t.
        </div>
      </div>
    ),
    { ...size }
  );
}
