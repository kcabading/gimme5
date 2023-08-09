import Timer from "@/components/game/Timer";

import { GiMagnifyingGlass } from "react-icons/gi";
import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { TGuessDetail } from "@/types/play";
import { useBoundStore } from "@/store";
import { Button } from "@/components/ui/button";


import { Eye, Table } from "lucide-react"

import { PlayStatusEnum } from '@/types/play'



type IGameProps = {
    selectedCategory: string,
    question: string,
    answers: string[],
    guesses: TGuessDetail[],
    gameLoading: boolean,
    handleInputChange: (e:React.KeyboardEvent<HTMLInputElement>) => void,
    handleHintOpen: (hint: number) => void,
}

const Game = forwardRef<HTMLInputElement, IGameProps>(({selectedCategory, question, answers, gameLoading, guesses, handleInputChange, handleHintOpen}: IGameProps, inputRef) => {

    const timesUp = useBoundStore((state) => state.timesUp)
    const revealAnswers = useBoundStore((state) => state.revealAnswers)
    const setRevealAnswers = useBoundStore((state) => state.setRevealAnswers)
    const setPlayState = useBoundStore((state) => state.setPlayState)

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
                    <div className="flex justify-between items-center mb-5">
                        <p className="text-lg sm:text-2xl"><span className="font-bold mb-5">Category</span>: {selectedCategory}</p>
                        <Timer />
                    </div>
                    <div className="gimme5-question">
                        <p className="text-2xl sm:text-4xl">{question}</p>
                    </div>
                    {
                        timesUp 
                        ?
                        <div className='my-10 flex gap-4 justify-center'>
                            <Button onClick={setRevealAnswers} variant={"secondary"}>
                                <Eye className="mr-2 h-4 w-4"/>
                                Reveal Answers
                            </Button>
                            <Button variant={"secondary"} onClick={() => setPlayState(PlayStatusEnum.FINISHED)}>
                                <Table className="mr-2 h-4 w-4"/>
                                See Results
                            </Button>
                        </div>
                        :
                        <div className="input-answer my-4 sm:w-1/2 m-auto">
                            <Input ref={inputRef} type="text" className="text-2xl sm:text-4xl border-4 focus-visible:ring-0 sm:p-8 p-6" placeholder="Start Typing..." onKeyUpCapture={ (e) => handleInputChange(e) }/>
                            <div className="hints flex items-center justify-center mt-3 text-2xl">
                                <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(1) }><GiMagnifyingGlass /></button>
                                <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(2) }><GiMagnifyingGlass /></button>
                                <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(3) }><GiMagnifyingGlass /></button>
                            </div>
                        </div>
                    }
                    
                    <div className="grid grid-cols-8 gap-3 sm:gap-5">
                        {
                            answers.map( (answer, index) => {
                                
                                let isCorrect = guesses.map( r => r.guess).includes(answer.toLowerCase()) ? true : false
                                return (
                                    <button
                                        key={index}
                                        className={`${index === 2 ? 'col-start-3' : ''} ${isCorrect ? 'border-green-300' : ''} ${!isCorrect && revealAnswers ? 'border-yellow-300' : ''} col-span-4 px-5 py-5 border-4 font-bold rounded-2xl text-2xl sm:text-4xl shadow-2xl`} 
                                    >
                                        { isCorrect || revealAnswers ?  answer : <span className="font-bold">{index + 1}</span>}
                                    </button>
                                )
                            })
                        }                        
                    </div>
                </div>
            }
        </>
    )
})

export default Game