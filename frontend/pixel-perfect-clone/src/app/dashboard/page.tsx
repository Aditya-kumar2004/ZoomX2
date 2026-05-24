"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/zoom/Navbar";
import { Footer } from "@/components/zoom/Footer";
import { ActionButtons } from "@/components/dashboard/ActionButtons";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { RecentMeetings } from "@/components/dashboard/RecentMeetings";
import { ClockWidget } from "@/components/dashboard/ClockWidget";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("zoom_user_name");
    if (!stored) {
      toast.error("Please sign in to access your dashboard.");
      router.push("/signin");
    } else {
      setUserName(stored.split(" ")[0]);
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 font-sans select-none">
        <div className="flex flex-col items-center text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#0B5CFF] animate-spin" />
          <h2 className="text-lg font-bold text-slate-700 tracking-tight animate-pulse">Securing session...</h2>
          <p className="text-sm text-slate-400 font-medium">Verifying your authentication token</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, {userName}</h1>
          <p className="text-slate-500">Manage your meetings and collaborate with your team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <ActionButtons />
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <UpcomingMeetings />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Clock Widget */}
            <ClockWidget />

            <RecentMeetings />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
