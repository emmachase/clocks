import { useState, useEffect } from 'react';

export function useRealTime(): Date {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        let timer: NodeJS.Timeout;

        function updateTime() {
            const now = new Date();
            setCurrentTime(now);

            const nextTick = 1000 - (now.getTime() % 1000);
            timer = setTimeout(updateTime, nextTick);
        }

        updateTime();

        return () => clearTimeout(timer);
    }, []);

    return currentTime;
}
