import CareersHero from "../components/careers/CareersHero";
import CultureSection from "../components/careers/CultureSection";
import OpenPositions from "../components/careers/OpenPositions";
import CareerApplicationForm from "../components/careers/CareerApplicationForm";

export default function Careers() {
  return (
    <main className="bg-light">
      <CareersHero />
      <CultureSection />
      <OpenPositions />
      <CareerApplicationForm />
    </main>
  );
}