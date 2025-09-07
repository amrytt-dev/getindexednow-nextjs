import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Clock, BarChart3, Layers, Zap, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Upload,
      title: "Bulk URL Processing",
      description: "Submit up to 10,000 URLs at once for lightning-fast indexing across all your web properties.",
      color: "text-primary"
    },
    {
      icon: Zap,
      title: "VIP Priority Queue",
      description: "Guarantee crawler visits in 5 minutes with VIP processing, compared to 24 hours in standard queue.",
      color: "text-secondary"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track indexing progress with detailed reports, success rates, and comprehensive CSV exports.",
      color: "text-primary"
    },
    {
      icon: Layers,
      title: "Batch Management",
      description: "Organize your URLs into batches for better project management and tracking across campaigns.",
      color: "text-secondary"
    },
    {
      icon: Clock,
      title: "Scheduling Tools",
      description: "Schedule your indexing campaigns to run at optimal times for maximum search engine visibility.",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with encrypted data transmission and secure API endpoints for peace of mind.",
      color: "text-secondary"
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              dominate search results
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Professional-grade indexing tools trusted by SEO agencies and enterprise companies worldwide.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group border-0 bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;