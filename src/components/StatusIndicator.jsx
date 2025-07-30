import { useState, useEffect } from "react";
import { Wifi, WifiOff, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [latency, setLatency] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate latency measurement
    const measureLatency = () => {
      const start = Date.now();
      fetch('/favicon.ico', { mode: 'no-cors' })
        .then(() => {
          setLatency(Date.now() - start);
        })
        .catch(() => {
          setLatency(null);
        });
    };

    const interval = setInterval(measureLatency, 5000);
    measureLatency();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const getLatencyColor = () => {
    if (!latency) return "text-muted-foreground";
    if (latency < 100) return "text-success";
    if (latency < 300) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Badge 
        variant="outline" 
        className="bg-card/90 backdrop-blur-sm border-border/30 shadow-md"
      >
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-3 w-3 text-success" />
          ) : (
            <WifiOff className="h-3 w-3 text-destructive" />
          )}
          <span className="text-xs">
            {isOnline ? "Online" : "Offline"}
          </span>
          {isOnline && latency && (
            <>
              <Activity className={`h-3 w-3 ${getLatencyColor()}`} />
              <span className={`text-xs ${getLatencyColor()}`}>
                {latency}ms
              </span>
            </>
          )}
        </div>
      </Badge>
    </div>
  );
};

export default StatusIndicator;