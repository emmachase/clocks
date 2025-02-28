import { cn } from '@/lib/utils';
import { TZDate } from '@date-fns/tz';
import { addHours, differenceInMilliseconds, startOfDay, subHours } from 'date-fns';
import { useCallback, useRef, useState, useEffect } from 'react';

interface TimezonesProps {
  timezones: string[];
  windowSize: number; // in hours
  centerTime: Date;
  onCenterTimeChange: (time: Date) => void;
  onWindowSizeChange?: (size: number) => void;
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

export default function Timelines({ 
  timezones, 
  windowSize, 
  centerTime, 
  onCenterTimeChange,
  onWindowSizeChange,
  className,
  ...props
}: TimezonesProps & React.HTMLProps<HTMLDivElement>) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number | null>(null);
  const dragStartTimeRef = useRef<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartTimeRef.current = new Date(centerTime);
    
    // Prevent text selection during drag
    e.preventDefault();
  }, [centerTime]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || dragStartXRef.current === null || dragStartTimeRef.current === null || !containerRef.current) {
      return;
    }
    
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const deltaX = e.clientX - dragStartXRef.current;
    const deltaRatio = deltaX / containerWidth;
    
    // Calculate time adjustment based on drag distance
    // Negative deltaX (drag left) moves time forward, positive deltaX (drag right) moves time backward
    const hoursDelta = -deltaRatio * windowSize;
    const newCenterTime = new Date(dragStartTimeRef.current);
    newCenterTime.setTime(newCenterTime.getTime() + hoursDelta * 60 * 60 * 1000);
    
    onCenterTimeChange(newCenterTime);
  }, [isDragging, windowSize, onCenterTimeChange]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartXRef.current = null;
    dragStartTimeRef.current = null;
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      dragStartXRef.current = null;
      dragStartTimeRef.current = null;
    }
  }, [isDragging]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (!onWindowSizeChange) return;
    
    // Determine zoom direction and factor
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9; // Zoom out (increase window) or zoom in (decrease window)
    
    // Calculate new window size with limits
    const newWindowSize = Math.max(2, Math.min(48, windowSize * zoomFactor));
    
    // Only update if there's a meaningful change
    if (Math.abs(newWindowSize - windowSize) > 0.1) {
      onWindowSizeChange(newWindowSize);
    }
  }, [windowSize, onWindowSizeChange]);

  // Add non-passive wheel event listener to ensure preventDefault works
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add wheel event listener with passive: false to ensure preventDefault works
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    // Clean up the event listener on unmount
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return (
    <div 
      {...props}
      className={cn("relative space-y-2", className)}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
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
            <div className="py-2 px-2 text-xs font-bold w-[150px]">{timezone}</div>

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