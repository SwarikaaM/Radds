import ServicesHero from "../components/services/ServicesHero";
import ServicesGrid from "../components/services/ServicesGrid";
import ServiceComparison from "../components/services/ServiceComparison";
import ServicesCTA from "../components/services/ServicesCTA";

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <ServicesHero />
        <ServicesGrid />
        <ServiceComparison />
        <ServicesCTA />
      </main>
    </div>
  );
}