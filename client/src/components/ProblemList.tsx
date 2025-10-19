import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { Card } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loader";
import { grouper } from "@/lib/utils";
import { Link } from "react-router-dom";

function ProblemList() {
  const [openTopicId, setOpenTopicId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      return await grouper();
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <div>Error detected</div>;

  return (
    <div className="border-b">
      <div className="border-b px-4 py-3 bg-card">
        <h3 className="font-semibold">Problem List</h3>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="divide-y">
          {data?.map((topic, idx) => (
            <Collapsible
              key={idx}
              open={openTopicId === idx}
              onOpenChange={(open) => setOpenTopicId(open ? idx : null)}
            >
              <CollapsibleTrigger className="w-full">
                <div
                  className={`px-6 py-4 hover:bg-muted/50 transition-colors ${
                    openTopicId === idx ? "bg-muted/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 text-left flex-1">
                      <span className="font-semibold text-muted-foreground mt-0.5">
                        {idx + 1}.
                      </span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">
                          {topic.topic}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          some description... will be added in future. GIO WILL
                          ADD IT. 100%
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ml-2 ${
                        openTopicId === idx ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-6 pb-4 pt-2 bg-muted/20">
                  <div className="space-y-2">
                    {topic.tasks.map((task) => (
                      <div key={task.id}>
                        <Card
                          className={`p-3 hover:bg-card transition-colors cursor-pointer ${
                            selectedTaskId === task.id
                              ? "ring-2 ring-primary"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedTaskId(
                              selectedTaskId === task.id ? null : task.id
                            );
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {task.name}
                            </span>
                          </div>
                        </Card>

                        {/* Mode Selection Buttons */}
                        {selectedTaskId === task.id && (
                          <div className="mt-2 flex gap-2 px-3">
                            <Link
                              to={`/challenge/${task.id}?mission=refactor`}
                              className="flex-1 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 px-6 py-3 text-center font-medium text-foreground transition-all duration-300 hover:border-primary/40 hover:from-primary/10 hover:to-primary/20 hover:shadow-lg hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              Refactor
                            </Link>
                            <Link
                              to={`/challenge/${task.id}?mission=scratch`}
                              className="flex-1 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 px-6 py-3 text-center font-medium text-foreground transition-all duration-300 hover:border-primary/40 hover:from-primary/10 hover:to-primary/20 hover:shadow-lg hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              From Scratch
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ProblemList;
