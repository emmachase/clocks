import { useRealTime } from '@/hooks/useRealTime';
import { format } from 'date-fns';
import { TZDate } from '@date-fns/tz';

function isPM(date: Date) {
  return date.getHours() >= 12;
}

interface TimezonesProps {
  timezones: string[];
  time: Date;
}

export default function Clocks({ timezones, time }: TimezonesProps) { 
  return (
    <div className="space-y-4 p-4 border rounded-lg shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {timezones.map((timezone) => (
          <div key={timezone} className="p-3 border rounded-md bg-card shadow-sm">
            <div className="text-sm text-muted-foreground">{timezone}</div>
            <div className="text-2xl font-mono">
              {format(new TZDate(time, timezone), 'hh:mm:ss')}
              {" "}
              {isPM(new TZDate(time, timezone)) ? <span className="text-amber-600">PM</span> : <span className="text-blue-500">AM</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}