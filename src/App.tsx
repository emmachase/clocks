import Clocks from "@/components/Clocks"
import Timelines from "./components/Timelines";
import { useId, useMemo, useRef, useState } from "react";
import World from "@/assets/Equirectangular_projection_world_map_without_borders.svg?react"
import { useRealTime } from "./hooks/useRealTime";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import DayNightTerminator from "./components/DayNightTerminator";
import { Calendar } from "./components/ui/calendar";
import { isSameDay } from "date-fns";
import CityMarkers from "./components/CityMarkers";

import cityMapList from "@/assets/cityMap.json";

interface City {
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  pop: number;
  country: string;
  iso2: string;
  iso3: string;
  province: string;
  timezone: string;
}

const cityList: City[] = cityMapList;

function useStableDate(date: Date) {
  const dateRef = useRef<Date>(date);
  
  if (!isSameDay(dateRef.current, date)) {
    dateRef.current = date;
  }
  
  return dateRef.current;
}

function getCity(city: string, country: string, province: string) {
  return cityList.find(c => 
    c.city === city &&
    c.country === country &&
    c.province === province
  );
}

function App() {
  // Example list of timezones
  // const timezones = [
  //   "America/Los_Angeles",
  //   "UTC",
  //   "America/New_York",
  //   "Europe/London",
  //   "Asia/Tokyo",
  //   "Australia/Sydney",
  //   "Pacific/Auckland",
  //   "Europe/Paris",
  // ];

  const cities = [
    getCity("Seattle", "United States of America", "Washington"),
    getCity("Los Angeles", "United States of America", "California"),
    getCity("New York", "United States of America", "New York"),
    getCity("London", "United Kingdom", "Westminster"),
    getCity("Tokyo", "Japan", "Tokyo"),
    getCity("Sydney", "Australia", "New South Wales"),
    getCity("New Delhi", "India", "Delhi"),
  ]

  const timezones = ["UTC", ...new Set(cities.map(city => city?.timezone ?? city?.city ?? ""))];

  console.log(timezones);

  // const citiesByTimezone = useMemo(() => {
  //   return timezones.map(timezone => {
  //     const city = cityList.find(city => city.timezone === timezone);
  //     return city;
  //   }).filter(city => city !== undefined);
  // }, [timezones]);

  const realTime = useRealTime();

  const [displayRealTime, setDisplayRealTime] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const [centerTime, setCenterTime] = useState<Date>(new Date());
  const [windowSize, setWindowSize] = useState<number>(12);

  const realTimeSwitchId = useId();

  const stableCalendarDate = useStableDate(displayRealTime ? realTime : centerTime);
  const stableCalendarMonth = useStableDate(calendarMonth);
  const calendar = useMemo(() => {
    return (<Calendar
      className="border rounded-md"
      mode="single"
      selected={stableCalendarDate}
      month={stableCalendarMonth}
      onMonthChange={setCalendarMonth}
      fixedWeeks
      // showOutsideDays={false}
      onSelect={(day) => {
        if (day) {
          // Modify day to prserve time
          const date = new Date(day);
          date.setHours(centerTime.getHours());
          date.setMinutes(centerTime.getMinutes());
          date.setSeconds(centerTime.getSeconds());
          date.setMilliseconds(centerTime.getMilliseconds());

          setCenterTime(date);
          setDisplayRealTime(false);
        }
      }}
    />)
  }, [stableCalendarDate, stableCalendarMonth]);

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
                setCalendarMonth(realTime);
              }
            }}
          />

          <Label htmlFor={realTimeSwitchId} className="text-sm mt-[-2px]">Display Real Time</Label>
        </div>
      </div>

      <div className="flex md:space-x-4 items-center md:items-start flex-col md:flex-row space-y-4 md:space-y-0">
        {calendar}
        <Clocks
          className="self-stretch flex-1"
          timezones={timezones} 
          time={displayRealTime ? realTime : centerTime}  
        />        
      </div>
      
      <div className="flex space-x-4 flex-col 2xl:flex-row space-y-4 2xl:space-y-0">
        <div className="flex items-start justify-center relative h-[41vh] overflow-hidden">
          <World className="fill-primary/20 w-auto h-[50vh]" /> 
          {/* aspect ratio: 2:1 */}
          <div className="absolute inset-0 h-[50vh]">
            <DayNightTerminator
              width={720}
              height={360}
              className="w-full h-[50vh]"
              time={displayRealTime ? realTime : centerTime}
              fillColor="#000"
              fillOpacity={0.2}
              strokeColor="#555"
              strokeWidth={1}
            />
          </div>
          <div className="absolute inset-0">
            <CityMarkers
              width={720}
              height={360}
              className="w-full h-[50vh]"
              cities={cities}
            />
          </div>
        </div>

        <Timelines 
          className="flex-1 flex flex-col justify-between"
          timezones={timezones} 
          centerTime={displayRealTime ? realTime : centerTime}
          onCenterTimeChange={t => {setCenterTime(t); setDisplayRealTime(false); setCalendarMonth(t)}}
          windowSize={windowSize}
          onWindowSizeChange={s => {setWindowSize(s)}}
        />
      </div>
    </div>
  )
}

export default App
