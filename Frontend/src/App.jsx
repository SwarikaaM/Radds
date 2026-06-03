import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Calculators from "./pages/Calculators";
import CalculatorDetail from "./pages/CalculatorDetail";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetails";
import Learning from "./pages/Learning";
import FinancialProfile from "./pages/FinancialProfile";

const Placeholder = ({ title }) => (
  <div className="min-h-screen bg-lightbg flex items-center justify-center pt-16">
    <div className="text-center">
      <h1 className="font-playfair text-3xl font-bold text-textprimary mb-3">{title}</h1>
      <p className="text-textmuted">This page is coming soon.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/calculators" element={<Calculators />} />
        <Route path="/calculators/:slug" element={<CalculatorDetail />} />
        <Route path="/financial-profile" element={<FinancialProfile />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Placeholder title="Login" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
