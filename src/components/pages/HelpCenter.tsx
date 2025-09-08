
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  LucideArrowRight, 
  LucideSearch, 
  LucideLifeBuoy, 
  LucideFileText, 
  LucideVideo,
  LucideBookOpen,
  LucideCode,
  LucideLightbulb,
  LucideCheck,
  LucideClipboardList,
  LucideMessageSquare,
  LucideUsers,
  LucideBarChart,
  LucideSettings,
  LucideCreditCard,
  LucideX
} from "lucide-react";
import { helpArticles } from "./help/content";

export const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const categories = [
    { id: "getting-started", name: "Getting Started", icon: <LucideLifeBuoy /> },
    { id: "account-management", name: "Account & Billing", icon: <LucideUsers /> },
    { id: "features", name: "Features & Tools", icon: <LucideCode /> },
    { id: "troubleshooting", name: "Troubleshooting", icon: <LucideSettings /> },
    { id: "reports", name: "Reports & Analytics", icon: <LucideBarChart /> },
    { id: "payments", name: "Payments & Subscriptions", icon: <LucideCreditCard /> }
  ];

  // Filter popular articles based on selected category
  const getAllArticles = () => {
    const allArticles = helpArticles.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      category: a.category,
      type: a.type,
      slug: a.slug,
      icon: a.type === "video" ? <LucideVideo className="h-5 w-5 text-primary" /> : a.type === "tutorial" ? <LucideCode className="h-5 w-5 text-primary" /> : <LucideFileText className="h-5 w-5 text-primary" />
    }));
    
    let filteredArticles = allArticles;
    
    // Filter by category if one is selected
    if (selectedCategory) {
      filteredArticles = allArticles.filter(article => article.category === selectedCategory);
    }
    
    // Filter by search query if one exists
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filteredArticles = filteredArticles.filter(
        article => 
          article.title.toLowerCase().includes(query) || 
          article.description.toLowerCase().includes(query)
      );
    }
    
    return filteredArticles;
  };

  const articles = getAllArticles();

      return (
        <div className="bg-background">
      
      {/* Hero Section with Search */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center mb-6 px-4 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary">
              <LucideLifeBuoy className="mr-2 h-4 w-4" />
              Knowledge Base
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How can we help you today?
            </h1>
            <p className="text-lg text-foreground/70 mb-8">
              Find guides, tutorials, and answers to all your questions about using GetIndexedNow.
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <LucideSearch className="h-5 w-5 text-foreground/40" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for guides, tutorials, and FAQs..."
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-foreground/40 hover:text-foreground"
                >
                  <LucideX className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
        <div className="absolute -z-10 top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1),transparent_70%)]"></div>
      </section>
      
      {/* Category Browse Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Browse by Category
              </h2>
              <p className="text-foreground/70">
                Explore our help resources organized by topic to find what you need quickly.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all ${
                    selectedCategory === category.id
                      ? "border-primary/50 bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <div className={`p-3 rounded-full mb-3 ${
                    selectedCategory === category.id
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-foreground/70"
                  }`}>
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {/* Articles Section */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">
                {selectedCategory 
                  ? `${categories.find(c => c.id === selectedCategory)?.name} Articles` 
                  : searchQuery 
                    ? "Search Results" 
                    : "Popular Articles"
                }
              </h3>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  Clear Filter
                  <LucideX className="ml-1 h-3 w-3" />
                </button>
              )}
            </div>
            
            {articles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <motion.a
                    key={article.id}
                    href={`/help-center/articles/${(article as any).slug}`}
                    whileHover={{ y: -5 }}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        {article.icon}
                      </div>
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-muted mb-2">
                          {article.type === "guide" ? "Guide" : article.type === "video" ? "Video" : "Tutorial"}
                        </span>
                        <h4 className="text-lg font-medium mb-2">{article.title}</h4>
                        <p className="text-sm text-foreground/70 mb-4">{article.description}</p>
                        <div className="flex items-center text-primary text-sm font-medium">
                          Read More
                          <LucideArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-12 text-center">
                <LucideSearch className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">No results found</h4>
                <p className="text-foreground/70 mb-6">
                  We couldn't find any articles matching your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Quick Solutions Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center justify-center mb-4 px-4 py-1.5 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
                <LucideLightbulb className="mr-2 h-4 w-4" />
                Quick Solutions
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Common Questions & Answers
              </h2>
              <p className="text-foreground/70">
                Get quick answers to frequently asked questions about our platform.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-4 mb-8">
                {[
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
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-medium mb-3">{faq.question}</h3>
                    <p className="text-foreground/70">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <a 
                  href="/faq" 
                  className="inline-flex items-center justify-center rounded-md bg-primary/10 text-primary h-10 px-6 py-2 text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  View All FAQs
                  <LucideArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Video Tutorials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center justify-center mb-4 px-4 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary">
                <LucideVideo className="mr-2 h-4 w-4" />
                Video Tutorials
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Learn Visually
              </h2>
              <p className="text-foreground/70">
                Watch step-by-step tutorials to master the GetIndexedNow platform.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Getting Started with GetIndexedNow",
                  duration: "5:23",
                  thumbnail: "primary"
                },
                {
                  title: "How to Submit Bulk URLs",
                  duration: "7:15",
                  thumbnail: "secondary"
                },
                {
                  title: "Understanding Your Dashboard Analytics",
                  duration: "8:42",
                  thumbnail: "gradient"
                }
              ].map((video, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`aspect-video bg-gradient-to-br ${
                    video.thumbnail === "primary" 
                      ? "from-primary/80 to-primary/30" 
                      : video.thumbnail === "secondary" 
                      ? "from-secondary/80 to-secondary/30" 
                      : "from-primary/80 to-secondary/80"
                  } flex items-center justify-center`}>
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-foreground/60">Tutorial</span>
                      <span className="text-xs font-medium text-foreground/60">{video.duration}</span>
                    </div>
                    <h3 className="text-lg font-medium mb-4">{video.title}</h3>
                    <a 
                      href="#" 
                      className="inline-flex items-center text-primary text-sm font-medium hover:underline"
                    >
                      Watch Now
                      <LucideArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Popular Resources Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center justify-center mb-4 px-4 py-1.5 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
                <LucideBookOpen className="mr-2 h-4 w-4" />
                Resources
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Popular Resources
              </h2>
              <p className="text-foreground/70">
                Explore our most helpful guides and documentation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[ 
                {
                  title: "User Guide",
                  description: "Complete documentation for using all features of our platform.",
                  icon: <LucideFileText className="h-10 w-10 text-primary" />,
                  link: "/help-center/resources/user-guide"
                },
                {
                  title: "API Documentation",
                  description: "Technical documentation for developers integrating with our API.",
                  icon: <LucideCode className="h-10 w-10 text-primary" />,
                  link: "/help-center/resources/api-documentation"
                },
                {
                  title: "Best Practices",
                  description: "Recommendations for optimizing your indexing strategy.",
                  icon: <LucideClipboardList className="h-10 w-10 text-primary" />,
                  link: "/help-center/resources/best-practices"
                },
                {
                  title: "Glossary",
                  description: "Definitions of common terms used in website indexing.",
                  icon: <LucideBookOpen className="h-10 w-10 text-primary" />,
                  link: "/help-center/resources/glossary"
                }
              ].map((resource, index) => (
                <motion.a
                  key={index}
                  href={resource.link}
                  whileHover={{ y: -5 }}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-md hover:border-primary/30 transition-all flex flex-col"
                >
                  <div className="mb-4">{resource.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                  <p className="text-foreground/70 mb-4 flex-grow">{resource.description}</p>
                  <div className="flex items-center text-primary text-sm font-medium mt-auto">
                    Explore
                    <LucideArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Still Need Help CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Still Need Help?</h2>
              <p className="text-white/90 text-lg mb-8">
                Our support team is here to assist you with any questions or issues you may have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact-us" className="inline-flex items-center justify-center rounded-md bg-white text-primary h-12 px-8 py-2 text-sm font-medium shadow-lg hover:bg-white/90 transition-colors">
                  <LucideMessageSquare className="mr-2 h-4 w-4" />
                  Contact Support
                </a>
                <a href="#" className="inline-flex items-center justify-center rounded-md border border-white bg-transparent text-white h-12 px-8 py-2 text-sm font-medium hover:bg-white/10 transition-colors">
                  <LucideUsers className="mr-2 h-4 w-4" />
                  Community Forum
                </a>
              </div>
            </motion.div>
          </div>
        </div>
                  </section>
        </div>
    );
};

export default HelpCenter;