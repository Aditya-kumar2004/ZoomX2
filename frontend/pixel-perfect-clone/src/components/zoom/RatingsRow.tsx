import { Star } from "lucide-react";

function Stars() {
  return (
    <div className="flex items-center gap-0.5 justify-center mt-2">
      {[0, 1, 2, 3].map((i) => (
        <Star key={i} size={18} className="fill-[#232733] text-[#232733]" />
      ))}
      <Star size={18} className="text-[#232733]" style={{ fill: "url(#half)" }} />
      <svg width="0" height="0">
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="#232733" />
            <stop offset="50%" stopColor="#E4E4E7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Col({ score, count, logo }: { score: string; count: string; logo: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-4 text-center">
      <div className="text-[38px] font-black tracking-tight text-[#232733] leading-none">{score}</div>
      <Stars />
      <div className="text-[12.5px] mt-1.5 font-medium text-zinc-500">{count}</div>
      <div className="mt-3.5 flex items-center justify-center h-10">{logo}</div>
    </div>
  );
}

export function RatingsRow() {
  return (
    <section className="bg-white pb-20 pt-4 px-6 lg:px-20 select-none">
      <div className="max-w-[820px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
        <Col
          score="4.5/5"
          count="out of 7.9k+ reviews"
          logo={
            <div className="flex flex-col items-center text-[#232733] leading-none">
              <span className="font-serif font-extrabold text-[15.5px]" style={{ fontFamily: "Georgia, serif" }}>Gartner</span>
              <span className="text-[9.5px] tracking-wider font-extrabold text-zinc-500 mt-1 uppercase">Peer Insights™</span>
            </div>
          }
        />
        <Col
          score="4.6/5"
          count="out of 54.9k+ reviews"
          logo={
            <div className="flex items-center gap-1.5 text-[#232733] font-black">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9zm-2.5-9v2h3v-2h-3zm0-3v2h3V9h-3zm5.5 3.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              </svg>
              <span className="text-[17px] tracking-tight font-extrabold">G2</span>
            </div>
          }
        />
        <Col
          score="8.5/10"
          count="out of 5.8k+ reviews"
          logo={
            <div className="flex items-center gap-1.5 text-[#232733]">
              <svg className="w-[18px] h-[18px] text-[#232733] fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 22h8l2-4 2 4h8L12 2zm-1 14l-2 4H6l5-10 4 8h-4z" />
              </svg>
              <span className="font-extrabold text-[15px] tracking-tight">TrustRadius</span>
            </div>
          }
        />
      </div>
    </section>
  );
}