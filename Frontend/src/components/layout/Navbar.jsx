import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/useProfile';

import Button from "../ui/Button";
import logoPNG from "../../assets/Logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Calculators", path: "/calculators" },
  { label: "FAQ", path: "/faq" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "Learning", path: "/learning" },
  { label: "Careers", path: "/careers" },
  { label: "Contact", path: "/contact" },
];

function StoreBadge({ store, initial }) {
  const isAndroid = store === "android";

  return (
    <motion.a
      href={isAndroid ? "https://play.google.com/store/apps/details?id=com.iw.radds&pcampaignid=web_share" : "https://apps.apple.com/in/app/radds-capital/id6744892358"}
      target="_blank"
      className="group flex items-center gap-2 bg-white/8 hover:bg-white/50 border border-white/15 hover:border-white/30 rounded-xl px-2 py-2.5 transition-all duration-200"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: initial, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {isAndroid ? (
        <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none">
          <path d="M3.18 23.76a2 2 0 0 0 2.05-.22l12.04-6.95-2.76-2.76-11.33 9.93z" fill="#EA4335"/>
          <path d="M21.6 10.27a1.94 1.94 0 0 0 0 3.46l.05.03-3.3-1.9.03-.03 3.22-1.56z" fill="#FBBC04"/>
          <path d="M3.18.24C2.5.6 2 1.34 2 2.27v19.46c0 .93.5 1.67 1.18 2.03l12.31-11.76L3.18.24z" fill="#4285F4"/>
          <path d="M17.27 7.59L5.23.64a2 2 0 0 0-2.05-.4L14.51 12l2.76-4.41z" fill="#34A853"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      )}
      <div>
        <p className="text-white/50 text-[10px] leading-none mb-0.5">
          {isAndroid ? "Get it on" : "Download on the"}
        </p>
        <p className="text-white font-semibold text-sm leading-none">
          {isAndroid ? "Google Play" : "App Store"}
        </p>
      </div>
    </motion.a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { hasProfile } = useProfile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuOpen && !e.target.closest('[data-profile-menu]')) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
          scrolled
            ? "bg-dark/95 backdrop-blur-lg shadow-lg shadow-black/20"
            : "bg-dark/90 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center group flex-shrink-0"
          >
            <img
              src={logoPNG}
              alt="Radds Capital"
              className="h-[52px] md:h-[56px] w-auto min-w-[120px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-2 py-2 text-sm font-medium rounded transition-all duration-200 ${
                    isActive ? "text-accent bg-white/5" : "text-white/70 hover:text-white hover:bg-white/6"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-secondary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Investwell login — untouched */}
            <Button variant="accent" size="sm" href="https://raddsenterprises.investwell.app/app/#/login">
              Login
            </Button>

            {/* Financial Profile auth — separate */}
            {user ? (
              <div className="relative" data-profile-menu>
                <button
                  onClick={() => setProfileMenuOpen(p => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm transition-all"
                >
                  <User size={14} />
                  <span className="max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                  <ChevronDown size={12} className={`transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/financial-profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={14} />
                        {hasProfile ? 'Edit Profile' : 'Create Profile'}
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/10 text-sm transition-all"
              >
                My Profile
              </Link>
            )}

          </div>
          <motion.button
            className="lg:hidden p-2 text-white/80 hover:text-white transition-colors rounded"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
            id="mobile-nav"
              className="fixed top-0 right-0 bottom-0 w-72 bg-dark z-50 lg:hidden flex flex-col shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <span className="text-white font-playfair font-bold text-lg">
                  Radds <span className="text-accent">Capital</span>
                </span>
                <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link) => {
                  const isActive = link.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.path);
                  return (
                    <motion.div
                      key={link.path}
                      initial={false}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Link
                        to={link.path}
                        className={`block px-6 py-3.5 text-sm font-medium transition-all duration-200 border-l-2 ${
                          isActive
                            ? "text-accent border-accent bg-accent/5"
                            : "text-white/70 hover:text-white border-transparent hover:border-white/20 hover:bg-white/4"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <div className="p-5 border-t border-white/10 flex flex-col gap-3">
                <StoreBadge store="android" initial={0.25} />
                <StoreBadge store="ios" initial={0.32} />
                <Button variant="ghost" size="md" href="https://raddsenterprises.investwell.app/app/#/login" className="w-full justify-center">
                  Login
                </Button>
                {/* Mobile financial profile auth */}
                {user ? (
                  <div className="border-t border-white/10 pt-3 mt-1">
                    <p className="text-white/40 text-xs px-1 mb-2">Financial Profile</p>
                    <Link
                      to="/financial-profile"
                      className="flex items-center gap-2 text-white/80 hover:text-white text-sm py-2"
                    >
                      <User size={14} />
                      {hasProfile ? 'Edit My Profile' : 'Create My Profile'}
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm py-2 w-full"
                    >
                      <LogOut size={14} />
                      Sign Out of Profile
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 border border-white/20 rounded-lg py-2.5 text-white/80 hover:text-white text-sm transition-all"
                  >
                    <User size={14} />
                    My Financial Profile
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
