import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto text-center p-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Visualize C++ Memory Layout Instantly
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Stop guessing how your C++ code interacts with memory. Paste your code to see a live, interactive visualization of the stack and the heap. Perfect for students, educators, and developers.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/app">
            <Button size="lg">Try it Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

