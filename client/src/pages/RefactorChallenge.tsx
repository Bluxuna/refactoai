import { useState } from "react";
import Editor from "@monaco-editor/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { PlayCircle, Sparkles, Send, CheckCircle2, ChevronDown, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

const RefactorChallenge = () => {
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();
  const [code, setCode] = useState(`def calc(a, b, c):
    x = a + b
    y = x * c
    if y > 100:
        return True
    return False`);
  
  const [output, setOutput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hi! I'm here to help you refactor this code. Ask me anything!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState("challenge");
  const [bottomTab, setBottomTab] = useState("output");
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [openTopicId, setOpenTopicId] = useState<number | null>(null);
  const [showProblemList, setShowProblemList] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Topics with exercises
  const topics = [
    {
      id: 1,
      title: "Introduction to Design Patterns",
      description: "Understand what design patterns are, why they exist, and how they help you build scalable, maintainable systems.",
      tasks: [
        { id: 1, name: "Identify Pattern Smells", difficulty: "Easy" },
        { id: 2, name: "Refactor Legacy Code", difficulty: "Medium" },
      ],
    },
    {
      id: 2,
      title: "Singleton Pattern",
      description: "Ensure a class has only one instance. Learn when and how to use this pattern safely without creating global chaos.",
      tasks: [
        { id: 5, name: "Fix Thread-Safe Singleton", difficulty: "Hard" },
        { id: 6, name: "Eliminate Global State", difficulty: "Medium" },
      ],
    },
    {
      id: 3,
      title: "Factory Pattern",
      description: "Centralize object creation logic. Learn how factories decouple your code from specific class implementations.",
      tasks: [
        { id: 9, name: "Extract Factory from Constructor", difficulty: "Medium" },
        { id: 10, name: "Remove Tight Coupling", difficulty: "Hard" },
      ],
    },
    {
      id: 4,
      title: "Observer Pattern",
      description: "Create a subscription mechanism to notify multiple objects about events that happen to the object they're observing.",
      tasks: [
        { id: 13, name: "Replace Polling with Events", difficulty: "Medium" },
        { id: 14, name: "Decouple Event Handlers", difficulty: "Medium" },
      ],
    },
  ];

  const challenge = {
    id: "messy-threshold-check",
    title: "Threshold Calculator",
    description: "In clean code challenges, we use design patterns and best practices to write maintainable code.",
    details: `This function checks if a calculated value exceeds a threshold. Your task is to refactor it using:
    
- Descriptive variable and function names
- Type hints for all parameters
- A clear docstring
- Proper return type annotation
- Eliminate magic numbers`,
    messyCode: `def calc(a, b, c):
    x = a + b
    y = x * c
    if y > 100:
        return True
    return False`,
    hints: [
      "Use descriptive names instead of x, y, a, b, c",
      "Add type hints: def function_name(param: type) -> return_type",
      "Include a docstring explaining what the function does",
      "Consider extracting the magic number 100 into a named constant"
    ]
  };

  const handleCodeCheck = () => {
    setBottomTab("output");
    setOutput("Running code check...\n\n✓ Syntax valid\n✓ Code structure looks good\n\nNote: This is a mock output. Full execution requires backend setup.");
    toast({
      title: "Code Check Complete",
      description: "Your code syntax is valid!",
    });
  };

  const handleGetSuggestions = () => {
    setBottomTab("suggestions");
    setSuggestions([
      "Consider renaming 'calc' to 'exceeds_threshold' for clarity",
      "Add type hints: def exceeds_threshold(first: float, second: float, multiplier: float) -> bool",
      "Replace magic number 100 with a named constant like THRESHOLD = 100",
      "Add a docstring: \"\"\"Check if product of sum and multiplier exceeds threshold.\"\"\"",
      "Use descriptive variable names: total instead of x, product instead of y"
    ]);
    toast({
      title: "AI Suggestions Ready",
      description: "Check the suggestions panel below",
    });
  };

  const handleSubmit = () => {
    setBottomTab("output");
    // Mock submission
    const score = Math.floor(Math.random() * 40) + 60;
    setOutput(`Submission Results:\n\n✓ Code submitted successfully\n✓ Tests passed: 3/3\n\nClean Code Score: ${score}/100\n\nFeedback:\n- Good use of descriptive names\n- Type hints present\n- Consider adding more detailed documentation\n\nNote: This is a mock result. Backend integration required for real scoring.`);
    toast({
      title: "Code Submitted!",
      description: `Score: ${score}/100`,
    });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { role: "user", content: chatInput }]);
    
    // Mock AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: "That's a great question! For clean code, focus on making your variable names self-documenting. Instead of 'x' and 'y', use names that describe what the values represent."
      }]);
    }, 500);
    
    setChatInput("");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-6 py-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-4">
          <Link to="/">
            <h1 className="text-xl font-bold cursor-pointer hover:text-primary transition-colors">RefactoAI</h1>
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
                {showProblemList && (
                  <div className="border-b">
                    <div className="border-b px-4 py-3 bg-card">
                      <h3 className="font-semibold">Problem List</h3>
                    </div>

                    <ScrollArea className="h-[300px]">
                      <div className="divide-y">
                        {topics.map((topic, idx) => (
                          <Collapsible
                            key={topic.id}
                            open={openTopicId === topic.id}
                            onOpenChange={(open) => setOpenTopicId(open ? topic.id : null)}
                          >
                            <CollapsibleTrigger className="w-full">
                              <div className={`px-6 py-4 hover:bg-muted/50 transition-colors ${
                                openTopicId === topic.id ? 'bg-muted/30' : ''
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-start gap-3 text-left flex-1">
                                    <span className="font-semibold text-muted-foreground mt-0.5">{idx + 1}.</span>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-base mb-1">{topic.title}</h4>
                                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                                    </div>
                                  </div>
                                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ml-2 ${
                                    openTopicId === topic.id ? 'rotate-180' : ''
                                  }`} />
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
                                        <div className="mt-2 flex gap-2 px-3">
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="flex-1"
                                            onClick={() => {
                                              toast({
                                                title: "Refactor Mode",
                                                description: task.name,
                                              });
                                              setSelectedTaskId(null);
                                            }}
                                          >
                                            Refactor
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="flex-1"
                                            onClick={() => {
                                              toast({
                                                title: "From Scratch Mode",
                                                description: task.name,
                                              });
                                              setSelectedTaskId(null);
                                            }}
                                          >
                                            From Scratch
                                          </Button>
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
                )}

                {/* Challenge and Attempts Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                  <TabsList className="w-full justify-start rounded-none border-b bg-muted/30 flex-shrink-0">
                    <TabsTrigger value="challenge">Challenge</TabsTrigger>
                    <TabsTrigger value="attempts">Attempts</TabsTrigger>
                  </TabsList>
                  
                  <ScrollArea className="flex-1 min-h-0">
                    <TabsContent value="challenge" className="p-6 m-0 h-full">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold mb-4">Challenge</h2>
                          <p className="text-muted-foreground mb-4">{challenge.description}</p>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{challenge.details}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Messy Code:</h3>
                          <Card className="bg-muted p-4">
                            <pre className="text-sm font-mono">{challenge.messyCode}</pre>
                          </Card>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3">Hints</h3>
                          <div className="space-y-2">
                            {challenge.hints.map((hint, idx) => (
                              <Card key={idx} className="p-3 bg-muted/50">
                                <p className="text-sm">💡 {hint}</p>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="attempts" className="p-6 m-0">
                      <h3 className="font-semibold mb-3">Your Attempts</h3>
                      <p className="text-sm text-muted-foreground">No attempts yet</p>
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
                  value={code}
                  onChange={(value) => setCode(value || "")}
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
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
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
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
          <Tabs value={bottomTab} onValueChange={setBottomTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-t bg-muted/30">
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              <TabsContent value="output" className="p-6 m-0">
                {output ? (
                  <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
                ) : (
                  <p className="text-muted-foreground text-sm">Click "Code Check" or "Submit" to see output here</p>
                )}
              </TabsContent>

              <TabsContent value="suggestions" className="p-6 m-0">
                {suggestions.length > 0 ? (
                  <div className="space-y-3">
                    {suggestions.map((suggestion, idx) => (
                      <Card key={idx} className="p-4 border-l-4 border-l-primary">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Click "AI Suggestions" to get refactoring tips</p>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default RefactorChallenge;
