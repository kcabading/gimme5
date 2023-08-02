import { useEffect, useRef } from "react"
import useTimer from "@/hooks/useTimer"

type TTimer = {
    initialTime: number,
    handleTimesUp: () => void
}

const Timer = ( {initialTime, handleTimesUp}: TTimer) => {
    console.log('TIMER RENDER!')
    const { timer, startTimer, stopTimer } = useTimer(initialTime, false)
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            startTimer()
        }
        console.log('start timer')
    }, [])

    if (timer === '00:00') {
        stopTimer()
        handleTimesUp()
    }
    
    return (
        <div className="timer font-bold text-4xl">{timer}</div>
    )
}

export default Timer