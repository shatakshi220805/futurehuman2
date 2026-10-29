import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Og() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0B0F17",
          color: "white",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 22, color: "#6ee7b7" }}>FUTUREHUMAN</div>
        <div style={{ fontSize: 64, fontWeight: 600, marginTop: 16 }}>The AI that understands your work</div>
        <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 24 }}>
          Meetings without a bot. Memory you control.
        </div>
      </div>
    ),
    size,
  );
}
