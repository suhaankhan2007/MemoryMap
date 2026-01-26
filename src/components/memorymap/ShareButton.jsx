import React, { useState } from "react";
import { Share2, Twitter, Github, MessageSquare, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ShareButton({ isDarkMode = false }) {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Get the current page URL
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = "Check out MemoryMap - an interactive tool to visualize C++ memory management! 🧠💻";
  
  // GitHub URL - takes users to their dashboard if signed in, or login page if not
  const githubUrl = "https://github.com";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "MemoryMap - Visualize C++ Memory Management",
          text: shareText,
          url: currentUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled or error occurred
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback: Copy to clipboard
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleTweet = () => {
    const tweetText = encodeURIComponent(`${shareText} ${currentUrl}`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, "_blank", "width=550,height=420");
  };

  const handleGitHub = () => {
    // Opens GitHub - shows user's dashboard if signed in, or homepage/login if not
    window.open(githubUrl, "_blank");
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    // Send feedback to PostHog as a custom event
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture("user_feedback_submitted", {
        feedback_text: feedback,
        page_url: currentUrl,
        timestamp: new Date().toISOString(),
      });
    }
    
    setFeedbackSubmitted(true);
    toast.success("Thank you for your feedback!");
    
    setTimeout(() => {
      setShowFeedbackDialog(false);
      setFeedback("");
      setFeedbackSubmitted(false);
    }, 2000);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className={`h-8 px-3 gap-1.5 ${
              isDarkMode
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                : "bg-white/90 hover:bg-white"
            }`}
            title="Share"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share via...
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink}>
            <Check className="w-4 h-4 mr-2" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleTweet}>
            <Twitter className="w-4 h-4 mr-2" />
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGitHub}>
            <Github className="w-4 h-4 mr-2" />
            Open GitHub
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowFeedbackDialog(true)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Feedback
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? "text-gray-100" : ""}>
              Send Feedback
            </DialogTitle>
            <DialogDescription className={isDarkMode ? "text-gray-300" : ""}>
              We'd love to hear your thoughts! Share your feedback, suggestions, or report any issues.
            </DialogDescription>
          </DialogHeader>
          {feedbackSubmitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className={`text-lg font-semibold ${isDarkMode ? "text-gray-100" : ""}`}>
                Thank you for your feedback!
              </p>
              <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                We appreciate you taking the time to help us improve MemoryMap.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Tell us what you think... (e.g., feature requests, bug reports, suggestions)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className={`min-h-[120px] ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                    : ""
                }`}
              />
            </div>
          )}
          <DialogFooter>
            {!feedbackSubmitted && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowFeedbackDialog(false);
                    setFeedback("");
                  }}
                  className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600" : ""}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFeedbackSubmit}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Submit Feedback
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

