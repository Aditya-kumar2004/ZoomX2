export function FinalCTA() {
  return (
    <section className="bg-white py-20 px-6 text-center">
      <h2 className="font-extrabold leading-tight" style={{ fontSize: 48, color: "var(--zoom-dark)" }}>
        See what Zoom can do
        <br />
        for your business
      </h2>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button
          className="px-8 py-3.5 rounded-lg text-white font-semibold text-[16px] transition-colors"
          style={{ background: "var(--zoom-blue)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--zoom-blue-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--zoom-blue)")}
        >
          Get started today
        </button>
        <button
          className="px-8 py-3.5 rounded-lg font-semibold text-[16px] transition-colors"
          style={{ background: "transparent", border: "2px solid var(--zoom-dark)", color: "var(--zoom-dark)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Find your plan
        </button>
      </div>
      <p className="mt-8 mx-auto max-w-[640px] text-[13px]" style={{ color: "var(--zoom-muted)" }}>
        <span className="font-semibold" style={{ color: "var(--zoom-dark)" }}>Zoom AI Companion</span> is available with eligible paid Zoom Workplace plans. May not be available for all regions or industry verticals.{" "}
        <a href="#" style={{ color: "var(--zoom-blue)" }}>Learn more.</a>
      </p>
    </section>
  );
}