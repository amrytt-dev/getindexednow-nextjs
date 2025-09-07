import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import {Link} from "react-router-dom";
import { ScrollToTopLink } from './ScrollToTopLink';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Zap className="mr-2 h-4 w-4" />
            Get your pages indexed faster
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Automate Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Google
            </span>{" "}
            Indexing
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Professional-grade indexing tools trusted by SEO agencies and enterprise companies worldwide.
            Get your content indexed faster with guaranteed results.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ScrollToTopLink to="/auth">
              <Button variant="hero" size="xl" className="group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </ScrollToTopLink>
            <a href="#pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </a>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-lg bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">300% Traffic Increase</h3>
              <p className="text-sm text-muted-foreground">Average organic growth</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-lg bg-secondary/10 p-3">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground">5 Minutes</h3>
              <p className="text-sm text-muted-foreground">VIP queue processing</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-lg bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Guaranteed Results</h3>
              <p className="text-sm text-muted-foreground">7-10 day indexing</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl"></div>
      <div className="absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-secondary/20 to-primary/20 blur-3xl"></div>
    </section>
  );
};

export default Hero;