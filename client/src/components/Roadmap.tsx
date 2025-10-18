import { Code2, Sparkles, BookOpen, Zap, Target, Workflow } from "lucide-react";
import { Card } from "@/components/ui/card";

const topics = [
  { id: 1, title: "Naming Conventions", icon: BookOpen, color: "bg-primary" },
  { id: 2, title: "Function Design", icon: Code2, color: "bg-secondary" },
  { id: 3, title: "Code Structure", icon: Workflow, color: "bg-accent" },
  { id: 4, title: "DRY Principle", icon: Zap, color: "bg-success" },
  { id: 5, title: "Error Handling", icon: Target, color: "bg-destructive" },
  { id: 6, title: "Code Comments", icon: Sparkles, color: "bg-primary-light" },
];

const Roadmap = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Clean Code Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master clean code principles step by step. Each topic unlocks two mission types.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <Card
                  key={topic.id}
                  className="group relative p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-2 border-2 hover:border-primary"
                >
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-md">
                    {topic.id}
                  </div>
                  
                  <div className="flex flex-col items-center text-center space-y-4 pt-2">
                    <div className={`w-16 h-16 ${topic.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="font-semibold text-lg">
                      {topic.title}
                    </h3>
                    
                    <div className="flex gap-2 text-xs">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                        Refactor
                      </span>
                      <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                        Build
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-12 p-6 bg-card rounded-2xl shadow-md border">
            <p className="text-muted-foreground">
              💡 Click any topic to choose your mission type
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
