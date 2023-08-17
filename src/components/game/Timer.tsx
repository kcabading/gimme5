import useTimer from "@/hooks/useTimer"
import { useBoundStore } from "@/store"

const Timer = () => {
    // console.log('Timer RENDER')
    const { minutes, seconds, milliseconds} = useTimer()
    const timesUp = useBoundStore(state => state.timesUp)
    
    return (
        <>
            {
                timesUp 
                ?
                <span className="text-red-500 font-bold text-2xl sm:text-4xl font-mono">TIMES UP!</span>
                :
                <div className="timer font-bold text-4xl flex justify-center font-mono">
                    <span className="w-[50px]">{minutes}</span>:
                    <span className="w-[50px]">{seconds}</span>:
                    <span className="w-[50px]">{milliseconds}</span>
                </div>
            }
        </>
    )
}


export default Timer