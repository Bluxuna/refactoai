import { Card } from "@/components/ui/card";
import { BookOpen, Layers, Sparkles } from "lucide-react";

const topics = [
  {
    id: "patterns",
    title: "Design Patterns",
    description: "Master proven solutions like Singleton, Factory, and Observer",
    icon: Layers,
    gradient: "bg-gradient-primary",
    highlights: [
      "20+ Patterns",
      "Real Use Cases",
      "Anti-Patterns"
    ]
  },
  {
    id: "principles",
    title: "Clean Code Principles",
    description: "SOLID, DRY, KISS - Write self-documenting code",
    icon: BookOpen,
    gradient: "bg-gradient-accent",
    highlights: [
      "SOLID Mastery",
      "Best Practices",
      "Refactoring"
    ]
  }
];

const LearningTopics = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            What You'll Learn
          </h2>
          <p className="text-lg text-muted-foreground">
            Master the fundamentals of clean code
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <Card 
                key={topic.id} 
                className="group relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-glow"
              >
                {/* Gradient overlay */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${topic.gradient}`} />
                
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-14 h-14 ${topic.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-foreground/70 text-base min-h-[3rem]">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    {topic.highlights.map((highlight, idx) => (
                      <div 
                        key={idx} 
                        className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        {highlight}
                      </div>
                    ))}
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

export default LearningTopics;
