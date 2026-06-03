import ContactHero from "../components/contact/ContactHero";
import ContactInfoCards from "../components/contact/ContactInfoCards";
import ContactForm from "../components/contact/ContactForm";
import ConsultationBooking from "../components/contact/ConsultationBooking";
import MapPlaceholder from "../components/contact/MapPlaceholder";

export default function Contact() {
  return (
    <>
      <main>
        <ContactHero />
        <ContactInfoCards />
        <ContactForm />
        <ConsultationBooking />
        <MapPlaceholder />
      </main>
    </>
  );
}