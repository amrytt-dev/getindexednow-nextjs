import { Upload, CreditCard, Zap } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      icon: Upload,
      title: "Upload Your URLs",
      description: "Paste your URLs or upload a CSV file with all the pages you want indexed.",
      color: "from-primary to-primary/80"
    },
    {
      number: "2", 
      icon: CreditCard,
      title: "Choose Your Plan",
      description: "Select the perfect monthly plan for your needs, from startup to enterprise scale.",
      color: "from-secondary to-secondary/80"
    },
    {
      number: "3",
      icon: Zap,
      title: "Get Indexed Fast",
      description: "Watch your pages get crawled and indexed within 7-10 days with guaranteed results.",
      color: "from-primary to-secondary"
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Get indexed in{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our streamlined process makes indexing effortless
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              
              
              <div className="relative flex flex-col items-center text-center">
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white shadow-lg`}>
                  <step.icon className="h-8 w-8" />
                </div>
                
                <div className="mb-2 text-sm font-medium text-muted-foreground">
                  Step {step.number}
                </div>
                
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground max-w-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;