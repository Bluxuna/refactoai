import { Card } from "@/components/ui/card";
import { Github, Linkedin, Mail } from "lucide-react";

const team = [
  {
    name: "Alex Chen",
    role: "Clean Code Evangelist",
    avatar: "👨‍💻"
  },
  {
    name: "Sarah Kim",
    role: "AI Architecture Lead",
    avatar: "👩‍💻"
  },
  {
    name: "Marcus Johnson",
    role: "Developer Experience",
    avatar: "👨‍🎨"
  },
  {
    name: "Priya Patel",
    role: "Community Manager",
    avatar: "👩‍🚀"
  },
  {
    name: "David Lee",
    role: "Backend Architect",
    avatar: "👨‍🔬"
  }
];

const Team = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built by Clean Code Enthusiasts
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're developers who care about craft. Join us at Hacktoberfest Tbilisi 2025.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {team.slice(0, 4).map((member, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow border-2 hover:border-primary group">
                <div className="space-y-4">
                  <div className="text-6xl group-hover:scale-110 transition-transform">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button className="w-8 h-8 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center">
                      <Github className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-muted hover:bg-secondary hover:text-secondary-foreground transition-colors flex items-center justify-center">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 hover:border-primary group w-full sm:w-64">
              <div className="space-y-4">
                <div className="text-6xl group-hover:scale-110 transition-transform">
                  {team[4].avatar}
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {team[4].name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {team[4].role}
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center">
                    <Github className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-muted hover:bg-secondary hover:text-secondary-foreground transition-colors flex items-center justify-center">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
