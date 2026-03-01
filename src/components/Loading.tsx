import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = "Loading videos..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      {/* The animate-spin class provides the rotation */}
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse font-medium">
        {message}
      </p>
    </div>
  );
};

export default Loading;