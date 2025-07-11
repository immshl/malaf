import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "line" | "dots" | "spinner" | "pulse";
  text?: string;
}

export const Loading = ({ 
  className, 
  size = "md", 
  variant = "line",
  text 
}: LoadingProps) => {
  const sizeClasses = {
    sm: "h-1",
    md: "h-1.5", 
    lg: "h-2"
  };

  const containerSizes = {
    sm: "w-16",
    md: "w-24",
    lg: "w-32"
  };

  if (variant === "line") {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className={cn("bg-muted rounded-full overflow-hidden", containerSizes[size], sizeClasses[size])}>
          <div 
            className="bg-primary h-full rounded-full animate-pulse"
            style={{
              animation: "loading-line 1.5s ease-in-out infinite",
              background: "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.7) 50%, hsl(var(--primary)) 100%)"
            }}
          />
        </div>
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className="flex space-x-1 space-x-reverse">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-primary rounded-full",
                size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
              )}
              style={{
                animation: `loading-dots 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
        {text && (
          <p className="text-sm text-muted-foreground">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "spinner") {
    const spinnerSize = size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8";
    
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", spinnerSize)} />
        {text && (
          <p className="text-sm text-muted-foreground">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className={cn(
          "bg-primary rounded-full animate-pulse",
          size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6"
        )} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
};

// Loading Page Component for full page loading
export const LoadingPage = ({ 
  text, 
  variant = "line",
  className 
}: { 
  text?: string; 
  variant?: "line" | "dots" | "spinner";
  className?: string;
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-background flex items-center justify-center",
      className
    )}>
      <Loading 
        variant={variant} 
        size="lg" 
        text={text}
        className="scale-125"
      />
    </div>
  );
};

// Add loading animations to your global CSS instead
export default Loading;