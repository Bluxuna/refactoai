import Hero from "@/components/Hero";
import Missions from "@/components/Missions";
import LearningTopics from "@/components/LearningTopics";
import HowItWorks from "@/components/HowItWorks";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import RoadmapCTA from "@/components/RoadmapCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <LearningTopics />
      <RoadmapCTA />
      <Missions />
      <HowItWorks />
      <Team />
      <Footer />
    </div>
  );
};

export default Index;
