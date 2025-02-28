import { useRealTime } from '@/hooks/useRealTime';
import { format } from 'date-fns';
import { TZDate } from '@date-fns/tz';
import { cn } from '@/lib/utils';

function isPM(date: Date) {
  return date.getHours() >= 12;
}

/**
 * Get the UTC offset for a timezone in the format "+HH:MM" or "-HH:MM"
 * Returns empty string for UTC timezone
 */
function getUTCOffset(timezone: string, date: Date): string {
  // Return empty string for UTC timezone
  if (timezone === 'UTC') {
    return '';
  }
  
  const tzDate = new TZDate(date, timezone);
  // Get offset in minutes
  const offsetInMinutes = tzDate.getTimezoneOffset();
  // Convert to hours and minutes
  const hours = Math.abs(Math.floor(offsetInMinutes / 60));
  const minutes = Math.abs(offsetInMinutes % 60);
  // Format with sign and padding
  const sign = offsetInMinutes <= 0 ? '+' : '-'; // Note: getTimezoneOffset returns negative for timezones ahead of UTC
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

interface TimezonesProps {
  timezones: string[];
  time: Date;
}

export default function Clocks({ timezones, time, ...props }: TimezonesProps & React.HTMLProps<HTMLDivElement>) { 
  return (
    <div {...props}>
      <div className="grid h-full gap-4 md:grid-cols-2 lg:grid-cols-3 content-between">
        {timezones.map((timezone) => {
          const utcOffset = getUTCOffset(timezone, time);
          
          return (
            <div key={timezone} className="p-3 border rounded-md bg-card shadow-sm text-center md:text-left">
              <div className="text-sm text-muted-foreground">
                {timezone} {utcOffset && <span className="text-xs font-mono">(UTC{utcOffset})</span>}
              </div>
              <div className="text-2xl font-mono">
                {format(new TZDate(time, timezone), 'hh:mm:ss')}
                {" "}
                {isPM(new TZDate(time, timezone)) ? <span className="text-amber-600">PM</span> : <span className="text-blue-500">AM</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}