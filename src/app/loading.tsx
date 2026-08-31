import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <main
      className="cc-bg"
      role="status"
      aria-live="polite"
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "60vh",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <Spinner size={32} />
        <p className="cc-formhint">Loading CodeConnect…</p>
      </div>
    </main>
  );
}
