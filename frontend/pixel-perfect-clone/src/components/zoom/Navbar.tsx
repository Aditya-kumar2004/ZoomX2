"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Sparkles, Grip, Menu, X, LogOut } from "lucide-react";
import { handleComingSoon } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    
    // Check localStorage for signed in user
    const stored = localStorage.getItem("zoom_user_name");
    setUserName(stored);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("zoom_user_name");
    localStorage.removeItem("zoom_user_email");
    localStorage.removeItem("zoom_is_host");
    localStorage.removeItem("zoom_display_name");
    setUserName(null);
    window.location.href = "/";
  };

  return (
    <nav
      className="sticky top-0 z-[1000] w-full transition-all duration-300"
      style={{
        background: scrolled ? "#FFFFFF" : "var(--zoom-navy)",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="h-16 px-6 lg:px-10 flex items-center justify-between max-w-[1500px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center mr-2 transition-colors duration-300" style={{ color: scrolled ? "#0B5CFF" : "#FFFFFF" }}>
          <svg viewBox="0 8.8 24 6.4" className="h-[34px] w-auto fill-current" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zoom Logo">
            <path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z" />
          </svg>
        </Link>

        {/* Center nav */}
        <div className={`hidden lg:flex items-center gap-[28px] text-[14.5px] font-semibold transition-colors duration-300 ${scrolled ? "text-[#0E0E2A]" : "text-white"}`}>
          <button 
            onClick={() => handleComingSoon("Zoom Products")}
            className="flex items-center gap-1 hover:text-[#0B5CFF]/85 cursor-pointer"
          >
            Products <ChevronDown size={14} />
          </button>
          <button 
            onClick={() => handleComingSoon("Zoom AI Companion")}
            className="flex items-center gap-1 hover:text-[#0B5CFF]/85 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3C9 6.3 6.3 9 3 9C6.3 9 9 11.7 9 15C9 11.7 11.7 9 15 9C11.7 9 9 6.3 9 3Z" fill="url(#sparkle-gradient-nav-1)" />
              <path d="M18 4C18 5.7 16.7 7 15 7C16.7 7 18 8.3 18 10C18 8.3 19.3 7 21 7C19.3 7 18 5.7 18 4Z" fill="url(#sparkle-gradient-nav-2)" />
              <defs>
                <linearGradient id="sparkle-gradient-nav-1" x1="3" y1="9" x2="15" y2="9" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#4A75FF" />
                  <stop offset="100%" stopColor="#8C52FF" />
                </linearGradient>
                <linearGradient id="sparkle-gradient-nav-2" x1="15" y1="7" x2="21" y2="7" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8C52FF" />
                  <stop offset="100%" stopColor="#FF66D4" />
                </linearGradient>
              </defs>
            </svg>
            AI <ChevronDown size={14} />
          </button>
          <button 
            onClick={() => handleComingSoon("Solutions Explorer")}
            className="flex items-center gap-1 hover:text-[#0B5CFF]/85 cursor-pointer"
          >
            Solutions <ChevronDown size={14} />
          </button>
          <button 
            onClick={() => handleComingSoon("Zoom Pricing & Plans")}
            className="hover:text-[#0B5CFF]/85 cursor-pointer"
          >
            Pricing
          </button>
        </div>

        {/* Right buttons */}
        <div className={`hidden lg:flex items-center gap-5 text-[14.5px] font-semibold transition-colors duration-300 ${scrolled ? "text-[#0E0E2A]" : "text-white"}`}>
          <button 
            onClick={() => handleComingSoon("Enterprise Global Search")}
            aria-label="Search" 
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${scrolled ? "text-zinc-700 hover:bg-zinc-100" : "text-white hover:bg-white/10"}`}
          >
            <Search size={18} />
          </button>
          <button 
            onClick={() => handleComingSoon("Quick Meet")}
            className="flex items-center gap-1 hover:text-[#0B5CFF]/85 cursor-pointer"
          >
            Meet <ChevronDown size={14} />
          </button>
          
          <Link href="/dashboard" className="hover:text-[#0B5CFF]/85 cursor-pointer">Dashboard</Link>
          
          {userName ? (
            <div className="flex items-center gap-3.5 pl-2 border-l border-zinc-500/20">
              <div 
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[13px] border border-blue-500/20 select-none shadow-sm cursor-pointer hover:bg-blue-500 transition-colors" 
                title={userName}
              >
                {userName.substring(0, 2).toUpperCase()}
              </div>
              <button 
                onClick={handleSignOut}
                className={`flex items-center gap-1 text-[13px] font-bold cursor-pointer transition-colors ${
                  scrolled ? "text-red-500 hover:text-red-600" : "text-red-400 hover:text-red-500"
                }`}
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link href="/signin" className="hover:text-[#0B5CFF]/85 cursor-pointer">Sign In</Link>
              <button 
                onClick={() => handleComingSoon("Zoom Global Help Desk")}
                className="hover:text-[#0B5CFF]/85 cursor-pointer bg-transparent border-0"
              >
                Support
              </button>
              <button
                onClick={() => handleComingSoon("Enterprise Sales Inquiry")}
                className="px-5 py-2 rounded-lg text-[#0E0E2A] text-[14px] font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                style={{
                  background: "#FFFFFF",
                  border: scrolled ? "1px solid rgba(14, 14, 42, 0.2)" : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F3F4F6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                }}
              >
                Contact Sales
              </button>
              <Link href="/signup"
                className="px-5 py-2 rounded-lg text-white text-[14px] font-bold animate-soft-pulse transition-all cursor-pointer hover:scale-[1.02]"
                style={{ background: "var(--zoom-blue)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--zoom-blue-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--zoom-blue)")}
              >
                Sign Up Free
              </Link>
            </>
          )}

          <button 
            onClick={() => handleComingSoon("Zoom Apps Marketplace")}
            aria-label="Apps" 
            className={`p-1 cursor-pointer shrink-0 transition-colors ${scrolled ? "text-zinc-700 hover:text-zinc-950" : "text-white/80 hover:text-white"}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="5" r="2" />
              <circle cx="12" cy="5" r="2" />
              <circle cx="19" cy="5" r="2" />
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
              <circle cx="5" cy="19" r="2" />
              <circle cx="12" cy="19" r="2" />
              <circle cx="19" cy="19" r="2" />
            </svg>
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden transition-colors ${scrolled ? "text-zinc-800" : "text-white"}`}
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className={`lg:hidden border-t px-6 py-4 flex flex-col gap-3 text-[15px] transition-colors duration-300 ${scrolled ? "text-[#0E0E2A] bg-white border-zinc-200" : "text-white bg-zinc-950/95 border-white/10"}`}>
          <button onClick={() => handleComingSoon("Zoom Products")} className="text-left w-full hover:text-[#0B5CFF]">Products</button>
          <button onClick={() => handleComingSoon("Zoom AI Companion")} className="text-left w-full hover:text-[#0B5CFF]">AI</button>
          <button onClick={() => handleComingSoon("Solutions Explorer")} className="text-left w-full hover:text-[#0B5CFF]">Solutions</button>
          <button onClick={() => handleComingSoon("Zoom Pricing & Plans")} className="text-left w-full hover:text-[#0B5CFF]">Pricing</button>
          <Link href="/dashboard" className="hover:text-[#0B5CFF]">Dashboard</Link>
          
          {userName ? (
            <div className="flex items-center justify-between w-full pt-3 mt-1 border-t border-dashed border-zinc-500/20">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs select-none shadow">
                  {userName.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold text-sm text-zinc-400 capitalize truncate max-w-[120px]">{userName}</span>
              </div>
              <button onClick={handleSignOut} className="text-red-500 font-bold text-sm hover:underline flex items-center gap-1">
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link href="/signin" className="hover:text-[#0B5CFF]">Sign In</Link>
              <button onClick={() => handleComingSoon("Zoom Global Help Desk")} className="text-left w-full hover:text-[#0B5CFF]">Support</button>
              <Link href="/signup" className="mt-2 px-4 py-2.5 rounded-lg text-white font-bold text-sm text-center cursor-pointer transition-all" style={{ background: "var(--zoom-blue)" }}>
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}