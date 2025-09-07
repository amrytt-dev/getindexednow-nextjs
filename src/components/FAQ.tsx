import { Loader2, HelpCircle, LucideArrowRight, LucideLightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useFAQs } from "@/hooks/useLandingData.ts";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FAQ = () => {
    const { data: faqsData, isLoading: loadingFAQs } = useFAQs();

    // Default FAQ items similar to HelpCenter
    const defaultFAQs = [
        {
            question: "How long does it take for my URL to get indexed?",
            answer: "Most URLs are processed within 24-48 hours, though the actual indexing by search engines can vary. Our dashboard provides real-time status updates."
        },
        {
            question: "Can I cancel my subscription at any time?",
            answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period."
        },
        {
            question: "How many URLs can I submit each month?",
            answer: "The number of URLs you can submit depends on your subscription plan. Each plan comes with a specific number of monthly credits that are used for submissions."
        },
        {
            question: "Do unused credits roll over to the next month?",
            answer: "Standard credits don't roll over, but premium subscribers receive a percentage of unused credits carried forward to the next billing period."
        },
        {
            question: "Can I submit URLs from different websites?",
            answer: "Yes, you can submit URLs from any number of different websites under a single account. There's no limit to how many different domains you can use."
        },
        {
            question: "What happens if I exceed my monthly credits?",
            answer: "If you run out of credits, you can upgrade to a higher plan or wait until your credits refresh next month. We'll notify you when you're running low on credits."
        }
    ];

    // Use data from API if available, otherwise use default FAQs
    const faqsToShow = faqsData && faqsData.categories.length > 0 
        ? faqsData.faqs[faqsData.categories[0]] || defaultFAQs
        : defaultFAQs;

    return (
        <section id="faq" className="py-20 lg:py-32 bg-muted/30">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center justify-center mb-4 px-4 py-1.5 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
                            <LucideLightbulb className="mr-2 h-4 w-4" />
                            Quick Solutions
                        </div>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                            Common questions{" "}
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                about our service
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Get quick answers to frequently asked questions about our platform.
                        </p>
                    </div>

                    {loadingFAQs ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">Loading FAQs...</span>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <div className="grid gap-4 mb-8">
                                {faqsToShow.map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <h3 className="text-lg font-medium mb-3 text-foreground">{faq.question}</h3>
                                        <p className="text-foreground/70">{faq.answer}</p>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className="text-center">
                                <a 
                                    href="/help-center" 
                                    className="inline-flex items-center justify-center rounded-md bg-primary/10 text-primary h-10 px-6 py-2 text-sm font-medium hover:bg-primary/20 transition-colors"
                                >
                                    View All FAQs
                                    <LucideArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Contact support section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-16 text-center"
                    >
                        <Card className="p-8 bg-card border border-border/50 shadow-sm max-w-2xl mx-auto">
                            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-xl font-semibold text-foreground mb-4">
                                Still have questions?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                We're here to help. Contact our support team anytime.
                            </p>
                            <Link
                                to="/contact-us"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-md transition-shadow"
                            >
                                Contact Support
                            </Link>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;