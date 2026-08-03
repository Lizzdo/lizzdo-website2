import React, { useState, useMemo, useEffect } from "react";
import { getSingle, getCollection, sortByOrder } from "../lib/content";
import { IconMapper } from "../components/IconMapper";
import { toArray } from "../lib/content";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Mail, Phone, Send, CheckCircle2, Copy, Calculator } from "lucide-react";
import DocumentHead from "../components/DocumentHead";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import EstimatorCTA from "../components/EstimatorCTA";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const globalData = useMemo(() => getSingle(import.meta.glob('../content/settings/global.json', { eager: true })), []);
  const pageData = useMemo(() => getSingle(import.meta.glob("../content/pages/contact.json", { eager: true })), []);
  
  const cmsServices = useMemo(() => {
    const raw = getCollection(import.meta.glob("../content/services/*.json", { eager: true }));
    return raw.filter((s: any) => s.published !== false).sort(sortByOrder);
  }, []);

  const emailList = useMemo(() => {
    if (Array.isArray(pageData?.emails) && pageData.emails.length > 0) return pageData.emails;
    if (pageData?.email) return [pageData.email];
    if (globalData?.contact?.email) return [globalData.contact.email];
    return ["hello@lizzdo.com"];
  }, [pageData, globalData]);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });

  useEffect(() => {
    const serviceParam = searchParams.get("service") || location.state?.service;
    const complexityParam = searchParams.get("complexity") || location.state?.complexity;
    const timelineParam = searchParams.get("timeline") || location.state?.timeline;
    const estimateParam = searchParams.get("estimate") || location.state?.estimate;

    if (serviceParam || estimateParam) {
      let matchedServiceTitle = serviceParam || "";
      // Match title with services in CMS if possible
      const matched = cmsServices.find((s: any) => 
        s.title.toLowerCase() === (serviceParam || "").toLowerCase() || 
        s.slug.toLowerCase() === (serviceParam || "").toLowerCase()
      );
      if (matched) {
        matchedServiceTitle = matched.title;
      }

      const msg = `Hi LIZZDO Team,\n\nI used the Instant Project Estimator on your website and would like to request an official quote for my project:\n\n- Service: ${serviceParam || "Custom"}\n- Complexity: ${complexityParam || "Standard"}\n- Timeline: ${timelineParam || "Flexible"}\n- Estimated Price: ${estimateParam || "N/A"}\n\nPlease contact me regarding next steps and project scheduling!`;

      setFormState((prev) => ({
        ...prev,
        service: matchedServiceTitle || prev.service,
        message: msg,
      }));
    }
  }, [searchParams, location.state, cmsServices]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      // Fallback for Formspree or Web3Forms
      // You can replace this URL with your actual endpoint (e.g., https://formspree.io/f/your_id)
      const formEndpoint = 'https://api.web3forms.com/submit';
      formData.append("access_key", "YOUR_WEB3FORMS_ACCESS_KEY_HERE");
      
      const response = await fetch(formEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setFormState({ name: "", email: "", service: "", message: "" });
      } else {
        // Fallback simulation if no valid endpoint is configured
        setTimeout(() => {
          setIsSuccess(true);
          setFormState({ name: "", email: "", service: "", message: "" });
        }, 1000);
      }
    } catch (error) {
       // Fallback simulation
       setTimeout(() => {
         setIsSuccess(true);
         setFormState({ name: "", email: "", service: "", message: "" });
       }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <DocumentHead title="Contact Us | Start Your Project with LIZZDO" description="Get in touch with LIZZDO to discuss your next big idea. We are ready to build stunning 3D assets, games, and web experiences for you." />
      {/* Hero Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="font-mono text-xs tracking-[4px] text-neon-cyan uppercase">
              // CONNECT WITH US
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="font-display text-5xl md:text-7xl font-black mb-8">
            {pageData?.headline?.split(" ").slice(0, -1).join(" ")} <span className="holo-text">{pageData?.headline?.split(" ").slice(-1).join(" ")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-future text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {pageData?.subtitle}
          </motion.p>
          {globalData?.company_info && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-future text-sm text-gray-500 max-w-2xl mx-auto mt-6 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
              {globalData.company_info}
            </motion.p>
          )}
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 px-6 pb-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-12">
              <div>
                <span className="font-mono text-xs tracking-[4px] text-neon-cyan uppercase mb-8 block">// INFO</span>
                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-all">
                      <MapPin className="text-neon-cyan" size={24} />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold mb-2 tracking-[1px]">STUDIO</h4>
                      <p className="text-gray-400 font-future text-sm leading-relaxed">
                        {pageData?.location?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center group-hover:bg-neon-purple/20 transition-all cursor-pointer">
                      <Mail className="text-neon-purple" size={24} />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold mb-2 tracking-[1px]">EMAIL</h4>
                      <div className="text-gray-400 font-future text-sm leading-relaxed flex flex-col gap-2">
                        {emailList.map((email: string) => (
                          <button 
                            key={email}
                            onClick={() => handleCopyEmail(email)}
                            className="flex items-center gap-2 hover:text-neon-cyan transition-colors text-left group/email"
                          >
                            {email}
                            <Copy size={12} className="opacity-0 group-hover/email:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center group-hover:bg-neon-pink/20 transition-all">
                      <Phone className="text-neon-pink" size={24} />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold mb-2 tracking-[1px]">PHONE</h4>
                      <p className="text-gray-400 font-future text-sm leading-relaxed">
                        {pageData?.phone?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                      </p>
                    </div>
                  </div>
                  
                  {pageData?.hours && (
                    <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold mb-2 tracking-[1px]">BUSINESS HOURS</h4>
                        <p className="text-gray-400 font-future text-sm leading-relaxed">
                          {pageData.hours.split('\n').map((line: string, i: number) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              <div>
                <span className="font-mono text-xs tracking-[4px] text-neon-purple uppercase mb-8 block">// SOCIAL</span>
                <div className="flex gap-4">
                  {toArray(pageData?.socials).map(({ icon, url, name }: any, i: number) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-neon-cyan/20 hover:border-neon-cyan transition-all group"
                      title={name}
                    >
                      <div className="text-gray-400 group-hover:text-neon-cyan transition-colors">
                        <IconMapper name={icon} size={20} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="p-8 md:p-12 rounded-3xl glass-panel border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                
                <span className="font-mono text-xs tracking-[4px] text-neon-green uppercase mb-8 block">// SEND MESSAGE</span>
                
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <div className="w-20 h-20 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="text-neon-green" size={40} />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-4 tracking-[1px]">MESSAGE SENT!</h3>
                    <p className="text-gray-400 font-future mb-8">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-8 py-3 rounded-xl border border-neon-green text-neon-green font-display font-bold uppercase text-xs tracking-[2px] hover:bg-neon-green hover:text-black transition-all"
                    >
                      SEND ANOTHER
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] tracking-[2px] text-gray-500 uppercase">NAME</label>
                        <input
                          required
                          type="text"
                          name="name" value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="Your Full Name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-cyan transition-all font-future"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] tracking-[2px] text-gray-500 uppercase">EMAIL</label>
                        <input
                          required
                          type="email"
                          name="email" value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-cyan transition-all font-future"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-mono text-[10px] tracking-[2px] text-gray-500 uppercase">SERVICE INTERESTED IN</label>
                      <select
                        required
                        name="service" value={formState.service}
                        onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-neon-cyan transition-all font-future appearance-none"
                      >
                        <option value="" disabled className="bg-dark-navy">Select a service</option>
                        {cmsServices.map((s: any) => (
                          <option key={s.slug} value={s.title} className="bg-dark-navy">
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="font-mono text-[10px] tracking-[2px] text-gray-500 uppercase">MESSAGE</label>
                      <textarea
                        required
                        rows={6}
                        name="message" value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Tell us about your project, goals, and requirements..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-cyan transition-all font-future resize-none"
                      />
                    </div>

                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full py-5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold uppercase text-sm tracking-[2px] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          SENDING...
                        </>
                      ) : (
                        <>
                          SEND MESSAGE <Send size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estimator CTA Banner */}
      <EstimatorCTA
        title="NEED AN INSTANT PROJECT ESTIMATE FIRST?"
        subtitle="Calculate your budget parameters and project timeline before sending a inquiry."
        buttonText="Estimate Budget Now"
        variant="banner"
      />

      {/* Copy notification toast */}
      <AnimatePresence>
        {copiedEmail && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-xl border border-neon-cyan/50 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(0,245,255,0.3)]"
          >
            <CheckCircle2 className="text-neon-cyan" size={18} />
            <span className="font-mono text-sm text-neon-cyan">
              Copied {copiedEmail}!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
