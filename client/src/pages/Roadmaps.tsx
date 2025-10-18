import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, Wrench, Sparkles, BookOpen, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

const roadmapTopics = [
  {
    id: 1,
    title: "Introduction to Design Patterns",
    description: "Understand what design patterns are, why they exist, and how they help you build scalable, maintainable systems.",
    level: "Beginner",
    tasks: [
      { id: 1, name: "Identify Pattern Smells", difficulty: "Easy" },
      { id: 2, name: "Refactor Legacy Code", difficulty: "Medium" },
    ],
  },
  {
    id: 2,
    title: "Singleton Pattern",
    description: "Ensure a class has only one instance. Learn when and how to use this pattern safely without creating global chaos.",
    level: "Beginner",
    tasks: [
      { id: 5, name: "Fix Thread-Safe Singleton", difficulty: "Hard" },
      { id: 6, name: "Eliminate Global State", difficulty: "Medium" },
    ],
  },
  {
    id: 3,
    title: "Factory Pattern",
    description: "Centralize object creation logic. Learn how factories decouple your code from specific class implementations.",
    level: "Intermediate",
    tasks: [
      { id: 9, name: "Extract Factory from Constructor", difficulty: "Medium" },
      { id: 10, name: "Remove Tight Coupling", difficulty: "Hard" },
    ],
  },
  {
    id: 4,
    title: "Observer Pattern",
    description: "Create a subscription mechanism to notify multiple objects about events that happen to the object they're observing.",
    level: "Intermediate",
    tasks: [
      { id: 13, name: "Replace Polling with Events", difficulty: "Medium" },
      { id: 14, name: "Decouple Event Handlers", difficulty: "Medium" },
    ],
  },
];

const Roadmaps = () => {
  const { toast } = useToast();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Learning Roadmap</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Your Path to Clean Code Mastery
            </h2>
            <p className="text-lg text-muted-foreground">
              Master design patterns through hands-on practice. Each topic includes refactoring challenges and from-scratch exercises to solidify your understanding.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Topics - Vertical Path with Circles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-[60px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent opacity-20" />
              
              <div className="space-y-16">
                {roadmapTopics.map((topic, index) => (
                  <div 
                    key={topic.id} 
                    className="relative flex items-start gap-8 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Numbered Circle - Fixed Position */}
                    <div className="relative z-0 flex-shrink-0 self-start">
                      <div className="w-[120px] h-[120px] rounded-full bg-gradient-primary flex items-center justify-center shadow-glow hover-scale transition-all duration-300 cursor-pointer group">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary-foreground mb-1">
                            {index + 1}
                          </div>
                          <div className="text-xs text-primary-foreground/80 font-medium">
                            {topic.level}
                          </div>
                        </div>
                      </div>
                      {/* Pulse Ring Animation */}
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
                    </div>

                    {/* Topic Card */}
                    <Card className="flex-1 p-6 hover:shadow-lg transition-all duration-300 border hover:border-primary/50 hover-scale">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                            <p className="text-sm text-muted-foreground">{topic.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <BookOpen className="w-4 h-4" />
                            <span>{topic.tasks.length} tasks</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Collapsible
                            open={openDropdownId === topic.id}
                            onOpenChange={(open) => {
                              setOpenDropdownId(open ? topic.id : null);
                              if (!open) setSelectedTaskId(null);
                            }}
                          >
                            <CollapsibleTrigger asChild>
                              <Button variant="outline" size="sm" className="group">
                                View Tasks
                                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${
                                  openDropdownId === topic.id ? 'rotate-180' : ''
                                }`} />
                              </Button>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent className="mt-4">
                              <div className="space-y-2 bg-muted/50 p-4 rounded-lg border">
                                {topic.tasks.map((task) => (
                                  <div key={task.id}>
                                    <Card 
                                      className={`p-3 hover:bg-card transition-colors cursor-pointer ${
                                        selectedTaskId === task.id ? 'ring-2 ring-primary' : ''
                                      }`}
                                      onClick={() => {
                                        setSelectedTaskId(selectedTaskId === task.id ? null : task.id);
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{task.name}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                          task.difficulty === 'Easy' 
                                            ? 'bg-success/20 text-success' 
                                            : task.difficulty === 'Medium'
                                            ? 'bg-warning/20 text-warning'
                                            : 'bg-destructive/20 text-destructive'
                                        }`}>
                                          {task.difficulty}
                                        </span>
                                      </div>
                                    </Card>
                                    
                                    {/* Mode Selection Buttons */}
                                    {selectedTaskId === task.id && (
                                      <div className="mt-2 flex gap-2 px-3 animate-fade-in">
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="flex-1 group"
                                          asChild
                                        >
                                          <Link to="/challenge/messy-threshold-check">
                                            <Wrench className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                                            Refactor
                                          </Link>
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="flex-1 group"
                                          asChild
                                        >
                                          <Link to="/challenge/messy-threshold-check">
                                            <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                            From Scratch
                                          </Link>
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Roadmaps;
