import React, { useMemo, useState } from "react";
import ProjectEstimator from "../components/ProjectEstimator";
import DocumentHead from "../components/DocumentHead";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Calculator, ArrowRight, ShieldCheck, Clock, Sparkles, HelpCircle, ChevronDown } from "lucide-react";
import { getSingle } from "../lib/content";

export default function Estimator() {
  const estimatorPageContent = useMemo(() => {
    return getSingle(import.meta.glob("../content/pages/estimator.json", { eager: true }));
  }, []);

  const pageTitle = (estimatorPageContent?.title || "Instant Project Estimator") + " | Lizzdo Creative Studio";
  const pageDescription = estimatorPageContent?.subtitle || "Calculate an instant estimate for your 3D modeling, animation, game development, mobile app, web app, or AI project.";

  const faqList = estimatorPageContent?.faqs || [
    {
      question: "How accurate is the estimate?",
      answer: "Our estimator calculates real-time price ranges using base rates and complexity multipliers configured directly in our operational database. While highly accurate for single or standard workflows, complex multi-disciplinary projects receive a refined formal quote after a 30-minute discovery consultation."
    },
    {
      question: "Is this estimate a final quotation?",
      answer: "No, the estimator provides an initial benchmark window. Once you click 'Request Quote', your parameters are pre-filled into our project intake form, enabling our technical leads to prepare a detailed, binding statement of work tailored to your exact technical specifications."
    },
    {
      question: "Can I combine multiple services in one project?",
      answer: "Yes! Many client projects span sequential creative pipelines — such as 3D Modeling → Rigging → Animation → Texturing → Game Engine Integration, or Web UI/UX → Full-Stack API → Mobile App → AI Agent Integration. Select your primary service in the estimator, and you can detail all complementary pipeline stages in your inquiry form or during discovery."
    },
    {
      question: "What happens after I request a quote?",
      answer: "Your estimated parameters and project details are instantly routed to our team. A senior producer will review your requirements, confirm technical feasibility, and respond within 24 hours to schedule a brief discovery video call or send a formal proposal."
    },
    {
      question: "Can I request a custom budget or phased delivery?",
      answer: "Absolutely. If you have a strict milestone budget, we can architect your project into modular phases (MVP → Phase 1 → Scale), prioritizing high-impact features first while remaining aligned with your target budget constraints."
    },
    {
      question: "How are timelines calculated?",
      answer: "Timelines are calculated based on service benchmark duration and delivery urgency (Flexible, Standard, Priority, or Rush). Rush orders allocate dedicated sprint engineering capacity to fast-track production without compromising QA or code/asset standards."
    },
    {
      question: "Are revisions included in the estimate?",
      answer: "Yes! All standard estimates include 2 to 3 structured review rounds per milestone phase to ensure final deliverables align 100% with your art direction and technical acceptance criteria."
    },
    {
      question: "Can I update my requirements later?",
      answer: "Of course. Software and 3D pipelines are naturally iterative. If scope changes during production, we issue clear change requests with transparent pricing updates before work begins."
    }
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Lizzdo Instant Project Estimator",
    "url": "https://lizzdo.com/estimator",
    "description": pageDescription,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "180",
      "highPrice": "20000"
    }
  };

  return (
    <div className="min-h-screen text-white pb-16">
      <DocumentHead
        title={pageTitle}
        description={pageDescription}
        canonicalUrl="/estimator"
        schemaData={structuredData}
      />

      {/* Hero / Header Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,245,255,0.08),transparent_60%)]" />
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 text-xs font-mono text-gray-400 mb-6 uppercase tracking-widest"
          >
            <Link to="/" className="hover:text-neon-cyan transition-colors">Home</Link>
            <span>/</span>
            <span className="text-neon-cyan">Estimator</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-[11px] font-bold uppercase tracking-[3px] mb-6 shadow-[0_0_15px_rgba(0,245,255,0.2)]"
          >
            <Calculator size={15} />
            Instant Project Estimator
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black mb-6 tracking-tight leading-none"
          >
            CALCULATE YOUR <span className="text-neon-cyan">PROJECT BUDGET</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 font-future text-base md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            {estimatorPageContent?.subtitle || "Select your service, target complexity level, and timeline requirements to receive a real-time, transparent price window."}
          </motion.p>
        </div>
      </section>

      {/* Estimator Main Component */}
      <ProjectEstimator />

      {/* How it Works / Transparency Guarantee */}
      <section className="py-16 md:py-24 px-4 md:px-6 relative border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-display font-bold uppercase mb-4">
              Transparent <span className="text-neon-cyan">Estimation Process</span>
            </h2>
            <p className="text-gray-400 font-future text-sm md:text-base max-w-2xl mx-auto">
              Our estimator uses active base prices and operational multipliers managed through our CMS to give you immediate clarity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl border-white/5 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h3 className="font-display text-lg font-bold uppercase mb-3 text-white">1. Select Requirements</h3>
              <p className="text-gray-400 text-sm font-future leading-relaxed">
                Choose from our full range of 3D, software, app, and AI services. Select complexity and delivery urgency.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border-white/5 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center text-neon-purple mb-6 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <h3 className="font-display text-lg font-bold uppercase mb-3 text-white">2. Instant Range</h3>
              <p className="text-gray-400 text-sm font-future leading-relaxed">
                Our algorithm calculates min/max bounds based on live service base rates and selected timeline parameters.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border-white/5 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-neon-green mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display text-lg font-bold uppercase mb-3 text-white">3. Request Proposal</h3>
              <p className="text-gray-400 text-sm font-future leading-relaxed">
                Click "Request Quote" to pre-fill our contact page with your exact estimate parameters for a seamless discovery call.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl glass-panel p-8 md:p-12 rounded-3xl border-white/10 shadow-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-xs font-bold uppercase tracking-widest mb-4">
              <HelpCircle size={16} />
              {estimatorPageContent?.faq_title || "ESTIMATOR FAQ"}
            </div>
            <h2 className="text-2xl md:text-4xl font-display font-bold uppercase text-white mb-3">
              FREQUENTLY ASKED <span className="text-neon-cyan">QUESTIONS</span>
            </h2>
            <p className="text-gray-400 font-future text-sm md:text-base max-w-xl mx-auto">
              {estimatorPageContent?.faq_subtitle || "Everything you need to know about our pricing models, multi-service workflows, and proposal delivery."}
            </p>
          </div>

          <div className="space-y-4">
            {faqList.map((faq: any, idx: number) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    isOpen
                      ? "border-neon-cyan/50 bg-white/5 shadow-[0_0_15px_rgba(0,245,255,0.1)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-display font-bold text-base md:text-lg text-white uppercase tracking-wide">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-neon-cyan transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-6 md:px-6 md:pb-6 pt-0 text-gray-300 text-sm md:text-base font-future leading-relaxed border-t border-white/5 mt-1">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-gray-300 text-sm font-future">Have custom enterprise requirements?</span>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-gradient-to-r from-neon-cyan to-neon-purple hover:scale-105 transition-all text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.3)]"
            >
              Contact Us Directly
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
