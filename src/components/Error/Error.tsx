import { AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  retry: () => void;
}

const ErrorState = ({ message, retry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] p-6 space-y-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Network Error</AlertTitle>
        <AlertDescription>
          {message || "We couldn't load the videos. Please check your connection."}
        </AlertDescription>
      </Alert>
      <Button onClick={retry} variant="outline" className="gap-2">
        <RefreshCcw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

export default ErrorState;