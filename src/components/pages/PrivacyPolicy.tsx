
import { motion } from "framer-motion";
import { 
  LucideArrowRight, 
  LucideShield, 
  LucideLock, 
  LucideUserCheck, 
  LucideDatabase,
  LucideFileText,
  LucideCalendar
} from "lucide-react";
import { useState } from "react";

export const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const lastUpdated = "July 15, 2024";

      return (
        <div className="bg-background">
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center mb-6 px-4 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary">
                <LucideShield className="mr-2 h-4 w-4" />
                Privacy Commitment
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Privacy Policy
              </h1>
              <p className="text-lg text-foreground/70 mb-8">
                At GetIndexedNow, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.
              </p>
              <div className="flex items-center justify-center text-sm text-foreground/60">
                <LucideCalendar className="mr-2 h-4 w-4" />
                Last Updated: {lastUpdated}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute -z-10 top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1),transparent_70%)]"></div>
      </section>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/4"
            >
              <div className="sticky top-24 bg-card border border-border rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Contents</h3>
                <nav className="space-y-1">
                  {[
                    { id: "introduction", label: "Introduction" },
                    { id: "information-collection", label: "Information We Collect" },
                    { id: "information-use", label: "How We Use Your Information" },
                    { id: "information-sharing", label: "Information Sharing" },
                    { id: "data-security", label: "Data Security" },
                    { id: "your-rights", label: "Your Rights" },
                    { id: "cookies", label: "Cookies Policy" },
                    { id: "third-party", label: "Third-Party Services" },
                    { id: "children", label: "Children's Privacy" },
                    { id: "changes", label: "Changes to This Policy" },
                    { id: "contact", label: "Contact Us" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === item.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Need Help?</h4>
                  <p className="text-sm text-foreground/70 mb-3">
                    If you have questions about our privacy practices, please contact us.
                  </p>
                  <a 
                    href="/contact-us" 
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Contact Our Privacy Team
                    <LucideArrowRight className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </motion.div>
            
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:w-3/4"
            >
              <div className="bg-card border border-border rounded-lg shadow-sm p-8 mb-8">
                <div id="introduction" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <LucideFileText className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Introduction</h2>
                  </div>
                  <p className="text-foreground/70 mb-4">
                    Welcome to GetIndexedNow's Privacy Policy. This policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                  </p>
                  <p className="text-foreground/70 mb-4">
                    We respect your privacy and are committed to protecting your personal data. Please read this privacy policy carefully to understand our practices regarding your personal data.
                  </p>
                  <p className="text-foreground/70">
                    By accessing or using GetIndexedNow, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                  </p>
                </div>
                
                <div id="information-collection" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <LucideDatabase className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Information We Collect</h2>
                  </div>
                  <p className="text-foreground/70 mb-4">
                    We collect several types of information from and about users of our platform, including:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/70">
                    <li><strong>Personal Identifiers:</strong> Name, email address, phone number, billing address, and payment information.</li>
                    <li><strong>Account Information:</strong> Username, password, account preferences, and subscription details.</li>
                    <li><strong>Website Information:</strong> URLs submitted for indexing, website statistics, and related metadata.</li>
                    <li><strong>Usage Data:</strong> Information about how you interact with our platform, including features used, time spent, and actions taken.</li>
                    <li><strong>Technical Information:</strong> IP address, browser type and version, device information, operating system, and other technology identifiers on the devices you use to access our platform.</li>
                  </ul>
                  <p className="text-foreground/70">
                    We collect this information directly when you provide it to us, automatically as you navigate through the site, and from third parties such as our payment processors.
                  </p>
                </div>
                
                <div id="information-use" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <LucideUserCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">How We Use Your Information</h2>
                  </div>
                  <p className="text-foreground/70 mb-4">
                    We use the information we collect about you for various purposes, including:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/70">
                    <li>Providing, maintaining, and improving our services</li>
                    <li>Processing transactions and managing your account</li>
                    <li>Sending notifications about your account or subscription</li>
                    <li>Delivering relevant content and recommendations</li>
                    <li>Analyzing usage patterns to enhance user experience</li>
                    <li>Detecting and preventing fraudulent activities</li>
                    <li>Communicating with you about updates, offers, and support</li>
                    <li>Complying with legal obligations</li>
                  </ul>
                  <p className="text-foreground/70">
                    We process your personal data based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.
                  </p>
                </div>
                
                <div id="information-sharing" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <LucideDatabase className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Information Sharing</h2>
                  </div>
                  <p className="text-foreground/70 mb-4">
                    We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/70">
                    <li><strong>Service Providers:</strong> With third-party vendors who provide services on our behalf, such as payment processing, data analysis, email delivery, and customer service.</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, where your data may be transferred as a business asset.</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental regulation.</li>
                    <li><strong>Protection of Rights:</strong> To enforce our terms and policies or protect our rights, privacy, safety, or property.</li>
                  </ul>
                  <p className="text-foreground/70">
                    We do not sell your personal information to third parties for their marketing purposes without your explicit consent.
                  </p>
                </div>
                
                <div id="data-security" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <LucideLock className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Data Security</h2>
                  </div>
                  <p className="text-foreground/70 mb-4">
                    We implement appropriate security measures to protect your personal information from accidental loss, unauthorized access, and other potential threats. These measures include:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/70">
                    <li>Encryption of sensitive data during transmission and at rest</li>
                    <li>Regular security assessments and penetration testing</li>
                    <li>Access controls and authentication procedures</li>
                    <li>Monitoring systems for suspicious activities</li>
                    <li>Employee training on security and privacy practices</li>
                  </ul>
                  <p className="text-foreground/70">
                    While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data.
                  </p>
                </div>
                
                <div id="your-rights" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <LucideUserCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Your Rights</h2>
                  </div>
                  <p className="text-foreground/70 mb-4">
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/70">
                    <li><strong>Access:</strong> The right to know what personal information we hold about you.</li>
                    <li><strong>Rectification:</strong> The right to request correction of inaccurate information.</li>
                    <li><strong>Deletion:</strong> The right to request deletion of your personal information.</li>
                    <li><strong>Restriction:</strong> The right to request restriction of processing of your data.</li>
                    <li><strong>Data Portability:</strong> The right to receive your data in a structured, commonly used format.</li>
                    <li><strong>Objection:</strong> The right to object to processing of your personal data.</li>
                    <li><strong>Withdraw Consent:</strong> The right to withdraw consent where processing is based on consent.</li>
                  </ul>
                  <p className="text-foreground/70">
                    To exercise these rights, please contact us using the details provided in the "Contact Us" section. We will respond to your request within the timeframe required by applicable law.
                  </p>
                </div>
                
                <div id="cookies" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <LucideDatabase className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Cookies Policy</h2>
                  </div>
                  <p className="text-foreground/70 mb-4">
                    We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small text files that are stored on your device when you visit our website.
                  </p>
                  <p className="text-foreground/70 mb-4">
                    The types of cookies we use include:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/70">
                    <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
                    <li><strong>Marketing Cookies:</strong> Track your browsing habits to deliver targeted advertising.</li>
                  </ul>
                  <p className="text-foreground/70">
                    You can manage your cookie preferences through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.
                  </p>
                </div>
                
                <div id="third-party" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <LucideDatabase className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Third-Party Services</h2>
                  </div>
                  <p className="text-foreground/70 mb-4">
                    Our website may include links to third-party websites, plugins, and applications. Clicking on those links may allow third parties to collect or share data about you.
                  </p>
                  <p className="text-foreground/70 mb-4">
                    We use various third-party services, including:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/70">
                    <li>Payment processors to handle transactions</li>
                    <li>Analytics providers to understand user behavior</li>
                    <li>Customer support tools to assist with inquiries</li>
                    <li>Marketing services to communicate with our users</li>
                  </ul>
                  <p className="text-foreground/70">
                    These third parties have their own privacy policies, and we do not control these third-party websites. We encourage you to read the privacy policy of every website you visit.
                  </p>
                </div>
                
                <div id="children" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <LucideShield className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Children's Privacy</h2>
                  </div>
                  <p className="text-foreground/70 mb-4">
                    Our services are not intended for children under the age of 16. We do not knowingly collect personal information from children under 16.
                  </p>
                  <p className="text-foreground/70">
                    If you are a parent or guardian and believe your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from a child without verification of parental consent, we will take steps to remove that information from our servers.
                  </p>
                </div>
                
                <div id="changes" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <LucideFileText className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Changes to This Policy</h2>
                  </div>
                  <p className="text-foreground/70 mb-4">
                    We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date.
                  </p>
                  <p className="text-foreground/70">
                    You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.
                  </p>
                </div>
                
                <div id="contact" className="scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <LucideUserCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Contact Us</h2>
                  </div>
                  <p className="text-foreground/70 mb-6">
                    If you have any questions about this privacy policy or our privacy practices, please contact us:
                  </p>
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6 mb-4">
                    <ul className="space-y-3 text-foreground/70">
                      <li className="flex items-start">
                        <span className="font-medium mr-2">Email:</span> 
                        <a href="mailto:privacy@getindexednow.com" className="text-primary hover:underline">privacy@getindexednow.com</a>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium mr-2">Address:</span> 
                        <span>1234 Tech Boulevard, Suite 500, San Francisco, CA 94107, USA</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium mr-2">Data Protection Officer:</span> 
                        <span>For specific data protection inquiries, contact our DPO at dpo@getindexednow.com</span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-foreground/70">
                    We will respond to your inquiry as soon as possible, typically within 30 days.
                  </p>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg shadow-sm p-8 mb-8">
                <h3 className="text-xl font-bold mb-4">Privacy Summary</h3>
                <p className="text-foreground/70 mb-6">
                  At GetIndexedNow, we are committed to protecting your privacy and ensuring the security of your personal information. We only collect information necessary to provide our services, and we use industry-standard security measures to protect your data.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/contact-us" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
                    Contact Privacy Team
                  </a>
                  <a href="/terms" className="inline-flex items-center justify-center rounded-md border border-input bg-background h-10 px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                    View Terms of Service
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center mb-6 px-4 py-1.5 text-sm font-medium rounded-full bg-white/20 text-primary">
                <LucideShield className="mr-2 h-4 w-4" />
                Your Data, Protected
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                We Value Your Trust and Privacy
              </h2>
              <p className="text-foreground/70 mb-8">
                Have additional questions about how we handle your data? Our team is ready to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact-us" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-12 px-8 py-2 text-sm font-medium shadow-lg hover:bg-primary/90 transition-colors">
                  Contact Us
                </a>
                <a href="/faq" className="inline-flex items-center justify-center rounded-md border border-input bg-background h-12 px-8 py-2 text-sm font-medium hover:bg-muted transition-colors">
                  Read FAQ
                </a>
              </div>
            </motion.div>
          </div>
        </div>
                  </section>
        </div>
    );
};

export default PrivacyPolicy;