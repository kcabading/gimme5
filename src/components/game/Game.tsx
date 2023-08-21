import Timer from "@/components/game/Timer";

import { forwardRef } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { TGuessDetail } from "@/types/play";
import { useBoundStore } from "@/store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Table, Undo } from "lucide-react"
import { Input } from "../ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";

import { TQuestion } from "@/types/play";


type IGameProps = {
    question: TQuestion,
    guesses: TGuessDetail[],
    gameLoading: boolean,
    handleInputChange: (e:React.KeyboardEvent<HTMLInputElement>) => void,
    handleHintOpen: (hint: number) => void,
}

const Game = forwardRef<HTMLInputElement, IGameProps>(({question, gameLoading, guesses, handleInputChange}: IGameProps, inputRef) => {

    const [, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const timesUp = useBoundStore((state) => state.timesUp)
    const revealAnswers = useBoundStore((state) => state.revealAnswers)
    const noOfCorrectAnswer = useBoundStore((state) => state.noOfCorrectAnswer)
    const setRevealAnswers = useBoundStore((state) => state.setRevealAnswers)
    const setTimesUp = useBoundStore((state) => state.setTimesUp)
    const resetGameState = useBoundStore((state) => state.resetPlay)
    const errorMessage = useBoundStore((state) => state.errorMessage)

    const handleViewResultsOnTimesUp = () => {
        setTimesUp(false)
    }

    const handleResetGame = () => {
        setSearchParams({})
        navigate('/play')
        resetGameState()
    }

    return (
        <>
            {
                gameLoading
                ?
                <div className="gimme5-game-loading w-full">
                    <div className="flex justify-between">
                        <Skeleton className="s:w-[200px] w-[150px] h-[30px] rounded-full" />
                        <Skeleton className="s:w-[200px] w-[150px] h-[30px] rounded-full" />
                    </div>
                    <div className="flex flex-col space-y-3 mt-10 items-center">
                        <Skeleton className="w-full h-[30px] mx-2" />
                        <Skeleton className="w-[300px] h-[30px]" />
                    </div>
                    <div className="flex justify-center my-5">
                        <Skeleton className="w-[500px] h-[50px] rounded-md" />
                    </div>
                    <div className="grid grid-cols-8 gap-4 sm:gap-5w-full">
                        <Skeleton className="col-span-4 h-[70px] rounded-lg" />
                        <Skeleton className="col-span-4 h-[70px] rounded-lg" />
                        <Skeleton className="col-start-3 col-span-4 h-[70px] rounded-lg" />
                        <Skeleton className="col-span-4 h-[70px] rounded-lg" />
                        <Skeleton className="col-span-4 h-[70px] rounded-lg" />
                    </div>
                </div>
                :
                <div className="gimme5-game text-center relative">

                    {
                        errorMessage
                        ?
                        <>
                            <p className="my-10 font-mono text-2xl"> {errorMessage}</p>
                            <Button variant={'default'} onClick={ () => handleResetGame() }>Play new game</Button>
                        </>
                        :
                        <>
                            <div className="flex">
                                <Button onClick={handleResetGame} variant={'link'} className="text-xs sm:text-sm">
                                    <ArrowLeft className="mr-2 h-4 w-4"/>Back to Category
                                </Button>
                            </div>
                            <div className="flex justify-between items-center mb-5 max-sm:top-20 max-sm:sticky">
                                <p className="text-lg sm:text-2xl font-mono"><span className="font-bold mb-5">Category</span>: {question.category}</p>
                                <Timer />
                            </div>
                            <div className="gimme5-question mb-5">
                                <p className="text-2xl sm:text-4xl font-mono">{question.question}&nbsp;({question.language})</p>
                            </div>
                            {
                                timesUp 
                                ?
                                <div className='my-5 flex gap-4 justify-center'>
                                    <Button disabled={revealAnswers} onClick={setRevealAnswers} variant={"secondary"} className="text-xs sm:text-sm">
                                        <Eye className="mr-2 h-4 w-4"/>
                                        Reveal Answers
                                    </Button>
                                    {
                                        noOfCorrectAnswer > 0 && 
                                        <Button variant={"secondary"} onClick={() => handleViewResultsOnTimesUp()} className="text-xs sm:text-sm">
                                            <Table className="mr-2 h-4 w-4"/>
                                            View Results
                                        </Button>
                                    }
                                    <Button onClick={handleResetGame} variant={"secondary"} className="text-xs sm:text-sm">
                                        <Undo className="mr-2 h-4 w-4"/>
                                        New Game?
                                    </Button>
                                </div>
                                :
                                <div className="input-answer sm:w-1/2 m-auto mb-5">
                                    <Input ref={inputRef} type="text" className="text-2xl sm:text-4xl border-4 focus-visible:ring-0 sm:p-8 p-6" placeholder="Start Typing..." onKeyUpCapture={ (e) => handleInputChange(e) }/>
                                    {/* <div className="hints flex items-center justify-center mt-3 text-2xl">
                                        <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(1) }><GiMagnifyingGlass /></button>
                                        <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(2) }><GiMagnifyingGlass /></button>
                                        <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(3) }><GiMagnifyingGlass /></button>
                                    </div> */}
                                </div>
                            }
                            
                            <div className="grid grid-cols-8 gap-3 sm:gap-5">
                                {
                                    question.answers.map( (answer, index) => {
                                        
                                        let isCorrect = guesses.map( r => r.guess).includes(answer.toLowerCase()) ? true : false
                                        return (
                                            <button
                                                key={index}
                                                className={`${index === 2 ? 'col-start-3' : ''} ${isCorrect ? 'border-green-500' : ''} ${!isCorrect && revealAnswers ? 'border-red-500 animate-in' : ''} col-span-4 px-5 py-5 border-4 font-bold rounded-2xl text-2xl sm:text-4xl shadow-2xl text-black bg-white`} 
                                            >
                                                { isCorrect || revealAnswers ?  answer : <span className="font-bold">{index + 1}</span>}
                                            </button>
                                        )
                                    })
                                }                        
                            </div>
                        </>
                    }
                </div>
            }
        </>
    )
})

export default Game