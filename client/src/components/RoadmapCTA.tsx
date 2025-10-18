import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Map, ArrowRight } from "lucide-react";

const RoadmapCTA = () => {
  return (
    <section className="relative py-12 overflow-hidden">
      {/* Diagonal background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 transform -skew-y-2" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6">
            <div className="flex items-center gap-5 text-left flex-1">
              <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Map className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Not Sure Where to Start?
                </h2>
                <p className="text-muted-foreground">
                  Follow our structured roadmap to master clean code
                </p>
              </div>
            </div>
            <Button size="lg" className="shadow-lg group flex-shrink-0" asChild>
              <Link to="/roadmaps" className="flex items-center gap-2">
                Explore Roadmap
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapCTA;
