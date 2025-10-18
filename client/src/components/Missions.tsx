import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Sparkles } from "lucide-react";

const missions = [
  {
    id: "refactor",
    title: "Refactor Mission",
    description: "Fix messy AI-generated code and achieve the highest Clean Score",
    icon: Wrench,
    gradient: "bg-gradient-accent"
  },
  {
    id: "build",
    title: "From Scratch Mission",
    description: "Write elegant code from scratch and get AI quality evaluation",
    icon: Sparkles,
    gradient: "bg-gradient-primary"
  }
];

const Missions = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            Choose Your Mission
          </h2>
          <p className="text-lg text-muted-foreground">
            Two paths to mastery, both powered by AI feedback
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {missions.map((mission) => {
            const Icon = mission.icon;
            return (
              <Card 
                key={mission.id} 
                className="p-6 hover:shadow-lg transition-all duration-300 border hover:border-primary/50 bg-card"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 ${mission.gradient} rounded-2xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {mission.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {mission.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Missions;
