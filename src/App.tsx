import { Button } from "@/components/ui/button"
import Clocks from "@/components/Clocks"
import Timelines from "./components/Timelines";
import { useState } from "react";
import World from "@/assets/BlankMap-World-Equirectangular.svg?react"
import AutoSizerExample from "./components/AutoSizerExample";
import AutoSizer from "./components/AutoSizer";

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

  const [centerTime, setCenterTime] = useState<Date>(new Date());
  const [windowSize, setWindowSize] = useState<number>(12);

  return (
    <div className="mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-6">World Clock App</h1>
      <Clocks timezones={timezones} />
      
      <div className="flex items-center justify-center">
        {/* <AutoSizer>
          {({ width, height }) => (
            
          )}
        </AutoSizer> */}
        {/* <World className="fill-primary/20 w-full h-[70vh]" preserveAspectRatio="none"/> */}
      </div>

      <Timelines 
        timezones={timezones} 
        centerTime={centerTime}
        onCenterTimeChange={setCenterTime}
        windowSize={windowSize}
        onWindowSizeChange={setWindowSize}
      />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">AutoSizer Examples</h2>
        <AutoSizerExample />
      </div>
    </div>
  )
}

export default App
