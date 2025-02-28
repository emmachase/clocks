import { Button } from "@/components/ui/button"
import Clocks from "@/components/Clocks"
import Timelines from "./components/Timelines";
import { useId, useState } from "react";
import World from "@/assets/BlankMap-World-Equirectangular.svg?react"
import AutoSizerExample from "./components/AutoSizerExample";
import AutoSizer from "./components/AutoSizer";
import { useRealTime } from "./hooks/useRealTime";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";

function App() {
  // Example list of timezones
  const timezones = [
    "America/Los_Angeles",
    "UTC",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Pacific/Auckland",
    "Europe/Paris",
  ];

  const realTime = useRealTime();

  const [displayRealTime, setDisplayRealTime] = useState(true);

  const [centerTime, setCenterTime] = useState<Date>(new Date());
  const [windowSize, setWindowSize] = useState<number>(12);

  const realTimeSwitchId = useId();

  return (
    <div className="mx-auto p-4 space-y-4">
      <div className="flex items-baseline space-x-4">
        <h1 className="text-3xl font-bold mb-6">Girl Clocks</h1>

        <div className="flex items-center space-x-2">
          <Switch
            id={realTimeSwitchId}
            checked={displayRealTime}
            onCheckedChange={(enabled) => {
              setDisplayRealTime(enabled);
              if (!enabled) {
                setCenterTime(realTime);
              }
            }}
          />

          <Label htmlFor={realTimeSwitchId} className="text-sm mt-[-2px]">Display Real Time</Label>
        </div>
      </div>
      <Clocks timezones={timezones} time={displayRealTime ? realTime : centerTime} />
      
      <div className="flex items-center justify-center">
        {/* <AutoSizer>
          {({ width, height }) => (
            
          )}
        </AutoSizer> */}
        {/* <World className="fill-primary/20 w-full h-[70vh]" preserveAspectRatio="none"/> */}
      </div>

      <Timelines 
        timezones={timezones} 
        centerTime={displayRealTime ? realTime : centerTime}
        onCenterTimeChange={t => {setCenterTime(t); setDisplayRealTime(false)}}
        windowSize={windowSize}
        onWindowSizeChange={s => {setWindowSize(s)}}
      />
    </div>
  )
}

export default App
