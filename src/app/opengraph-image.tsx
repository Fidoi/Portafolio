import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen social generada dinámicamente (no requiere un asset estático).
// Se usa como tarjeta al compartir el sitio en LinkedIn, X, WhatsApp, etc.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(1200px 600px at 15% 0%, #4C1D95 0%, #0E0E11 55%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              fontSize: "44px",
              fontWeight: 800,
            }}
          >
            F
          </div>
          <span style={{ fontSize: "30px", color: "#C4B5FD" }}>
            {siteConfig.contact.email}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span style={{ fontSize: "76px", fontWeight: 800, lineHeight: 1.05 }}>
            {siteConfig.name}
          </span>
          <span style={{ fontSize: "40px", color: "#DDD6FE" }}>
            {siteConfig.role}
          </span>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          {["Next.js", "React", "TypeScript", "Prisma"].map((tech) => (
            <span
              key={tech}
              style={{
                fontSize: "26px",
                padding: "8px 20px",
                borderRadius: "999px",
                border: "1px solid #7C3AED",
                color: "#EDE9FE",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
