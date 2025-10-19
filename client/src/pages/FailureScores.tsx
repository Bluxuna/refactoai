import { XCircle, X, AlertTriangle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const FailureScores = ({ close }: { close: (failure: boolean) => void }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const score = localStorage.getItem("score");

  const handleClose = (arg: string) => {
    if (arg === "roadmaps") {
      navigate("/roadmaps");
    }

    close(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="relative w-full max-w-md mx-4 p-8 border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 hover:bg-destructive/20 text-foreground hover:text-destructive"
          onClick={() => handleClose("close")}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Failure Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-destructive/10 p-6 rounded-full">
              <XCircle className="w-16 h-16 text-destructive" strokeWidth={2} />
            </div>
          </div>

          {/* Failure Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
              <h2 className="text-2xl font-bold text-destructive">
                Keep Trying!
              </h2>
              <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
            </div>
            <p className="text-lg text-foreground">
              Your score needs improvement. Practice makes perfect!
            </p>
          </div>

          {/* Score Display */}
          {score && (
            <div className="flex items-center gap-3 bg-destructive/10 px-6 py-4 rounded-lg border border-destructive/20">
              <Target className="w-6 h-6 text-destructive" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="text-2xl font-bold text-destructive">
                  {score}/100
                </p>
              </div>
            </div>
          )}

          {/* Encouraging Message */}
          <p className="text-sm text-muted-foreground max-w-sm">
            Don't give up! Review the challenge carefully and try again. Every
            attempt brings you closer to mastering refactoring.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={() => close(true)}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Try Again
            </Button>
            <Button
              onClick={() => handleClose("roadmaps")}
              variant="outline"
              className="w-full border-destructive/20 hover:bg-destructive/10"
            >
              Back to Roadmap
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FailureScores;
