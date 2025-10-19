import { CheckCircle2, X, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const Scores = ({ close }: { close: (failure: boolean) => void }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const score = localStorage.getItem("score");

  const handleClose = (arg: string) => {
    if (arg === "next") {
      const nextId = (parseInt(id || "1") + 1).toString();
      const mission = searchParams.get("mission");
      navigate(`/challenge/${nextId}?mission=${mission}`);
    }
    close(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="relative w-full max-w-md mx-4 p-8 border-success/20 bg-gradient-to-br from-success/5 to-success/10 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 hover:bg-success/20 text-foreground hover:text-success"
          onClick={() => handleClose("close")}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Success Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-success/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-success/10 p-6 rounded-full">
              <CheckCircle2
                className="w-16 h-16 text-success"
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-success animate-pulse" />
              <h2 className="text-2xl font-bold text-success">
                Congratulations!
              </h2>
              <Sparkles className="w-5 h-5 text-success animate-pulse" />
            </div>
            <p className="text-lg text-foreground">
              Your score has been submitted successfully!
            </p>
          </div>

          {/* Score Display */}
          {score && (
            <div className="flex items-center gap-3 bg-success/10 px-6 py-4 rounded-lg border border-success/20">
              <Trophy className="w-6 h-6 text-success" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="text-2xl font-bold text-success">{score}/100</p>
              </div>
            </div>
          )}

          {/* Encouraging Message */}
          <p className="text-sm text-muted-foreground max-w-sm">
            Great job on completing the challenge! Keep practicing to improve
            your refactoring skills.
          </p>

          {/* Close Button */}
          <Button
            onClick={() => handleClose("next")}
            className="w-full bg-success hover:bg-success/90 text-success-foreground"
          >
            Continue Coding
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Scores;
