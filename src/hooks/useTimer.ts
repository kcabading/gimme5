import { useState } from "react";
import { convertTimeToString } from '@/lib/utils'

const Timer = function (initial: number, ascending: boolean) {
    const [counter, setCounter] = useState(initial)
    const [interval, setCounterInterval] = useState<number>()

    function stopTimer() {
        window.clearInterval(interval)
    }
    // order - determines if ascending or descending counter
    function startTimer() {
        let counterInterval = window.setInterval(() => {
            setCounter( (prev) => {
                return ascending ? prev + 1 : prev - 1
            })
        }, 1000)
        setCounterInterval(counterInterval)
    }

    function resetTimer() {
        setCounter(initial)
    }
        
    return { timer: convertTimeToString(counter), counter, stopTimer, startTimer, resetTimer }
}

export default Timer