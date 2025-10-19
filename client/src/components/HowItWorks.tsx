import { Card } from '@/components/ui/card';
import { ArrowRight, Code2, Sparkles } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const HowItWorks = () => {
  const messyCode = `def calc(a, b):
  x = a + b
  if x > 10:
    return True
  return False`;

  const cleanCode = `def exceeds_limit(
  first: int,
  second: int
) -> bool:
  """Check if sum > 10."""
  return first + second > 10`;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From messy to clean in three simple steps
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Single row flow */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-stretch max-w-6xl mx-auto">
            {/* Step 1: Messy Code */}
            <Card className="p-6 border-2 border-destructive/50 bg-destructive/5 h-full">
              <div className="flex flex-col items-center text-center space-y-4 h-full">
                <div className="w-14 h-14 bg-destructive/20 rounded-xl flex items-center justify-center">
                  <Code2 className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="text-lg font-bold text-destructive">Messy Code</h3>
                <div className="rounded-lg overflow-hidden border-2 border-destructive/20 w-full bg-background">
                  <SyntaxHighlighter
                    language="python"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '0.75rem',
                      fontSize: '0.7rem',
                      lineHeight: '1.3',
                    }}
                    showLineNumbers={false}
                  >
                    {messyCode}
                  </SyntaxHighlighter>
                </div>
              </div>
            </Card>

            {/* Arrow */}
            <div className="flex justify-center items-center">
              <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
            </div>

            {/* Step 2: You Refactor */}
            <Card className="p-6 border-2 border-warning/50 bg-warning/5 h-full">
              <div className="flex flex-col items-center text-center space-y-4 h-full justify-between">
                <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center shadow-lg">
                  <Code2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-warning">You Refactor</h3>
                <div className="space-y-2 w-full">
                  <div className="p-2 bg-background rounded-lg border border-warning/20 text-left">
                    <p className="text-xs font-mono">✏️ Rename variables</p>
                  </div>
                  <div className="p-2 bg-background rounded-lg border border-warning/20 text-left">
                    <p className="text-xs font-mono">✏️ Add type hints</p>
                  </div>
                  <div className="p-2 bg-background rounded-lg border border-warning/20 text-left">
                    <p className="text-xs font-mono">✏️ Write docstrings</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Arrow */}
            <div className="flex justify-center items-center">
              <ArrowRight className="w-6 h-6 text-success hidden md:block" />
            </div>

            {/* Step 3: AI Scores Clean Code */}
            <Card className="p-6 border-2 border-success/50 bg-success/5 h-full">
              <div className="flex flex-col items-center text-center space-y-4 h-full">
                <div className="w-14 h-14 bg-success/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-success" />
                </div>
                <h3 className="text-lg font-bold text-success">AI Scores Only Clean Code</h3>
                <div className="rounded-lg overflow-hidden border-2 border-success/20 w-full bg-background">
                  <SyntaxHighlighter
                    language="python"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '0.75rem',
                      fontSize: '0.7rem',
                      lineHeight: '1.3',
                    }}
                    showLineNumbers={false}
                  >
                    {cleanCode}
                  </SyntaxHighlighter>
                </div>
                <div className="text-xs text-success font-semibold">
                  Clean Code Score: 95/100 ✨
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
