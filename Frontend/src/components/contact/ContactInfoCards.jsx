import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock3,
  Globe,
} from "lucide-react";

const cards = [
  {
    icon: MapPin,
    title: "Office Address",
    value: "Z-2101, Z wing, 2nd Floor, Akshar Business Park, Sector 25, Vashi, Navi Mumbai - 400705",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 96641 50986",
    href: "tel:+919664150986",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@raddscapital.com",
    href: "mailto:info@raddscapital.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "Chat With Us",
    href: "https://wa.me/919664150986",
  },
  {
    icon: Clock3,
    title: "Business Hours",
    value: "Mon–Fri • 9:00 AM – 5:00 PM",
  },
  {
    icon: Globe,
    title: "Social Links",
    value: "LinkedIn • Instagram",
  },
];

export default function ContactInfoCards() {
  return (
    <section className="py-20 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-xl border border-[#E2EBF5] p-6"
              >
                <Icon
                  className="text-primary mb-4"
                  size={24}
                />

                <h3 className="font-semibold mb-2">
                  {card.title}
                </h3>

                {card.href ? (
                  <a
                    href={card.href}
                    className="text-primary hover:underline"
                  >
                    {card.value}
                  </a>
                ) : (
                  <p className="text-[#6B7E99]">
                    {card.value}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}