"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Info, X, ChevronDown, Key, Apple, Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [info, setInfo] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Multi-step form state
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStep(2);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setIsSubmitting(true);
    // Simulate backend API call with dummy data
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="h-16 px-6 lg:px-10 flex items-center justify-between border-b border-zinc-200">
        <Link href="/" className="font-extrabold" style={{ fontSize: 28, color: "var(--zoom-blue)" }}>zoom</Link>
        <div className="flex items-center gap-6 text-[14px]" style={{ color: "var(--zoom-dark)" }}>
          <span>New to Zoom? <Link href="/signup" style={{ color: "var(--zoom-blue)" }} className="font-semibold">Sign Up Free</Link></span>
          <a href="#" className="hover:underline">Support</a>
          <button className="flex items-center gap-1">English <ChevronDown size={14} /></button>
        </div>
      </nav>

      {info && (
        <div className="flex items-center gap-3 px-10 py-2.5 text-[13px]" style={{ background: "#F0F7FF", borderBottom: "1px solid #E0ECFF", color: "var(--zoom-dark)" }}>
          <Info size={16} className="text-blue-600" />
          <span>You may stay signed in longer on this device. <a href="#" style={{ color: "var(--zoom-blue)" }}>Learn more</a></span>
          <button onClick={() => setInfo(false)} className="ml-auto"><X size={16} /></button>
        </div>
      )}

      <div className="grid lg:grid-cols-[55%_45%] min-h-[calc(100vh-120px)]">
        {/* Left banner */}
        <div className="p-10">
          <div className="relative h-full rounded-3xl p-12 overflow-hidden flex flex-col justify-center" style={{ background: "linear-gradient(135deg, #09090b 0%, #172554 100%)" }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute bg-white/15 rounded-full blur-3xl" style={{ width: 400, height: 400, top: `${(i % 3) * 150 - 100}px`, left: `${(i % 2) * 300 - 150}px` }} />
              ))}
            </div>
            <div className="relative z-10">
              <div className="text-white/80 font-semibold mb-2" style={{ fontSize: 16 }}>Welcome Back to</div>
              <div className="text-white font-extrabold tracking-tight" style={{ fontSize: 48 }}>zoom</div>
              <h2 className="mt-8 text-white font-bold leading-tight" style={{ fontSize: 42 }}>
                Connect<br />Collaborate<br />Create.
              </h2>
              <p className="mt-6 text-gray-300 text-[18px] leading-relaxed max-w-md">
                Sign in to your account to start an instant meeting, schedule a future event, or join an ongoing session.
              </p>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-[400px]">
            <h1 className="text-center font-extrabold mb-2" style={{ fontSize: 32, color: "var(--zoom-dark)" }}>Sign In</h1>
            <p className="text-center text-gray-500 text-[15px] mb-8">Enter your credentials to access your account</p>

            <form className="space-y-4" onSubmit={step === 1 ? handleNext : handleSignIn}>
              {step === 1 ? (
                <>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      autoFocus
                      required
                      className="w-full h-[52px] px-4 rounded-xl text-[15px] outline-none transition-all border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full h-[52px] rounded-xl text-white text-[16px] font-semibold transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                    style={{ background: "var(--zoom-blue)" }}
                  >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-200">
                    <span className="text-[14px] text-zinc-700 font-medium truncate">{email}</span>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="text-[13px] text-blue-600 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      autoFocus
                      required
                      className="w-full h-[52px] px-4 rounded-xl text-[15px] outline-none transition-all border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[13px] px-1">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      Keep me signed in
                    </label>
                    <a href="#" className="font-semibold text-blue-600 hover:underline">Forgot password?</a>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full h-[52px] rounded-xl flex items-center justify-center text-white text-[16px] font-semibold transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ background: "var(--zoom-blue)" }}
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                  </button>
                </>
              )}
            </form>

            <div className="flex items-center gap-3 my-8 text-[13px] text-gray-400">
              <div className="flex-1 h-px bg-gray-200" />
              <span>Or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-[14px] text-gray-700">
                <span className="font-bold text-[18px]" style={{ color: "#4285F4" }}>G</span> Google
              </button>
              <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-[14px] text-gray-700">
                <Apple size={20} /> Apple
              </button>
              <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-[14px] text-gray-700">
                <Key size={18} /> SSO
              </button>
              <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-[14px] text-gray-700">
                <span className="font-bold text-[18px]" style={{ color: "#1877F2" }}>f</span> Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
