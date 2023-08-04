import useTimer from "@/hooks/useTimer"

const Timer = () => {
    // console.log('Timer RENDER')
    const { minutes, seconds, milliseconds} = useTimer()
    
    return (
        <>
            <div className="timer font-bold text-4xl flex justify-center">
                <span className="w-[50px]">{minutes}</span>:
                <span className="w-[50px]">{seconds}</span>:
                <span className="w-[50px]">{milliseconds}</span>
            </div>
        </>
    )
}


export default Timer