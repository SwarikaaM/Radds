import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Share2, Globe, PlayCircle, AtSign, Mail, Phone, MapPin } from "lucide-react";
import logoPNG from "../../assets/Logo.png";
import MFDisclosure from "../ui/MFDisclosure";

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
      <MFDisclosure />
      {/* Gradient top line */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
              AMFI-Registered Mutual Fund Distributor | ARN-334716 | ARN-292158 | ARN- 124053. Transparent, client-first MF distribution.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[
                { Icon: Share2, href: "#", label: "LinkedIn" },
                { Icon: AtSign, href: "#", label: "Twitter / X" },
                { Icon: PlayCircle, href: "#", label: "YouTube" },
                { Icon: Globe, href: "#", label: "Website" },
              ].map(({ Icon, href, label }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-primary/40 border border-white/10 hover:border-primary/50 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
                  aria-label={label}
                  whileHover={{ y: -2, scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.path}>
                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                    <Link
                      to={link.path}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-150 inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
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
                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                    <Link
                      to={link.path}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-150 inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
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
                  info@raddscapital.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <Phone size={15} className="mt-0.5 flex-shrink-0 text-accent" />
                <a href="tel:+919664150986" className="hover:text-white transition-colors">
                  +91 96641 50986
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-accent" />
                <span>Z-2101, Z wing, 2nd Floor, Akshar Business Park, Sector 25, Vashi, Navi Mumbai - 400705</span>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-white/5 border border-white/10 rounded-card">
              <p className="text-white/40 text-xs">
                AMFI ARN: <span className="font-mono-num text-white/60">ARN-334716 | ARN-292158 | ARN- 124053</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs text-center sm:text-left">
            © 2026 Radds Capital. All rights reserved. AMFI-Registered Mutual Fund Distributor | ARN-334716 | ARN-292158 | ARN- 124053
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Use", "Disclaimer"].map((item) => (
              <a key={item} href="#" className="text-white/35 hover:text-white/60 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-white/25 text-[10px] leading-relaxed text-center">
            Mutual Fund investments are subject to market risks. Read all scheme related documents carefully. 
            Past performance is not indicative of future returns. Radds Capital is an AMFI-Registered Mutual Fund Distributor, 
            not a SEBI Registered Investment Adviser. Incidental investment guidance provided is not financial planning or investment advisory.
          </p>
        </div> 
      </div>
    </footer>
  );
}
