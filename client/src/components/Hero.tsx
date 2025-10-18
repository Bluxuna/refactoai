import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <span className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-full text-sm font-semibold shadow-md">
              🎃 Hacktoberfest Tbilisi 2025
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Make Messy Code
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Beautiful Again
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            AI gives you spaghetti — you serve elegance.
          </p>
          
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Level up your clean code skills through AI-powered challenges. Refactor messy code or write pristine solutions from scratch. Get instant feedback, earn your Clean Score, and join a community of developers who care about craft.
          </p>
          
          <div className="flex justify-center items-center pt-4">
            <Button size="lg" variant="hero" className="group" asChild>
              <Link to="/roadmaps">
                Explore Roadmap
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>AI-Powered Feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Real-time Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span>Community Driven</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
