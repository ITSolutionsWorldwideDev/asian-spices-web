//  apps/web/app/coming-soon/page.tsx

import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          marginBottom: "10px",
        }}
      >
        Coming Soon
      </h1>

      <p
        style={{
          maxWidth: "500px",
          marginBottom: "30px",
          color: "#666",
        }}
      >
        Our store is currently under maintenance
        and will be back soon.
      </p>

      <Link
        href="/site-access"
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Staff Access
      </Link>
    </main>
  );
}