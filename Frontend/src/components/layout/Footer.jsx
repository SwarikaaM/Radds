import { Link } from "react-router-dom";
import { Share2, Globe, PlayCircle, AtSign, Mail, Phone, MapPin } from "lucide-react";
import logoPNG from "../../assets/logo.png";

const serviceLinks = [
  { label: "Mutual Funds", path: "/services/mutual-funds" },
  { label: "Life & Health Insurance", path: "/services/insurance" },
  { label: "Equity & Shares", path: "/services/equity" },
  { label: "SIP Planning", path: "/services/sip-planning" },
  { label: "Tax Planning", path: "/services/tax-planning" },
  { label: "NPS / Retirement", path: "/services/nps-retirement" },
  { label: "Goal-Based Planning", path: "/services/goal-planning" },
];

const companyLinks = [
  { label: "About Us", path: "/about" },
  { label: "Calculators", path: "/calculators" },
  { label: "Blog", path: "/blog" },
  { label: "Learning Center", path: "/learning" },
  { label: "Careers", path: "/careers" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Gradient top line */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center group"
              >
              <img
                src={logoPNG}
                alt="Radds Capital"
                className="h-[52px] md:h-[56px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
              </Link>              
            </div>
            <p className="text-white/50 text-sm leading-relaxed font-playfair italic">
              "Your Goals. Our Strategy. Your Growth."
            </p>
            <p className="text-white/40 text-xs leading-relaxed">
              SEBI Registered Investment Advisor. Independent, transparent, and always on your side.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[
                { Icon: Share2, href: "#", label: "LinkedIn" },
                { Icon: AtSign, href: "#", label: "Twitter / X" },
                { Icon: PlayCircle, href: "#", label: "YouTube" },
                { Icon: Globe, href: "#", label: "Website" },
              ].map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-primary/40 border border-white/10 hover:border-primary/50 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-white text-sm transition-colors duration-150 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-white text-sm transition-colors duration-150 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <Mail size={15} className="mt-0.5 flex-shrink-0 text-accent" />
                <a href="mailto:hello@raddscapital.com" className="hover:text-white transition-colors">
                  hello@raddscapital.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <Phone size={15} className="mt-0.5 flex-shrink-0 text-accent" />
                <a href="tel:+918000000000" className="hover:text-white transition-colors">
                  +91 80000 00000
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-accent" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-white/5 border border-white/10 rounded-card">
              <p className="text-white/40 text-xs">
                SEBI Registration No. <span className="font-mono-num text-white/60">INA000012345</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs text-center sm:text-left">
            © 2026 Radds Capital. All rights reserved. SEBI Registered Investment Advisor.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Use", "Disclaimer"].map((item) => (
              <a key={item} href="#" className="text-white/35 hover:text-white/60 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
