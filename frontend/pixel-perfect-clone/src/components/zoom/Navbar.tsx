"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Sparkles, Grip, Menu, X, LogOut, Mail, Shield, Settings, LayoutDashboard } from "lucide-react";
import { handleComingSoon } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    
    // Check localStorage for signed in user
    const storedName = localStorage.getItem("zoom_user_name");
    const storedEmail = localStorage.getItem("zoom_user_email");
    const storedIsHost = localStorage.getItem("zoom_is_host") === "true";
    
    setUserName(storedName);
    setUserEmail(storedEmail || (storedName ? `${storedName.toLowerCase().replace(/\s+/g, "")}@zoomx.com` : null));
    setIsHost(storedIsHost);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!showProfileMenu) return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-dropdown-container")) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showProfileMenu]);

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
            <div className="profile-dropdown-container relative flex items-center pl-2 border-l border-zinc-500/20">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-rose-500 text-white flex items-center justify-center font-bold text-[13.5px] border border-white/20 select-none shadow-[0_4px_12px_rgba(139,92,246,0.25)] cursor-pointer hover:scale-105 hover:shadow-[0_4px_20px_rgba(139,92,246,0.4)] transition-all duration-300 ring-2 ring-violet-500/20 focus:outline-none"
                title={userName}
              >
                {userName.substring(0, 2).toUpperCase()}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 w-76 origin-top-right rounded-2xl border border-white/10 bg-[#0F0F23]/95 backdrop-blur-xl p-5 shadow-2xl z-[1001] animate-in fade-in slide-in-from-top-2 duration-200 text-white">
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-rose-500 text-white flex items-center justify-center font-bold text-base border border-white/20 shadow-md">
                      {userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-white text-[15px] capitalize truncate tracking-wide leading-snug">{userName}</span>
                      {userEmail && (
                        <span className="text-xs text-zinc-400 truncate max-w-[170px] font-medium leading-normal flex items-center gap-1 mt-0.5">
                          <Mail size={11} className="text-zinc-500 shrink-0" />
                          <span className="truncate">{userEmail}</span>
                        </span>
                      )}
                      <div className="mt-1.5 self-start">
                        {isHost ? (
                          <span className="text-[9px] font-black text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Shield size={9} className="text-fuchsia-400" />
                            <span>ZoomX Host</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-black text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Sparkles size={9} className="text-violet-400 animate-pulse" />
                            <span>ZoomX Premium</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-b border-white/5 my-4" />

                  {/* Quick Action Navigation links */}
                  <div className="space-y-1">
                    <Link 
                      href="/dashboard" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold group cursor-pointer"
                    >
                      <LayoutDashboard size={16} className="text-zinc-500 group-hover:text-violet-400 transition-colors" />
                      <span>Dashboard Hub</span>
                    </Link>
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleComingSoon("User Settings");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold group cursor-pointer text-left border-0 bg-transparent"
                    >
                      <Settings size={16} className="text-zinc-500 group-hover:text-fuchsia-400 transition-colors" />
                      <span>Account Settings</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-b border-white/5 my-4" />

                  {/* Red-highlighted Premium Sign Out Button */}
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-400 hover:text-white bg-red-500/5 hover:bg-red-500 border border-red-500/20 hover:border-red-500 shadow-md shadow-red-500/5 hover:shadow-red-500/20 transition-all text-sm font-bold cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
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
            <div className="flex flex-col gap-3.5 pt-4 mt-2 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-rose-500 text-white flex items-center justify-center font-bold text-base select-none border border-white/20 shadow">
                  {userName.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-white text-sm capitalize truncate leading-tight">{userName}</span>
                  {userEmail && (
                    <span className="text-xs text-zinc-400 truncate max-w-[200px] leading-normal flex items-center gap-1 mt-0.5">
                      <Mail size={11} className="text-zinc-500 shrink-0" />
                      <span>{userEmail}</span>
                    </span>
                  )}
                  <div className="mt-1.5 self-start">
                    {isHost ? (
                      <span className="text-[9px] font-black text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Shield size={9} className="text-fuchsia-400" />
                        <span>ZoomX Host</span>
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-violet-300 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Sparkles size={9} className="text-violet-400 animate-pulse" />
                        <span>ZoomX Premium</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSignOut} 
                className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold text-sm flex items-center justify-center gap-2 transition-all mt-1 cursor-pointer"
              >
                <LogOut size={14} />
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