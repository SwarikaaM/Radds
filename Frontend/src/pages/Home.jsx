import { useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
// import MarketTicker from "../components/home/MarketTicker";
import TrustStats from "../components/home/TrustStats";
import ServicesPreview from "../components/home/ServicesPreview";
import FeaturedCalculator from "../components/home/FeaturedCalculator";
import CalculatorCardsPreview from "../components/home/CalculatorCardsPreview";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import BlogPreview from "../components/home/BlogPreview";
import HomeFAQ from "../components/home/HomeFAQ";
import FinalCTA from "../components/home/FinalCTA";
import AppDownloadSection from "../components/home/AppDownloadSection";

export default function Home() {
  useEffect(() => {
    document.title = "Radds Capital";
    const meta = document.querySelector('meta[name="description"]');
    const content =
      "Radds Capital — SEBI Registered Investment Advisor offering expert-guided mutual funds, insurance, equity, SIP planning, and goal-based financial planning across India.";
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      const tag = document.createElement("meta");
      tag.name = "description";
      tag.content = content;
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <main >
      <HeroSection />
      {/* <MarketTicker /> */}
      <FeaturedCalculator/>
      <CalculatorCardsPreview/>
      <TrustStats />
      <ServicesPreview />
      <HowItWorks />
      <Testimonials />
      <BlogPreview />
      <HomeFAQ />
      <AppDownloadSection />
      <FinalCTA />
    </main>
  );
}
