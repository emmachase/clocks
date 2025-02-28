import { useState, useEffect } from 'react';

interface TimezonesProps {
  timezones: string[];
}

export default function Clocks({ timezones }: TimezonesProps) {
  const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    // Function to update times
    const updateTimes = () => {
      const times: Record<string, string> = {};
      
      timezones.forEach(timezone => {
        try {
          const time = new Date().toLocaleTimeString('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          times[timezone] = time;
        } catch {
          times[timezone] = 'Invalid timezone';
        }
      });
      
      setCurrentTimes(times);
    };

    // Update times immediately
    updateTimes();
    
    // Set interval to update times every second
    const intervalId = setInterval(updateTimes, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [timezones]);

  return (
    <div className="space-y-4 p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">World Clocks</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {timezones.map((timezone) => (
          <div key={timezone} className="p-3 border rounded-md bg-card shadow-sm">
            <div className="text-sm text-muted-foreground">{timezone}</div>
            <div className="text-2xl font-mono">{currentTimes[timezone] || '...'}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 