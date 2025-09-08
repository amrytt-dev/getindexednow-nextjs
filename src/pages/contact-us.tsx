import { motion } from "framer-motion";
import {
  LucideArrowRight,
  LucideMapPin,
  LucidePhone,
  LucideMail,
  LucideClock,
  LucideMessageSquare,
  LucideCheck,
} from "lucide-react";
import { useState } from "react";
// Public page: no auth wrapper or dashboard header

export default function ContactUsPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "",
    phone: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...formState, [name]: value });
      setErrors(newErrors);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    const newTouched = { ...touched, [name]: true };
    setTouched(newTouched);
    setErrors(validate(formState));
  };

  const validate = (values: typeof formState) => {
    const validationErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const phoneRegex = /^[+()\-\s\d]{7,20}$/;

    if (!values.name.trim()) validationErrors.name = "Full name is required.";
    else if (values.name.trim().length < 2)
      validationErrors.name = "Name must be at least 2 characters.";

    if (!values.email.trim()) validationErrors.email = "Email is required.";
    else if (!emailRegex.test(values.email.trim()))
      validationErrors.email = "Enter a valid email address.";

    if (!values.subject.trim())
      validationErrors.subject = "Subject is required.";
    else if (values.subject.trim().length < 5)
      validationErrors.subject = "Subject must be at least 5 characters.";

    if (!values.message.trim())
      validationErrors.message = "Message is required.";
    else if (values.message.trim().length < 10)
      validationErrors.message = "Message must be at least 10 characters.";

    if (values.phone && !phoneRegex.test(values.phone.trim()))
      validationErrors.phone = "Enter a valid phone number.";
    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = Object.keys(formState).reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
    setTouched(allTouched);
    const validationErrors = validate(formState);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data && data.errors) setErrors(data.errors);
        throw new Error("Failed to send");
      }
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
        company: "",
        phone: "",
      });
    } catch (err) {
      // handled above
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Get in Touch
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                We'd Love to <span className="text-primary">Hear from You</span>
              </h1>
              <p className="text-lg text-foreground/70 mb-8">
                Have questions about our services? Looking for expert advice?
                Our team is here to help you get the most out of GetIndexedNow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact-form"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-12 px-6 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
                >
                  Send a Message
                  <LucideArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#support"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background h-12 px-6 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  View Support Options
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/90 to-secondary/90 rounded-2xl shadow-xl overflow-hidden flex items-center justify-center">
                <div className="text-white text-center p-12">
                  <LucideMessageSquare className="h-16 w-16 mb-4 mx-auto opacity-90" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    24/7 Support
                  </h3>
                  <p className="text-white/80">
                    Our dedicated team is ready to assist you anytime, anywhere.
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <LucideMapPin className="h-8 w-8 text-primary" />,
                title: "USA Office",
                description:
                  "AMRYTT MEDIA LLC\n1309 Coffeen Avenue, Suite 5131\nSheridan, WY 82801",
                link: "https://maps.app.goo.gl/rjeAuNWnAwK6tAwj6",
                linkText: "Get Direction →",
              },
              {
                icon: <LucideMapPin className="h-8 w-8 text-primary" />,
                title: "India Office",
                description:
                  "AMRYTT MEDIA LLC\nFORTUNE DIGITAL INNOVATIONS\n705,706,707 Pehel Lakeview,\nNear Vaishnodevi Circle, Khoraj,\nGandhinagar 382421 India.",
              },
              {
                icon: <LucideMapPin className="h-8 w-8 text-primary" />,
                title: "Bangladesh Office",
                description:
                  "AMRYTT MEDIA\nBhaighat, Madhupur,\nTangail,\nDhaka 1997",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-foreground/70 mb-4 whitespace-pre-line flex-grow">
                    {item.description}
                  </p>
                  {item.link && item.linkText && (
                    <a
                      href={item.link}
                      className="text-primary font-medium hover:underline inline-flex items-center"
                    >
                      {item.linkText}
                      <LucideArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-form" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-5 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2"
              >
                <div className="sticky top-24">
                  <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
                    Contact Us
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Send Us a Message
                  </h2>
                  <p className="text-foreground/70 mb-8">
                    Whether you have a question about features, pricing, or
                    anything else, our team is ready to answer all your
                    questions.
                  </p>
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <LucideCheck className="h-5 w-5 text-secondary" />
                      </div>
                      <p className="text-foreground/80">
                        <span className="font-medium">24/7 Support:</span> Our
                        customer service team is available around the clock.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <LucideCheck className="h-5 w-5 text-secondary" />
                      </div>
                      <p className="text-foreground/80">
                        <span className="font-medium">Fast Response:</span> We
                        aim to respond to all inquiries within 2 business hours.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <LucideCheck className="h-5 w-5 text-secondary" />
                      </div>
                      <p className="text-foreground/80">
                        <span className="font-medium">Expert Advice:</span> Get
                        personalized recommendations from our indexing
                        specialists.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <div className="aspect-[4/3] bg-gradient-to-tr from-primary/90 via-primary/70 to-secondary/90 p-8 flex items-center justify-center">
                      <div className="text-white text-center">
                        <h3 className="text-xl md:text-2xl font-bold mb-4">
                          Need Immediate Assistance?
                        </h3>
                        <p className="text-white/90 mb-6">
                          Our live chat support is available to help you right
                          away.
                        </p>
                        <a
                          href="#"
                          className="inline-flex items-center justify-center rounded-md bg-white text-primary h-10 px-6 py-2 text-sm font-medium shadow-lg hover:bg-white/90 transition-colors"
                        >
                          Start Live Chat
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-3"
              >
                <div className="bg-card border border-border rounded-lg p-8 shadow-md">
                  {isSubmitted ? (
                    <div className="py-10 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                        <LucideCheck className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-foreground/70 mb-6">
                        Thank you for reaching out. Our team will get back to
                        you shortly.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium mb-2"
                          >
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formState.name}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            aria-invalid={!!errors.name && touched.name}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                              errors.name && touched.name
                                ? "border-red-500 focus:ring-red-200"
                                : "border-input focus:ring-primary/50"
                            }`}
                            placeholder="Your name"
                          />
                          {errors.name && touched.name && (
                            <p
                              className="mt-1 text-sm text-red-600"
                              role="alert"
                            >
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-2"
                          >
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formState.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            aria-invalid={!!errors.email && touched.email}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                              errors.email && touched.email
                                ? "border-red-500 focus:ring-red-200"
                                : "border-input focus:ring-primary/50"
                            }`}
                            placeholder="your.email@example.com"
                          />
                          {errors.email && touched.email && (
                            <p
                              className="mt-1 text-sm text-red-600"
                              role="alert"
                            >
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="company"
                            className="block text-sm font-medium mb-2"
                          >
                            Company
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formState.company}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Your company name"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium mb-2"
                          >
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formState.phone}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            aria-invalid={!!errors.phone && touched.phone}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                              errors.phone && touched.phone
                                ? "border-red-500 focus:ring-red-200"
                                : "border-input focus:ring-primary/50"
                            }`}
                            placeholder="+1 (555) 123-4567"
                          />
                          {errors.phone && touched.phone && (
                            <p
                              className="mt-1 text-sm text-red-600"
                              role="alert"
                            >
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mb-6">
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium mb-2"
                        >
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          value={formState.subject}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.subject && touched.subject}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                            errors.subject && touched.subject
                              ? "border-red-500 focus:ring-red-200"
                              : "border-input focus:ring-primary/50"
                          }`}
                          placeholder="How can we help you?"
                        />
                        {errors.subject && touched.subject && (
                          <p className="mt-1 text-sm text-red-600" role="alert">
                            {errors.subject}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium mb-2"
                        >
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          value={formState.message}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.message && touched.message}
                          rows={6}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                            errors.message && touched.message
                              ? "border-red-500 focus:ring-red-200"
                              : "border-input focus:ring-primary/50"
                          }`}
                          placeholder="Please provide details about your inquiry..."
                        ></textarea>
                        {errors.message && touched.message && (
                          <p className="mt-1 text-sm text-red-600" role="alert">
                            {errors.message}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-12 px-8 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-70"
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <LucideArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="support"
        className="py-20 bg-gradient-to-b from-background to-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Support Options
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              We're Here to Help
            </h2>
            <p className="text-foreground/70">
              Choose the support channel that works best for you. Our team is
              ready to assist you through multiple channels.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Help Center",
                description:
                  "Browse our extensive knowledge base for tutorials, guides, and answers to common questions.",
                icon: (
                  <svg
                    className="h-12 w-12 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                ),
                cta: "Browse Help Center",
                link: "#",
              },
              {
                title: "Live Chat Support",
                description:
                  "Connect with our support team instantly for real-time assistance with any questions or issues.",
                icon: (
                  <svg
                    className="h-12 w-12 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                ),
                cta: "Start Chat",
                link: "#",
              },
              {
                title: "Schedule a Call",
                description:
                  "Book a call with our customer success team for personalized guidance and solutions.",
                icon: (
                  <svg
                    className="h-12 w-12 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                ),
                cta: "Book Appointment",
                link: "#",
              },
            ].map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-md"
              >
                <div className="p-8">
                  <div className="mb-6">{option.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{option.title}</h3>
                  <p className="text-foreground/70 mb-6">
                    {option.description}
                  </p>
                  <a
                    href={option.link}
                    className="inline-flex items-center justify-center rounded-md bg-primary/10 text-primary h-10 px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {option.cta}
                    <LucideArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started with GetIndexedNow?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Join thousands of businesses optimizing their online presence
                today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-md bg-white text-primary h-12 px-8 py-2 text-sm font-medium shadow-lg hover:bg-white/90 transition-colors"
                >
                  Start Free Trial
                </a>
                <a
                  href="#contact-form"
                  className="inline-flex items-center justify-center rounded-md border border-white bg-transparent text-white h-12 px-8 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Contact Sales
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
