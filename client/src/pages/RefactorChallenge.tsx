import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { PlayCircle, Sparkles, Send, CheckCircle2, List } from "lucide-react";
import Loading from "@/components/Loader";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";
import ProblemList from "@/components/ProblemList";
import AiSuggestions from "@/components/AiSuggestions";
import CodeRun from "@/components/CodeRun";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ManualCheck from "@/components/ManualCheck";
import Scores from "./Scores";
import FailureScores from "./FailureScores";

const RefactorChallenge = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const [code, setCode] = useState<string[]>([""]);
  const [codeString, setCodeString] = useState("");
  const mission = searchParams.get("mission");

  const query = useQueryClient();

  const {
    data: taskData,
    isLoading: isTaskDataLoading,
    error: isTaskError,
    refetch: refetchTask,
  } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/tasks/${id}`
      );
      const data = await response.json();
      console.log("refetching");
      if (mission === "refactor") {
        setCodeString(data.messed_code);
        setCode(data.messed_code.split("\n"));
      } else if (mission === "scratch") {
        setCode([]);
        setCodeString("");
      }
      return data;
    },
  });

  useEffect(() => {
    query.invalidateQueries({ queryKey: ["task"] });
  }, [mission]);

  const {
    data: codeCheckData,
    isRefetching: isCodeRefetching,
    isLoading: isCodeLoading,
    refetch: codeCheckRefetch,
  } = useQuery({
    queryKey: ["code_check"],
    queryFn: async () => {
      const RunResponse = await fetch(
        import.meta.env.VITE_API_URL + `/tasks/${id}/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lines: code }),
        }
      );

      const ManualCheckerResponse = await fetch(
        import.meta.env.VITE_API_URL + `/task/${id}/manual_quality_checker`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lines: code }),
        }
      );

      const RunData = await RunResponse.json();
      const ManualCheckerData = await ManualCheckerResponse.json();
      return { RunData: RunData.res, ManualCheckerData: ManualCheckerData.res };
    },
    enabled: false,
    staleTime: 0,
  });

  const {
    data: AiSuggestionData,
    isLoading: isAiSuggestionLoading,
    isRefetching: isAiSuggestRefetching,
    refetch: AiSuggestionRefetch,
  } = useQuery({
    queryKey: ["ai_suggestion"],
    queryFn: async () => {
      const response = await fetch(
        import.meta.env.VITE_API_URL +
          `/task/${id}/AI_checker?request=${codeString}`,
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: codeString,
        }
      );
      const data = await response.json();
      const resData = JSON.parse(data.res);
      console.log(resData);
      // Store in localStorage
      const existing = JSON.parse(
        localStorage.getItem("arrayOfSuggestions") || "[]"
      );
      existing.push(resData);
      localStorage.setItem("arrayOfSuggestions", JSON.stringify(existing));
      localStorage.setItem("score", resData.score);

      return {
        answer: resData.answer,
        hints: resData.hints || [],
      };
    },
    enabled: false,
  });

  const { resolvedTheme } = useTheme();

  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "assistant",
      content: "Hi! I'm here to help you refactor this code. Ask me anything!",
    },
  ]);

  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState("challenge");
  const [bottomTab, setBottomTab] = useState("output");
  const [showProblemList, setShowProblemList] = useState(false);
  const [showScoreMessage, setShowScoreMessage] = useState<boolean | null>(
    null
  );

  const handleCodeCheck = () => {
    codeCheckRefetch();
    setBottomTab("output");
  };

  const handleGetSuggestions = () => {
    AiSuggestionRefetch();
    setBottomTab("ai_suggestions");
  };

  const handleSubmit = () => {
    const score = localStorage.getItem("score");
    if (score) {
      if (Number(score) > 90) {
        setShowScoreMessage(true);
      } else {
        setShowScoreMessage(false);
      }
    } else {
      AiSuggestionRefetch();
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    if (chatMessages[chatMessages.length - 1].role === "user") return;

    setChatMessages((prev) => [...prev, { role: "user", content: chatInput }]);
    const res = await fetch(import.meta.env.VITE_API_URL + "/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "user",
        input: chatInput,
        llm_history: JSON.parse(
          localStorage.getItem("arrayOfSuggestions") || "[]"
        ),
      }),
    });
    setChatInput("");
    const data = await res.json();
    setChatMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.content },
    ]);
  };

  const close = (failure: boolean) => {
    setShowScoreMessage(null);
    if (failure) AiSuggestionRefetch();
    setBottomTab("ai_suggestions");
  };

  // Conditional returns after all hooks
  if (isTaskDataLoading) return <Loading />;
  if (isTaskError) return <div>Error detected</div>;
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-6 py-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-4">
          <Link to="/">
            <h1 className="text-xl font-bold cursor-pointer hover:text-primary transition-colors">
              RefactoAI
            </h1>
          </Link>
          <Button
            onClick={() => setShowProblemList(!showProblemList)}
            variant="outline"
            size="sm"
          >
            <List className="w-4 h-4 mr-2" />
            Problem List
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <Button onClick={handleCodeCheck} variant="outline" size="sm">
            <PlayCircle className="w-4 h-4 mr-2" />
            Code Check
          </Button>
          <Button onClick={handleGetSuggestions} variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Suggestions
          </Button>
          <Button onClick={handleSubmit} size="sm">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Submit
          </Button>
          <ThemeToggle />
        </div>
      </header>
      {showScoreMessage === true && <Scores close={close} />}
      {showScoreMessage === false && <FailureScores close={close} />}
      {/* Main Content */}
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={70} minSize={30}>
          <ResizablePanelGroup direction="horizontal">
            {/* Left Panel - Roadmap and Challenge */}
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className="h-full flex flex-col">
                {/* Roadmap Section - Collapsible */}
                {showProblemList && <ProblemList />}

                {/* Challenge and Attempts Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <ScrollArea className="flex-1 min-h-0">
                    <TabsContent value="challenge" className="p-6 m-0 h-full">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-bold mb-4">
                            {taskData.name}
                          </h2>
                          <p className="text-muted-foreground mb-4">
                            {taskData.description}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Middle Panel - Code Editor */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col bg-muted/20">
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  value={codeString}
                  onChange={(value) => {
                    const codeString = value || "";
                    const codeLines = codeString.split("\n");
                    setCodeString(codeString);
                    setCode(codeLines);
                  }}
                  theme={resolvedTheme === "light" ? "light" : "vs-dark"}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - AI Chat */}
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className="h-full flex flex-col border-l bg-card">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">AI Assistant</h3>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask for help..."
                      value={chatInput}
                      disabled={
                        chatMessages[chatMessages.length - 1].role === "user"
                      }
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Bottom Panel - Output/Suggestions */}
        <ResizablePanel defaultSize={30} minSize={15}>
          <Tabs
            value={bottomTab}
            onValueChange={setBottomTab}
            className="h-full flex flex-col"
          >
            <TabsList className="w-full justify-start rounded-none border-t bg-muted/30">
              <TabsTrigger value="output">Output</TabsTrigger>
              {codeCheckData?.ManualCheckerData.length > 0 && (
                <TabsTrigger value="manual_check">
                  Small Improvements
                </TabsTrigger>
              )}
              <TabsTrigger value="ai_suggestions">AI Suggestions</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              <CodeRun
                data={codeCheckData?.RunData || ""}
                isCodeCheckLoading={isCodeRefetching || isCodeLoading}
              />
              <ManualCheck
                data={codeCheckData?.ManualCheckerData || ""}
                isLoading={isCodeRefetching || isCodeLoading}
              />
              <AiSuggestions
                data={AiSuggestionData}
                isLoading={isAiSuggestRefetching || isAiSuggestionLoading}
              />
            </ScrollArea>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default RefactorChallenge;
