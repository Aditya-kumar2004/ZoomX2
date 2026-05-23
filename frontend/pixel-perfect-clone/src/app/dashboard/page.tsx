import { Navbar } from "@/components/zoom/Navbar";
import { Footer } from "@/components/zoom/Footer";
import { ActionButtons } from "@/components/dashboard/ActionButtons";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { RecentMeetings } from "@/components/dashboard/RecentMeetings";
import { ClockWidget } from "@/components/dashboard/ClockWidget";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, John</h1>
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
