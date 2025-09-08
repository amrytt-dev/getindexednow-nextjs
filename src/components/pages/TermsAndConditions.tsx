
import { motion } from "framer-motion";
import { useState } from "react";
import {
    LucideArrowRight,
    LucideScroll,
    LucideClipboardList,
    LucideFileText,
    LucideCalendar,
    LucideShield,
    LucideLock,
    LucideUserCheck,
    LucideAlertTriangle,
    LucideWifi,
    LucideCreditCard,
    LucideScale,
    LucideHammer,
    LucideBan,
    LucideGlobe,
    LucideMessageSquare,
    LucideScissors
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const TermsAndConditions = () => {
    const [activeSection, setActiveSection] = useState("acceptance");

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

    // Terms sections data
    const sections = [
        { id: "acceptance", label: "Acceptance of Terms", icon: <LucideClipboardList className="h-6 w-6 text-primary" /> },
        { id: "services", label: "Services Description", icon: <LucideWifi className="h-6 w-6 text-primary" /> },
        { id: "accounts", label: "User Accounts", icon: <LucideUserCheck className="h-6 w-6 text-primary" /> },
        { id: "payments", label: "Payments & Billing", icon: <LucideCreditCard className="h-6 w-6 text-primary" /> },
        { id: "subscriptions", label: "Subscription Terms", icon: <LucideScissors className="h-6 w-6 text-primary" /> },
        { id: "credits", label: "Credit Usage", icon: <LucideClipboardList className="h-6 w-6 text-primary" /> },
        { id: "restrictions", label: "Usage Restrictions", icon: <LucideBan className="h-6 w-6 text-primary" /> },
        { id: "intellectual", label: "Intellectual Property", icon: <LucideShield className="h-6 w-6 text-primary" /> },
        { id: "data", label: "Data Practices", icon: <LucideLock className="h-6 w-6 text-primary" /> },
        { id: "disclaimer", label: "Disclaimers", icon: <LucideAlertTriangle className="h-6 w-6 text-primary" /> },
        { id: "liability", label: "Limitation of Liability", icon: <LucideScale className="h-6 w-6 text-primary" /> },
        { id: "indemnification", label: "Indemnification", icon: <LucideHammer className="h-6 w-6 text-primary" /> },
        { id: "termination", label: "Termination", icon: <LucideScissors className="h-6 w-6 text-primary" /> },
        { id: "governing", label: "Governing Law", icon: <LucideGlobe className="h-6 w-6 text-primary" /> },
        { id: "changes", label: "Changes to Terms", icon: <LucideFileText className="h-6 w-6 text-primary" /> },
        { id: "contact", label: "Contact Information", icon: <LucideMessageSquare className="h-6 w-6 text-primary" /> }
    ];

    return (
        <div className="bg-background">

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-secondary/5 to-primary/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center justify-center mb-6 px-4 py-1.5 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
                                <LucideScroll className="mr-2 h-4 w-4" />
                                Legal Agreement
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Terms and Conditions
                            </h1>
                            <p className="text-lg text-foreground/70 mb-8">
                                Please read these terms carefully before using our services. By using GetIndexedNow, you agree to be bound by these terms.
                            </p>
                            <div className="flex items-center justify-center text-sm text-foreground/60">
                                <LucideCalendar className="mr-2 h-4 w-4" />
                                Last Updated: {lastUpdated}
                            </div>
                        </motion.div>
                    </div>
                </div>
                <div className="absolute -z-10 top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,hsl(var(--secondary)/0.1),transparent_70%)]"></div>
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
                                <h3 className="text-lg font-bold mb-4">Table of Contents</h3>
                                <nav className="space-y-1">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                                activeSection === section.id
                                                    ? "bg-secondary/10 text-secondary font-medium"
                                                    : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                                            }`}
                                        >
                                            {section.label}
                                        </button>
                                    ))}
                                </nav>

                                <div className="mt-8 p-4 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-lg">
                                    <h4 className="font-medium text-secondary mb-2">Questions About Our Terms?</h4>
                                    <p className="text-sm text-foreground/70 mb-3">
                                        If you have any questions about these terms, please contact our legal team.
                                    </p>
                                    <a
                                        href="/contact-us"
                                        className="inline-flex items-center text-sm font-medium text-secondary hover:underline"
                                    >
                                        Contact Us
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
                                <div id="acceptance" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideClipboardList className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Acceptance of Terms</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        By accessing or using the GetIndexedNow service, website, and any applications (collectively, the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to all of these Terms, you may not use or access the Service.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        GetIndexedNow provides website indexing and related services subject to these Terms. These Terms constitute a legally binding agreement between you and GetIndexedNow governing your access to and use of the Service.
                                    </p>
                                    <p className="text-foreground/70">
                                        If you are using the Service on behalf of a company, organization, or other entity, then "you" includes you and that entity, and you represent and warrant that you are an authorized representative of the entity with the authority to bind the entity to these Terms, and that you agree to these Terms on the entity's behalf.
                                    </p>
                                </div>

                                <div id="services" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideWifi className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Services Description</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        GetIndexedNow is a service that assists users in submitting their website URLs to search engines for indexing. Our service includes, but is not limited to:
                                    </p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/70">
                                        <li>Submission of URLs to various search engines</li>
                                        <li>Monitoring the indexation status of submitted URLs</li>
                                        <li>Reporting on indexing performance and results</li>
                                        <li>Providing analytics related to URL submissions and indexing</li>
                                        <li>Additional services as described on our website or platform</li>
                                    </ul>
                                    <p className="text-foreground/70">
                                        GetIndexedNow does not guarantee that URLs submitted through our Service will be indexed by search engines, as the ultimate decision to index content lies with the search engines themselves. Our Service is designed to facilitate and improve the likelihood of indexation, but results may vary.
                                    </p>
                                </div>

                                <div id="accounts" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideUserCheck className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">User Accounts</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        To use certain features of the Service, you may be required to create an account and provide accurate, complete, and updated information. You are solely responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        You agree to accept responsibility for all activities that occur under your account or password. GetIndexedNow reserves the right to refuse service, terminate accounts, remove or edit content, or cancel orders at its sole discretion.
                                    </p>
                                    <p className="text-foreground/70">
                                        You may not use another user's account without permission. You must notify GetIndexedNow immediately of any breach of security or unauthorized use of your account. GetIndexedNow will not be liable for any losses caused by any unauthorized use of your account.
                                    </p>
                                </div>

                                <div id="payments" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideCreditCard className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Payments & Billing</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        By subscribing to a paid plan, you agree to pay all fees associated with the plan you select. Payment must be made by a valid payment method specified when you subscribe. All payments are processed through our third-party payment processors.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        Subscription fees are billed in advance on a monthly or annual basis, depending on the billing cycle you select when purchasing a subscription. Unless otherwise stated, subscriptions automatically renew at the end of each billing period.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        You authorize us to charge your payment method for all fees incurred by your account. If your payment cannot be processed, we may suspend or terminate your access to the Service until payment is received.
                                    </p>
                                    <p className="text-foreground/70">
                                        All fees are exclusive of taxes, which you are responsible for paying. If you are exempt from taxation, you must provide valid exemption documentation.
                                    </p>
                                </div>

                                <div id="subscriptions" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideScissors className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Subscription Terms</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        Subscriptions to GetIndexedNow automatically renew at the end of each billing period unless canceled before the renewal date. You may cancel your subscription at any time through your account settings or by contacting our support team.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        If you cancel your subscription, you will continue to have access to the Service until the end of your current billing period. No refunds or credits will be provided for partial billing periods, except as required by law.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        GetIndexedNow reserves the right to change subscription fees at any time. Any price changes will be communicated to you in advance and will apply to the next billing cycle after the notice period.
                                    </p>
                                    <p className="text-foreground/70">
                                        Free trials, if offered, are available to new users only, unless otherwise specified. At the end of the trial period, your account will automatically convert to a paid subscription unless you cancel before the trial ends.
                                    </p>
                                </div>

                                <div id="credits" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideClipboardList className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Credit Usage</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        GetIndexedNow operates on a credit-based system for URL submissions. Each subscription plan includes a specific number of credits that can be used during the billing period. Credits are consumed when URLs are submitted for indexing.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        Standard credits expire at the end of each billing cycle and do not roll over to the next period, unless otherwise specified in your plan. Premium plans may offer partial credit rollover features as described in the plan details.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        Credits may be consumed at different rates depending on the type of service used (e.g., standard indexing, priority indexing). VIP or priority submissions may consume more credits than standard submissions.
                                    </p>
                                    <p className="text-foreground/70">
                                        Additional credits may be purchased separately at the rates published on our website. These additional credits are subject to the same terms as subscription credits unless otherwise specified at the time of purchase.
                                    </p>
                                </div>

                                <div id="restrictions" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideBan className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Usage Restrictions</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        When using GetIndexedNow, you agree not to:
                                    </p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/70">
                                        <li>Submit URLs that contain illegal, offensive, or prohibited content</li>
                                        <li>Use the Service for any unlawful purpose or to violate any laws</li>
                                        <li>Submit URLs to websites that violate search engine terms of service</li>
                                        <li>Attempt to manipulate search engine rankings through deceptive practices</li>
                                        <li>Use automated tools or scripts to access the Service without our express permission</li>
                                        <li>Reverse engineer, decompile, or attempt to extract the source code of our Service</li>
                                        <li>Share your account credentials with others or allow multiple users to use a single account</li>
                                        <li>Interfere with or disrupt the integrity or performance of the Service</li>
                                        <li>Attempt to gain unauthorized access to the Service or its related systems</li>
                                    </ul>
                                    <p className="text-foreground/70">
                                        GetIndexedNow reserves the right to refuse service, terminate accounts, or remove content if these restrictions are violated. We may also report violations to appropriate law enforcement authorities.
                                    </p>
                                </div>

                                <div id="intellectual" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideShield className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Intellectual Property</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        The Service and its original content, features, and functionality are owned by GetIndexedNow and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        You may not use, copy, adapt, modify, prepare derivative works based upon, distribute, license, sell, transfer, publicly display, publicly perform, transmit, stream, broadcast, or otherwise exploit the Service or any portion of it, except as expressly permitted in these Terms.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        You retain any rights you may have to the URLs and websites you submit through the Service. By submitting URLs, you grant GetIndexedNow a worldwide, non-exclusive, royalty-free license to use, reproduce, process, and display the submitted URLs solely for the purpose of providing the Service to you.
                                    </p>
                                    <p className="text-foreground/70">
                                        The GetIndexedNow name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of GetIndexedNow or its affiliates. You may not use such marks without the prior written permission of GetIndexedNow.
                                    </p>
                                </div>

                                <div id="data" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideLock className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Data Practices</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        GetIndexedNow collects and processes information about you and your use of the Service as described in our Privacy Policy. By using the Service, you consent to the collection and processing of this information as described in the Privacy Policy.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing and against accidental loss, destruction, or damage.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        You own all data you submit to the Service, including URLs, website information, and account details. However, you grant GetIndexedNow a license to use this data to provide, maintain, and improve the Service.
                                    </p>
                                    <p className="text-foreground/70">
                                        GetIndexedNow may use aggregated, anonymized data derived from user submissions for analytical purposes, service improvements, and research. This data will not personally identify you or your websites.
                                    </p>
                                </div>

                                <div id="disclaimer" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideAlertTriangle className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Disclaimers</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        GetIndexedNow does not warrant that the Service will function uninterrupted, securely, or be available at any particular time or location; that any errors or defects will be corrected; or that the Service is free of viruses or other harmful components.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        GetIndexedNow does not guarantee that URLs submitted through the Service will be indexed by search engines or that any particular search engine ranking will be achieved. The decision to index content is made solely by search engines and is beyond our control.
                                    </p>
                                    <p className="text-foreground/70">
                                        No advice or information, whether oral or written, obtained from GetIndexedNow or through the Service, will create any warranty not expressly stated in these Terms.
                                    </p>
                                </div>

                                <div id="liability" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideScale className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Limitation of Liability</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL GETINDEXEDNOW, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, THAT RESULT FROM THE USE OF, OR INABILITY TO USE, THE SERVICE.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        UNDER NO CIRCUMSTANCES WILL GETINDEXEDNOW BE RESPONSIBLE FOR ANY DAMAGE, LOSS, OR INJURY RESULTING FROM HACKING, TAMPERING, OR OTHER UNAUTHORIZED ACCESS OR USE OF THE SERVICE OR YOUR ACCOUNT OR THE INFORMATION CONTAINED THEREIN.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, GETINDEXEDNOW ASSUMES NO LIABILITY OR RESPONSIBILITY FOR ANY: (I) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT; (II) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO OR USE OF THE SERVICE; (III) UNAUTHORIZED ACCESS TO OR USE OF OUR SERVERS AND/OR ANY PERSONAL INFORMATION STORED THEREIN; (IV) INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICE; (V) BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE THAT MAY BE TRANSMITTED TO OR THROUGH THE SERVICE BY ANY THIRD PARTY; (VI) ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE THROUGH THE SERVICE.
                                    </p>
                                    <p className="text-foreground/70">
                                        IN NO EVENT SHALL GETINDEXEDNOW'S TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, OR CAUSES OF ACTION EXCEED THE AMOUNT YOU HAVE PAID GETINDEXEDNOW IN THE LAST SIX (6) MONTHS, OR, IF GREATER, ONE HUNDRED DOLLARS ($100).
                                    </p>
                                </div>

                                <div id="indemnification" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideHammer className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Indemnification</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        You agree to defend, indemnify, and hold harmless GetIndexedNow, its officers, directors, employees, and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from:
                                    </p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/70">
                                        <li>Your use of and access to the Service</li>
                                        <li>Your violation of any term of these Terms</li>
                                        <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right</li>
                                        <li>Any claim that content submitted by you caused damage to a third party</li>
                                    </ul>
                                    <p className="text-foreground/70">
                                        This defense and indemnification obligation will survive these Terms and your use of the Service.
                                    </p>
                                </div>

                                <div id="termination" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideScissors className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Termination</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        GetIndexedNow may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or cancel your subscription through your account settings.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                                    </p>
                                    <p className="text-foreground/70">
                                        In the event of account termination, GetIndexedNow may delete any data associated with your account, including submitted URLs, reports, and analytics. It is your responsibility to export any data you wish to retain before terminating your account.
                                    </p>
                                </div>

                                <div id="governing" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideGlobe className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Governing Law</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in San Francisco County, California, United States.
                                    </p>
                                    <p className="text-foreground/70">
                                        You agree to submit to the personal jurisdiction of the courts located within San Francisco County, California for the purpose of litigating all such claims or disputes.
                                    </p>
                                </div>

                                <div id="changes" className="mb-12 scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideFileText className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Changes to Terms</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-4">
                                        GetIndexedNow reserves the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page and updating the "Last Updated" date.
                                    </p>
                                    <p className="text-foreground/70 mb-4">
                                        Your continued use of the Service after any such changes constitutes your acceptance of the new Terms. If you do not agree to the new terms, please stop using the Service.
                                    </p>
                                    <p className="text-foreground/70">
                                        It is your responsibility to review these Terms periodically for changes. Material changes will not be applied retroactively and will become effective no sooner than fourteen (14) days after they are posted, except that changes addressing new functions of the Service or changes made for legal reasons will be effective immediately.
                                    </p>
                                </div>

                                <div id="contact" className="scroll-mt-24">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-secondary/10 mr-4">
                                            <LucideMessageSquare className="h-6 w-6 text-secondary" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Contact Information</h2>
                                    </div>
                                    <p className="text-foreground/70 mb-6">
                                        If you have any questions about these Terms, please contact us:
                                    </p>
                                    <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-lg p-6 mb-4">
                                        <ul className="space-y-3 text-foreground/70">
                                            <li className="flex items-start">
                                                <span className="font-medium mr-2">Email:</span>
                                                <a href="mailto:legal@getindexednow.com" className="text-secondary hover:underline">legal@getindexednow.com</a>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="font-medium mr-2">Address:</span>
                                                <span>1234 Tech Boulevard, Suite 500, San Francisco, CA 94107, USA</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-lg shadow-sm p-8 mb-8">
                                <h3 className="text-xl font-bold mb-4">Acknowledgment</h3>
                                <p className="text-foreground/70 mb-6">
                                    By using GetIndexedNow, you acknowledge that you have read these Terms and Conditions, understand them, and agree to be bound by them. If you do not agree to these Terms, you must not access or use the Service.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button variant="secondary" size="lg">
                                        I Accept the Terms
                                    </Button>
                                    <a href="/privacy-policy" className="inline-flex items-center justify-center rounded-md border border-input bg-background h-12 px-6 py-2 text-sm font-medium hover:bg-muted transition-colors">
                                        View Privacy Policy
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Print-Friendly CTA */}
            <section className="py-16 bg-gradient-to-br from-secondary/5 to-primary/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center justify-center mb-6 px-4 py-1.5 text-sm font-medium rounded-full bg-white/20 text-secondary">
                                <LucideFileText className="mr-2 h-4 w-4" />
                                For Your Records
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                Need a Copy of These Terms?
                            </h2>
                            <p className="text-foreground/70 mb-8">
                                You can print or save these terms for your records. We also keep archives of previous versions.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => window.print()} className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground h-12 px-8 py-2 text-sm font-medium shadow-lg hover:bg-secondary/90 transition-colors">
                                    <LucideFileText className="mr-2 h-4 w-4" />
                                    Print Terms
                                </button>
                                <a href="#" className="inline-flex items-center justify-center rounded-md border border-input bg-background h-12 px-8 py-2 text-sm font-medium hover:bg-muted transition-colors">
                                    <LucideClipboardList className="mr-2 h-4 w-4" />
                                    Previous Versions
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsAndConditions;