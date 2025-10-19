import { TabsContent } from "@radix-ui/react-tabs";
import { Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import Loader from "./Loader";

const AiSuggestions = ({
  data,
  isLoading,
}: {
  data: { answer: string; hints: string[] };
  isLoading: boolean;
}) => {
  return (
    <TabsContent value="ai_suggestions" className="p-6 m-0">
      {isLoading ? (
        <Loader />
      ) : data ? (
        <div>
          <h1 className="text-md">{data.answer}</h1>
          <div className="space-y-3">
            {data.hints.map((suggestion, idx) => (
              <Card key={idx} className="p-4 border-l-4 border-l-primary">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p>{suggestion}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          Click "AI Suggestions" to get refactoring tips
        </p>
      )}
    </TabsContent>
  );
};

export default AiSuggestions;
