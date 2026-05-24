"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Apple, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    localStorage.setItem("zoom_user_name", fullName);
    localStorage.setItem("zoom_user_email", email.trim());
    
    router.push("/dashboard");
  };

  return (
    <div className="h-screen bg-white font-sans flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="h-16 px-6 lg:px-10 shrink-0 flex items-center justify-between border-b border-zinc-200">
        <Link href="/" className="font-extrabold" style={{ fontSize: 28, color: "var(--zoom-blue)" }}>zoom</Link>
        <div className="flex items-center gap-6 text-[14px]" style={{ color: "var(--zoom-dark)" }}>
          <span>Already have an account? <Link href="/signin" style={{ color: "var(--zoom-blue)" }} className="font-semibold hover:underline">Sign In</Link></span>
          <a href="#" className="hover:underline">Support</a>
          <button className="flex items-center gap-1">English <ChevronDown size={14} /></button>
        </div>
      </nav>

      <div className="flex-1 grid lg:grid-cols-[45%_55%] min-h-0">
        {/* Left Form */}
        <div className="flex items-center justify-center px-8 order-2 lg:order-1 border-r border-zinc-100 overflow-y-auto">
          <div className="w-full max-w-[400px] py-6">
            <h1 className="font-extrabold mb-1" style={{ fontSize: 32, color: "var(--zoom-dark)" }}>Sign Up Free</h1>
            <p className="text-gray-500 text-[14px] mb-6">Join millions of users worldwide and start connecting.</p>

            <form className="space-y-4" onSubmit={handleSignUp}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full h-[44px] px-4 rounded-xl text-[14px] outline-none transition-all border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full h-[44px] px-4 rounded-xl text-[14px] outline-none transition-all border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[44px] px-4 rounded-xl text-[14px] outline-none transition-all border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              
              <div className="space-y-1.5 relative">
                <label className="text-[13px] font-semibold text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[44px] px-4 rounded-xl text-[14px] outline-none transition-all border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[32px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="block w-full pt-2">
                <button
                  type="submit"
                  className="w-full h-[48px] rounded-xl text-white text-[15px] font-bold transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                  style={{ background: "var(--zoom-blue)" }}
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3 my-6 text-[13px] text-gray-400">
              <div className="flex-1 h-px bg-gray-200" />
              <span>Or sign up with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-[13px] text-gray-700">
                <span className="font-bold text-[16px]" style={{ color: "#4285F4" }}>G</span> Google
              </button>
              <button className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-[13px] text-gray-700">
                <Apple size={18} /> Apple
              </button>
            </div>

            <p className="mt-6 text-center text-[11px] text-gray-500 leading-relaxed">
              By signing up, I agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>.
            </p>
          </div>
        </div>

        {/* Right Banner */}
        <div className="p-6 lg:p-8 order-1 lg:order-2 h-full">
          <div className="relative h-full rounded-3xl p-10 overflow-hidden flex flex-col justify-center" style={{ background: "linear-gradient(135deg, #0B5CFF 0%, #00D4FF 100%)" }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute bg-white/20 rounded-full blur-3xl" style={{ width: 300, height: 300, top: `${i * 150 - 50}px`, right: `${(i % 2) * 200 - 100}px` }} />
              ))}
            </div>
            <div className="relative z-10 text-white">
              <h2 className="font-extrabold leading-tight mb-5" style={{ fontSize: 38 }}>
                Experience meetings<br />like never before.
              </h2>
              
              <div className="space-y-5 mt-8">
                {[
                  "Unlimited instant meetings",
                  "High quality video & audio",
                  "Enterprise-grade security",
                  "Real-time collaboration tools"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[16px] font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
