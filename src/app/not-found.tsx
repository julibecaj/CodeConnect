import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="cc-bg"
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        padding: 24,
        textAlign: "center",
      }}
    >
      <section className="cc-cardv2" style={{ maxWidth: 520 }}>
        <h1 className="cc-section__title">Page not found</h1>
        <p className="cc-section__desc" style={{ marginTop: 8 }}>
          The page may have moved or does not exist.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 20,
          }}
        >
          <Link className="cc-pillbtn cc-pillbtn--primary" href="/">
            Return home
          </Link>
          <Link className="cc-pillbtn" href="/feed">
            View feed
          </Link>
        </div>
      </section>
    </main>
  );
}
