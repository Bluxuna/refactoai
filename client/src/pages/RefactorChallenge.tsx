import { useState } from "react";
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
import {
  PlayCircle,
  Sparkles,
  Send,
  CheckCircle2,
  List,
  Loader,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";
import ProblemList from "@/components/ProblemList";
import AiSuggestions from "@/components/AiSuggestions";
import CodeRun from "@/components/CodeRun";
import { useQuery } from "@tanstack/react-query";

const RefactorChallenge = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const mission = searchParams.get("mission");
  const [code, setCode] = useState<string[]>([]);

  // const {
  //   data: taskData,
  //   isLoading: isTaskDataLoading,
  //   error: isTaskError,
  // } = useQuery({
  //   queryKey: ["task"],
  //   queryFn: async () => {
  //     return [];
  //   },
  // });

  const {
    data: codeCheckData,
    isLoading: isCodeCheckLoading,
    isError: isCodeCheckError,
  } = useQuery({
    queryKey: ["code_check"],
    queryFn: async () => {
      const res = await fetch(
        import.meta.env.VITE_API_URL + `/tasks/${id}/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lines: code }),
        }
      );

      const data = res.json();

      console.log(data);
      return [];
    },
    enabled: true,
  });

  // const {
  //   data: AiSuggestionData,
  //   isLoading: isAiSuggestionLoading,
  //   isError: isAiSuggestionError,
  // } = useQuery({
  //   queryKey: ["ai_suggestion"],
  //   queryFn: async () => {},
  // });

  // if (isTaskDataLoading) return <Loader />;
  // if (isTaskError) return <div>Error detected</div>;

  const { toast } = useToast();
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

  const handleCodeCheck = () => {};

  const handleGetSuggestions = () => {
    setBottomTab("suggestions");
    toast({
      title: "AI Suggestions Ready",
      description: "Check the suggestions panel below",
    });
  };

  const handleSubmit = () => {
    setBottomTab("output");
    // Mock submission
    const score = Math.floor(Math.random() * 40) + 60;
    toast({
      title: "Code Submitted!",
      description: `Score: ${score}/100`,
    });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: chatInput }]);

    // Mock AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "That's a great question! For clean code, focus on making your variable names self-documenting. Instead of 'x' and 'y', use names that describe what the values represent.",
        },
      ]);
    }, 500);

    setChatInput("");
  };

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
                          <h2 className="text-2xl font-bold mb-4">Challenge</h2>
                          <p className="text-muted-foreground mb-4">
                            some description we will get from db
                          </p>
                        </div>

                        {/* <div>
                          <h3 className="font-semibold mb-3">Hints</h3>
                          <div className="space-y-2">
                            {challenge.hints.map((hint, idx) => (
                              <Card key={idx} className="p-3 bg-muted/50">
                                <p className="text-sm">💡 {hint}</p>
                              </Card>
                            ))}
                          </div>
                        </div> */}
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
                  value={code[0]}
                  onChange={(value) => {
                    const codeString = value || "";
                    const codeLines = codeString.split("\n");
                    console.log("Code lines:", codeLines);
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
              <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              <CodeRun />
              <AiSuggestions />
            </ScrollArea>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default RefactorChallenge;
