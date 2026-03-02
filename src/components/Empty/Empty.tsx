import { VideoOff } from "lucide-react";

interface EmptyProps {
  message?: string;
}

const Empty: React.FC<EmptyProps> = ({ message = "No videos found" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      <VideoOff className="h-10 w-10 animate-bounce text-primary" />
      <p className="text-muted-foreground animate-pulse font-medium">
        {message}
      </p>
    </div>
  );
};

export default Empty;