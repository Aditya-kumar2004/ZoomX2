import { Linkedin, Youtube, Facebook, Instagram, Twitter, ChevronDown, Download } from "lucide-react";

const COLS = {
  About: ["Zoom Blog", "Customers", "Our Team", "Careers", "Integrations", "Partners", "Investors", "Press", "Sustainability & ESG", "Zoom Cares", "Media Kit", "How To Videos", "Developer Platform", "Zoom Ventures", "Zoom Merchandise Store"],
  Download: ["Zoom Workplace App", "Zoom Rooms App", "Zoom Rooms Controller", "Browser Extension", "Outlook Plug-in", "iPhone/iPad App", "Android App", "Zoom Virtual Backgrounds"],
  Sales: ["+1.888.799.9666", "Contact Sales", "Plans & Pricing", "Request a Demo", "Webinars and Events", "Zoom Experience Center", "Zoom for Startups"],
  Support: ["Test Zoom", "Account", "Support Center", "Learning Center", "Zoom Community", "Technical Content Library", "Feedback", "Contact Us", "Accessibility", "Developer Support", "Privacy, Security, Legal Policies, and Modern Slavery Act Transparency Statement"],
};

export function Footer() {
  return (
    <footer className="text-white px-6 lg:px-12 pt-16 pb-8" style={{ background: "#0B0C26" }}>
      {/* Top Section */}
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Column */}
        <div className="flex flex-col w-full lg:w-[260px] shrink-0">
          <svg viewBox="0 0 24 24" className="h-8 w-auto text-white fill-current mb-10" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zoom Logo">
            <path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z" />
          </svg>

          {/* Download Center Card */}
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors bg-white/5 border border-white/10 w-full mb-6">
            <div className="bg-white p-[5px] rounded-md shadow-sm shrink-0">
              <Download size={14} className="text-[#0B5CFF] stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-white">Download Center</div>
              <div className="text-[11px] text-white/80 mt-0.5">Get the most out of Zoom</div>
            </div>
          </div>

          {/* Select Dropdowns */}
          <div className="flex flex-col gap-3 w-full">
            {["English", "US Dollar $"].map((label) => (
              <button key={label} className="w-full flex items-center justify-between text-[12.5px] font-medium text-white/90 px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                {label} <ChevronDown size={14} className="opacity-70" />
              </button>
            ))}
          </div>

          {/* Get in touch */}
          <div className="mt-20">
            <div className="text-[13px] text-white/90 mb-1">Get in touch</div>
            <div className="text-[20px] font-bold text-white tracking-wide">+1.888.799.9666</div>
          </div>
        </div>

        {/* Right Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 flex-1 pt-2">
          {Object.entries(COLS).map(([title, links]) => (
            <div key={title} className="flex flex-col">
              <div className="text-[15px] font-bold text-white mb-6">{title}</div>
              <ul className="space-y-[18px]">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className={`text-[13.5px] font-medium transition-colors hover:underline ${l.startsWith("+1") ? "text-white" : "text-white/85"}`}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-[1400px] mx-auto mt-16 pt-8 flex flex-col md:flex-row gap-6 justify-between items-start border-t border-white/10">
        <div className="flex gap-5 text-white/70">
          <Linkedin size={20} className="hover:text-white cursor-pointer" />
          <Twitter size={20} className="hover:text-white cursor-pointer" />
          <Youtube size={20} className="hover:text-white cursor-pointer" />
          <Facebook size={20} className="hover:text-white cursor-pointer" />
          <Instagram size={20} className="hover:text-white cursor-pointer" />
        </div>
        <div className="text-left md:text-right max-w-[700px]">
          <p className="text-[12px] text-white/50">Copyright ©2026 Zoom Communications, Inc. All rights reserved.</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 justify-start md:justify-end text-[12px]">
            {["Terms", "Privacy", "Trust Center", "Acceptable Use Guidelines", "Legal & Compliance", "Your Privacy Choices", "Cookies Settings", "Site Map"].map((l) => (
              <a key={l} href="#" className="hover:text-white text-white/50 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}