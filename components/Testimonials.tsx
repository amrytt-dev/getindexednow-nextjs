import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      content: "GetIndexedNow reduced our indexing time from weeks to days. Our organic traffic increased by 300% in just two months!",
      author: "John Smith",
      role: "SEO Director, TechCorp",
      avatar: "JS"
    },
    {
      content: "The VIP queue guarantees crawler visits in 5 minutes. Perfect for time-sensitive campaigns that need immediate attention.",
      author: "Maria Johnson", 
      role: "Marketing Lead, GrowthCo",
      avatar: "MJ"
    },
    {
      content: "Incredible ROI. We're saving 20+ hours per week on manual indexing work and getting better results than ever.",
      author: "Robert Wilson",
      role: "Agency Owner, SEO Masters",
      avatar: "RW"
    }
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Trusted by thousands of{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SEO professionals
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="mb-6 text-muted-foreground">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-sm font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;