import { ProductCarousel } from "./ProductCarousel";
import { handleComingSoon } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="zoom-hero-bg relative overflow-hidden">
      <div className="px-6 lg:px-10 pt-12 md:pt-20 pb-8 md:pb-12 flex flex-col items-center text-center">
        <h1
          className="text-white font-extrabold leading-[1.1] tracking-tight"
          style={{ fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-1px" }}
        >
          Find out what's possible
          <br />
          when work connects
        </h1>
        <p className="mt-4 md:mt-5 max-w-[850px] text-white text-[16px] md:text-[18px] leading-[1.7]">
          Bridge the gap between talking and doing with the AI-first work platform built for you.
        </p>

        <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => handleComingSoon("Zoom Product Suite Catalog")}
            className="px-7 py-3.5 rounded-lg text-white text-[16px] font-semibold transition-all cursor-pointer"
            style={{ background: "#0E0E2A" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1B1B47";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0E0E2A";
            }}
          >
            Explore products
          </button>
          <button
            onClick={() => handleComingSoon("Zoom Subscriptions & Plans Guide")}
            className="px-7 py-3.5 rounded-lg text-[16px] font-semibold transition-all cursor-pointer"
            style={{ background: "#FFFFFF", color: "#0E0E2A" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#EBF0FF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
          >
            Find your plan
          </button>
        </div>
      </div>
      <ProductCarousel />
    </section>
  );
}