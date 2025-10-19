import { TabsContent } from "@radix-ui/react-tabs";
import { Sparkles } from "lucide-react";
import { Card } from "./ui/card";

const AiSuggestions = () => {
  const suggestions = [
    { header: "this is header", hints: ["ewdewd", "wefwedwed", "wedewd"] },
  ];

  return (
    <TabsContent value="suggestions" className="p-6 m-0">
      {suggestions.length > 0 ? (
        <div>
          <h1 className="text-md">{suggestions[0].header}</h1>
          <div className="space-y-3">
            {suggestions[0].hints.map((suggestion, idx) => (
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
