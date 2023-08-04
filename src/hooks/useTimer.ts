import { convertMSTimeToString } from '@/lib/utils'
import { useBoundStore } from "@/store";

const Timer = () => {
    const timerMS = useBoundStore((state) => state.timerMS)
    let { minutes, seconds, milliseconds, timerString} = convertMSTimeToString(timerMS)

    return { 
        minutes, 
        seconds, 
        milliseconds, 
        timerString
    }
}

export default Timer