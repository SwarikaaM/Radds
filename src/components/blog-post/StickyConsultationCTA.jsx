import Button from "../ui/Button";
import Card from "../ui/Card";

export default function StickyConsultationCTA() {
  return (
    <>
      {/* Desktop */}

      <div className="hidden xl:block">
        <Card className="sticky top-24">
          <h3 className="font-playfair text-2xl font-bold text-textprimary mb-4">
            Need Personal Guidance?
          </h3>

          <p className="text-textmuted text-sm leading-7 mb-6">
            Speak with a Radds Capital advisor
            and receive recommendations
            tailored to your financial goals.
          </p>

          <Button
            href="/contact#book"
            variant="accent"
            className="w-full justify-center"
          >
            Book Consultation
          </Button>
        </Card>
      </div>

      {/* Mobile */}

      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2EBF5] p-3 shadow-lg">
        <Button
          href="/contact#book"
          variant="accent"
          className="w-full justify-center"
        >
          Book Consultation
        </Button>
      </div>
    </>
  );
}