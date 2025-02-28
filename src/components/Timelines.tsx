import { cn } from '@/lib/utils';
import { TZDate } from '@date-fns/tz';
import { addHours, differenceInMilliseconds, startOfDay, subHours } from 'date-fns';

interface TimezonesProps {
  timezones: string[];
  windowSize: number; // in hours
  centerTime: Date;
  onCenterTimeChange: (time: Date) => void;
}

const typeToColor: Record<string, string> = {
  "do-not-disturb": "bg-chart-5",
  "work": "bg-chart-2",
  "personal": "bg-chart-3"
}

const dayStates = [
  {
    type: "do-not-disturb",
    start: 0,
    end: 9
  },
  {
    type: "work",
    start: 9,
    end: 17
  },
  {
    type: "personal",
    start: 17,
    end: 22
  },
  {
    type: "do-not-disturb",
    start: 22,
    end: 24
  }
]

// function millisecondsSinceMidnight(date: TZDate) {
//   return differenceInMilliseconds(date, startOfDay(date));
// }

// function hoursSinceMidnight(date: TZDate) {
//   return millisecondsSinceMidnight(date) / (1000 * 60 * 60);
// }

// function getStateForTime(time: TZDate) {
//   for (const state of dayStates) {
//     if (hoursSinceMidnight(time) >= state.start) {
//       return state;
//     }
//   }

//   return dayStates[dayStates.length - 1];
// }

// function getMillisecondsUntilNextStateChange(time: TZDate) {
//   const currentState = getStateForTime(time);
//   const nextState = dayStates.find((state) => state.start > currentState.start);
//   const nextStateStart = nextState ? nextState.start : 24;

//   return (nextStateStart * 1000 * 60 * 60) - millisecondsSinceMidnight(time);
// }

// function getHoursUntilNextStateChange(time: TZDate) {
//   return getMillisecondsUntilNextStateChange(time) / (1000 * 60 * 60);
// }

export default function Timelines({ timezones, windowSize, centerTime }: TimezonesProps) {
  

  return (
    <div className="relative space-y-2">
      {timezones.map((timezone) => {
        const localCenterTime = new TZDate(centerTime, timezone);
        const dayStart = startOfDay(localCenterTime);
        const windowStart = subHours(localCenterTime, windowSize / 2);
        const diff = differenceInMilliseconds(dayStart, windowStart) / (1000 * 60 * 60);
        const diffPct = diff / windowSize;
        const scale = 24 / windowSize;

        const day = dayStates.map((state, index) => {
          const flex = state.end - state.start;

          return (
            <div 
              key={index} 
              className="flex"
              style={{ 
                flex
              }}
            >
              <div 
                className={cn(
                  "w-full h-full",
                  typeToColor[state.type],
                  index === 0 && "ml-0.5 rounded-l-sm",
                  index === dayStates.length - 1 && "mr-0.5 rounded-r-sm"
                )}
              />
            </div>
          )
        })

        return (
          <div key={timezone} className="rounded-sm bg-secondary shadow-sm flex overflow-hidden">
            <div className="py-1 px-2 text-xs font-bold w-[150px]">{timezone}</div>

            <div className="overflow-hidden relative flex-1">
              <div className="flex h-full" style={{transform: `translateX(${(diffPct * 100)/scale}%)`, width: `${scale * 100}%`}}>
                {day}
              </div>

              <div className="flex h-full opacity-50 saturate-50 rounded-sm overflow-hidden absolute top-0 left-0" style={{transform: `translateX(${(diffPct * 100)/scale - 100}%)`, width: `${scale * 100}%`}}>
                {day}
              </div>

              <div className="flex h-full opacity-50 saturate-50 rounded-sm overflow-hidden absolute top-0 left-0" style={{transform: `translateX(${(diffPct * 100)/scale + 100}%)`, width: `${scale * 100}%`}}>
                {day}
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[1px] h-full bg-foreground"/>
            </div>
          </div>
        )
      })}
    </div>
  );
} 