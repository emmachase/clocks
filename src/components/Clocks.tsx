import { useRealTime } from '@/hooks/useRealTime';
import { format } from 'date-fns';
import { TZDate } from '@date-fns/tz';
import { cn } from '@/lib/utils';

function isPM(date: Date) {
  return date.getHours() >= 12;
}

interface TimezonesProps {
  timezones: string[];
  time: Date;
}

export default function Clocks({ timezones, time, ...props }: TimezonesProps & React.HTMLProps<HTMLDivElement>) { 
  return (
    <div {...props}>
      <div className="grid h-full gap-4 md:grid-cols-2 lg:grid-cols-3 content-between">
        {timezones.map((timezone) => (
          <div key={timezone} className="p-3 border rounded-md bg-card shadow-sm text-center md:text-left">
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