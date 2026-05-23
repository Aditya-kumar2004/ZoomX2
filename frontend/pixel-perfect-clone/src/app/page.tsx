"use client";

import { AnnouncementBar } from "@/components/zoom/AnnouncementBar";
import { Navbar } from "@/components/zoom/Navbar";
import { HeroSection } from "@/components/zoom/HeroSection";
import { MyNotesSection } from "@/components/zoom/MyNotesSection";
import { AnalystCards } from "@/components/zoom/AnalystCards";
import { PlatformTabs } from "@/components/zoom/PlatformTabs";
import { TrustLogos } from "@/components/zoom/TrustLogos";
import { RatingsRow } from "@/components/zoom/RatingsRow";
import { CustomerStories } from "@/components/zoom/CustomerStories";
import { WhatsNew } from "@/components/zoom/WhatsNew";
import { FinalCTA } from "@/components/zoom/FinalCTA";
import { Footer } from "@/components/zoom/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AnnouncementBar />
      <main>
        <HeroSection />
        <MyNotesSection />
        <AnalystCards />
        <PlatformTabs />
        <TrustLogos />
        <RatingsRow />
        <CustomerStories />
        <WhatsNew />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
