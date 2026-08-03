import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, FileText, Lock, Cookie, Scale, AlertCircle, ArrowRight } from "lucide-react";
import DocumentHead from "../components/DocumentHead";
import EstimatorCTA from "../components/EstimatorCTA";

export default function Legal() {
  const { slug } = useParams<{ slug: string }>();

  const legalTabs = [
    { slugKey: "terms-of-service", label: "Terms of Service", icon: Scale },
    { slugKey: "privacy-policy", label: "Privacy Policy", icon: Lock },
    { slugKey: "data-compliance", label: "Data Compliance", icon: ShieldCheck },
    { slugKey: "cookie-policy", label: "Cookie Policy", icon: Cookie },
    { slugKey: "acceptable-use", label: "Acceptable Use", icon: FileText },
    { slugKey: "disclaimer", label: "Disclaimer", icon: AlertCircle }
  ];

  const legalContent: Record<string, { title: string; content: React.ReactNode }> = {
    "terms-of-service": {
      title: "TERMS OF SERVICE",
      content: (
        <div className="space-y-6 font-future text-gray-300">
          <p className="text-sm text-neon-cyan/80 font-mono"><strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">By accessing or using the website lizzdo.com (the "Site") and the services provided by Lizzdo (web development, digital agency, 3D modeling, immersive experiences), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">2. Eligibility</h2>
          <p className="leading-relaxed">You must be at least 18 years of age to use our services. By using our services, you represent and warrant that you have the right, authority, and capacity to enter into these terms and to abide by all applicable laws.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">3. User Accounts</h2>
          <p className="leading-relaxed">Certain features may require you to register an account. You are responsible for maintaining the confidentiality of your account credentials and are fully responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">4. Acceptable Use Policy</h2>
          <p className="leading-relaxed">You agree to use our website and services only for lawful purposes. You must not use our platform in a way that infringes upon the rights of others, restricts or inhibits anyone else's use, or could damage our reputation.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">5. Prohibited Activities</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-400">
            <li>Engaging in illegal, fraudulent, or malicious activities.</li>
            <li>Uploading or omitting malware, viruses, or destructive code.</li>
            <li>Attempting to gain unauthorized access to our servers or secure systems.</li>
            <li>Scraping, copying, or duplicating our website content without permission.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">6. Intellectual Property Rights</h2>
          <p className="leading-relaxed">All content on the Site, including text, graphics, logos, code, software, and 3D assets, is the property of Lizzdo or our licensors and is protected by intellectual property laws. You may not reproduce, distribute, or modify our content without express written consent.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">7. Third-Party Links</h2>
          <p className="leading-relaxed">Our website may contain links to third-party sites. We are not responsible for the content, privacy practices, or reliability of these external links. Accessing third-party sites is at your own risk.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">8. Disclaimers</h2>
          <p className="leading-relaxed">Our services and website are provided on an "as is" and "as available" basis. Lizzdo makes no warranties, either express or implied, about the completeness, reliability, or accuracy of the services provided.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">9. Limitation of Liability</h2>
          <p className="leading-relaxed">To the maximum extent permitted by law, Lizzdo shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our services or failure to access the website.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">10. Indemnification</h2>
          <p className="leading-relaxed">You agree to indemnify and hold harmless Lizzdo, its affiliates, employees, and partners from any claims, liabilities, damages, and expenses arising from your violation of these Terms or your misuse of the services.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">11. Termination</h2>
          <p className="leading-relaxed">We reserve the right to suspend or terminate your access to our services at any time, without notice, for any violation of these Terms or for any other reason we deem necessary to protect our platform.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">12. Governing Law & Dispute Resolution</h2>
          <p className="leading-relaxed">These terms are governed by and construed in accordance with the Laws of Pakistan. Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction of the courts located in Pakistan.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">13. Changes to Terms</h2>
          <p className="leading-relaxed">We reserve the right to modify these Terms of Service at any time. We will indicate modifications by updating the "Effective Date." Continuing to use the services implies your acceptance of the updated terms.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">14. Contact Information</h2>
          <p className="leading-relaxed">If you have any questions about these Terms, please contact us at:</p>
          <p className="font-mono text-neon-pink">hello@lizzdo.com</p>
        </div>
      )
    },
    "privacy-policy": {
      title: "PRIVACY POLICY",
      content: (
        <div className="space-y-6 font-future text-gray-300">
          <p className="text-sm text-neon-cyan/80 font-mono"><strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">1. Introduction</h2>
          <p className="leading-relaxed">At Lizzdo ("we", "our", "us"), we are committed to protecting your privacy and ensuring your personal information is handled securely. This Privacy Policy outlines how we collect, use, store, and share your data when you visit lizzdo.com.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-400">
            <li><strong>Personal Information:</strong> Includes your name, email address, phone number, and project parameters provided during inquiry or consultation.</li>
            <li><strong>Usage Information:</strong> Details of your visits to our site, including traffic data, IP addresses, browser types, and usage patterns.</li>
            <li><strong>Cookies Information:</strong> Data collected automatically via cookies or similar tracking technologies to improve user experience.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">3. How We Use Your Information</h2>
          <p className="leading-relaxed">We process your data to deliver, improve, and secure our services; to process transactions and communicate with you regarding your projects; to provide customer support; and to send operational updates.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">4. Legal Basis for Processing</h2>
          <p className="leading-relaxed">Depending on your jurisdiction, we process data under several legal bases: your explicit consent, to fulfill a contract (delivering requested services), our legitimate business interests, or for legal compliance.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">5. How We Share Information</h2>
          <p className="leading-relaxed">We do not sell your personal data. We may share information with trusted third-party service providers (like Cloudflare infrastructure and payment processors) who help us operate our platform under strict confidentiality agreements.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">6. Cookies & Tracking Technologies</h2>
          <p className="leading-relaxed">Our website uses essential cookies to function properly, analyze performance, and securely handle sessions. For detailed information, please review our Cookie Policy.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">7. Data Retention</h2>
          <p className="leading-relaxed">We keep your personal information only as long as necessary to fulfill the purposes set out in this policy and to comply with legal, accounting, or reporting obligations.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">8. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-400">
            <li><strong>Access:</strong> You may request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> You have the right to request updates to inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> You can request that we delete your personal information.</li>
            <li><strong>Portability:</strong> You may request a machine-readable transfer of your data.</li>
            <li><strong>Opt-Out:</strong> You may opt out of marketing communications at any time.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">9. Data Security</h2>
          <p className="leading-relaxed">We implement technical and organizational measures (such as SSL encryption and HTTPS routing) to protect your personal data against unauthorized access, loss, or alteration.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">10. Children's Privacy</h2>
          <p className="leading-relaxed">Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">11. International Data Transfers</h2>
          <p className="leading-relaxed">As a globally accessible platform, your data may be transferred to, stored, and processed in cloud infrastructure outside of Pakistan. We ensure adequate safeguards protect these cross-border transfers.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">12. Changes to This Policy</h2>
          <p className="leading-relaxed">We may update this Privacy Policy from time to time. We will communicate massive changes by updating the "Effective Date" at the top of the policy.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">13. Contact Us</h2>
          <p className="leading-relaxed">For questions or requests to exercise your data rights, please contact us at:</p>
          <p className="font-mono text-neon-pink">hello@lizzdo.com</p>
        </div>
      )
    },
    "data-compliance": {
      title: "DATA COMPLIANCE STATEMENT",
      content: (
        <div className="space-y-6 font-future text-gray-300">
          <p className="text-sm text-neon-cyan/80 font-mono"><strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">1. Our Commitment</h2>
          <p className="leading-relaxed">Lizzdo is deeply committed to data protection, privacy, and maintaining rigorous compliance with relevant, global data privacy standards. We treat the data of our clients and users with the utmost respect and security.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">2. Applicable Regulations</h2>
          <p className="leading-relaxed">While we operate under the Laws of Pakistan, we respect modern privacy principles inspired by the General Data Protection Regulation (GDPR) and similar legislative frameworks, ensuring data minimization, transparency, and secure processing.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">3. Data We Process & Legal Basis</h2>
          <p className="leading-relaxed">We process basic identity and usage data. Processing is generally based on our user contracts (performing requested services), your explicit consent, and legitimate operational interests of keeping our platform secure.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">4. Third-Party Processors List</h2>
          <p className="leading-relaxed">We limit third-party sub-processing. When engaged, providers include verified analytics platforms and standard cloud infrastructure hosting who provide guarantees regarding data safety.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">5. Security Measures & Certifications</h2>
          <p className="leading-relaxed">We employ standard encryption for data at rest and in transit. Access to personal data is restricted to authorized personnel. Regular system patching and audits ensure ongoing defensive robustness.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">6. Data Breach Response Policy</h2>
          <p className="leading-relaxed">If a significant breach of personal data occurs, we will notify affected individuals and appropriate authorities in reasonable timeframes, taking all appropriate technical measures to mitigate the damage.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">7. Data Subject Rights & How to Exercise Them</h2>
          <p className="leading-relaxed">You reserve the right to inquire about your data footprint, request deletion, or apply data-portability protocols. Reach out to our primary contact to enact these rights.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">8. Data Protection Officer Contact</h2>
          <p className="leading-relaxed">Requests regarding compliance can be directed to the technical support line at:</p>
          <p className="font-mono text-neon-pink">hello@lizzdo.com</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">9. Policy Review Schedule</h2>
          <p className="leading-relaxed">This statement is reviewed periodically to ensure alignment with our internal scaling procedures and evolving baseline privacy norms.</p>
        </div>
      )
    },
    "cookie-policy": {
      title: "COOKIE POLICY",
      content: (
        <div className="space-y-6 font-future text-gray-300">
          <p className="text-sm text-neon-cyan/80 font-mono"><strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">1. What Cookies Are</h2>
          <p className="leading-relaxed">Cookies are small text files placed on your device by the websites that you visit. They are widely used to make websites work properly, provide a secure experience, and supply analytical data to website owners.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">2. Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-400">
            <li><strong>Essential Cookies:</strong> Strictly necessary for the website to function (e.g., maintaining sessions, enabling shopping carts). These cannot be switched off within our standard systems.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the site by reporting data anonymously.</li>
            <li><strong>Marketing Cookies:</strong> Used occasionally to track visitors across websites in order to display relevant advertisements tailored to the user.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">3. Third-Party Cookies</h2>
          <p className="leading-relaxed">In some cases, we use trusted third parties (such as Google Analytics) who may also place cookies on your machine. We do not control these third-party cookies directly.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">4. How to Manage Cookies</h2>
          <p className="leading-relaxed">You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. Note that disabling essential cookies may impact the functionality of our Site.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">5. Cookie Consent</h2>
          <p className="leading-relaxed">By continuing to navigate our website without changing your cookie settings, you hereby acknowledge and agree to Lizzdo's placement of cookies on your device.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">6. Updates to This Policy</h2>
          <p className="leading-relaxed">We may amend this Cookie Policy periodically to reflect changes in our use of tracking technologies. Regular review is encouraged for continued transparency.</p>
        </div>
      )
    },
    "acceptable-use": {
      title: "ACCEPTABLE USE POLICY",
      content: (
        <div className="space-y-6 font-future text-gray-300">
          <p className="text-sm text-neon-cyan/80 font-mono"><strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">1. Purpose</h2>
          <p className="leading-relaxed">The Acceptable Use Policy (AUP) outlines the rules and expectations for anyone accessing Lizzdo's network, services, or associated digital platforms. Our goal is to ensure a secure, respectful, and fully functional environment.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">2. Permitted Uses</h2>
          <p className="leading-relaxed">You are authorized to use our platform strictly to engage organically with our content, inquire about our design and web services, and contract us for lawful digital projects.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">3. Prohibited Conduct</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-400">
            <li>Transmitting unsolicited or unauthorized advertising (spam).</li>
            <li>Distributing viruses, trojans, worms, or other harmful materials.</li>
            <li>Engaging in denial-of-service attacks or probing network vulnerabilities without explicit permission.</li>
            <li>Falsifying protocols, header spoofing, or conducting phishing activities.</li>
            <li>Violating the intellectual property rights of any party.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">4. Enforcement & Consequences</h2>
          <p className="leading-relaxed">Lizzdo retains the definitive right to monitor usage. Violations of this AUP may lead to immediate suspension or termination of service, and, if applicable, reporting to relevant legal or regulatory authorities.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">5. Reporting Violations</h2>
          <p className="leading-relaxed">We encourage users who detect any violations or abuses of our network to notify us promptly so that swift remedial action may be taken.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">6. Contact</h2>
          <p className="leading-relaxed">For reports regarding prohibited conduct:</p>
          <p className="font-mono text-neon-pink">hello@lizzdo.com</p>
        </div>
      )
    },
    "disclaimer": {
      title: "DISCLAIMER",
      content: (
        <div className="space-y-6 font-future text-gray-300">
          <p className="text-sm text-neon-cyan/80 font-mono"><strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">1. General Disclaimer</h2>
          <p className="leading-relaxed">The information on lizzdo.com is for general informational purposes only. While we aim to provide up-to-date and reliable web design and digital agency insights, we make no guarantees about the completeness or suitability of the information.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">2. No Professional Advice Disclaimer</h2>
          <p className="leading-relaxed">The content provided by Lizzdo does not constitute formal legal, financial, or certified professional advice. Usage of any strategies or digital blueprints discussed on our site is strictly at the user's discretion and risk.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">3. Accuracy of Information</h2>
          <p className="leading-relaxed">We endeavor to keep all case studies, service descriptions, and blog elements accurate. We do not accept liability for any errors or omissions, nor are we responsible for any losses associated with reliance on this data.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">4. External Links Disclaimer</h2>
          <p className="leading-relaxed">Any links leading to external platforms are provided as a convenience to our users. A link does not imply endorsement by Lizzdo. We do not have control over external portals and accept no responsibility for their content.</p>

          <h2 className="text-xl md:text-2xl font-display font-bold text-neon-cyan mt-8 uppercase tracking-wide">5. Limitation of Liability</h2>
          <p className="leading-relaxed">In no event will Lizzdo be liable for any direct, indirect, special, or consequential damages resulting from your use of this site or any services highlighted within it.</p>
        </div>
      )
    }
  };

  const page = slug ? legalContent[slug] : null;

  if (!page) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen text-white selection:bg-neon-cyan/30 pb-24 relative overflow-hidden">
      <DocumentHead title={`${page.title} | Lizzdo Creative Studio`} />
      
      {/* Background radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,245,255,0.06),transparent_60%)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10 pt-10 md:pt-14">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan font-mono text-xs tracking-[2px] mb-4 uppercase">
            <ShieldCheck size={14} /> // LIZZDO LEGAL & GOVERNANCE
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-white tracking-widest mb-3">
            {page.title}
          </h1>
          <p className="text-gray-400 font-future text-sm md:text-base max-w-xl mx-auto">
            Transparent operational standards, user protections, and data compliance guidelines for Lizzdo Creative Studio.
          </p>
        </motion.div>

        {/* Legal Document Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none justify-start md:justify-center"
        >
          {legalTabs.map((tab) => {
            const isActive = slug === tab.slugKey;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.slugKey}
                to={`/legal/${tab.slugKey}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border ${
                  isActive
                    ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                    : "bg-black/30 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                <Icon size={14} className={isActive ? "text-neon-cyan" : "text-gray-400"} />
                {tab.label}
              </Link>
            );
          })}
        </motion.div>
        
        {/* Document Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-6 md:p-12 rounded-3xl border-white/10 shadow-2xl relative overflow-hidden bg-black/40 backdrop-blur-xl mb-16"
        >
          <div className="text-lg md:text-xl font-future leading-relaxed text-gray-300">
            {page.content}
          </div>
        </motion.div>

        {/* Estimator CTA Banner */}
        <EstimatorCTA
          title="READY TO START A COMPLIANT PROJECT?"
          subtitle="Calculate an instant budget estimate for your 3D modeling, web app, or AI development with guaranteed SLA compliance."
          buttonText="Estimate My Project"
          variant="banner"
        />
      </div>
    </div>
  );
}

