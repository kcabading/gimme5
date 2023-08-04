import Timer from "@/components/game/Timer";

import { GiMagnifyingGlass } from "react-icons/gi";
import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

import { TGuessDetail } from "@/types/play";

type IGameProps = {
    selectedCategory: string,
    question: string,
    answers: string[],
    guesses: TGuessDetail[],
    handleInputChange: (e:React.KeyboardEvent<HTMLInputElement>) => void,
    handleHintOpen: (hint: number) => void,
}

const Game = forwardRef<HTMLInputElement, IGameProps>(({selectedCategory, question, answers, guesses, handleInputChange, handleHintOpen}: IGameProps, inputRef) => {

    return (
        <>
            <div className="gimme5-game text-center relative">
                <div className="flex justify-between items-center mb-5">
                    <p className="text-lg sm:text-2xl"><span className="font-bold mb-5">Category</span>: {selectedCategory}</p>
                    <Timer />
                </div>
                <div className="gimme5-question">
                    <p className="text-2xl sm:text-4xl">{question}</p>
                </div>
                <div className="input-answer my-4 sm:w-1/2 m-auto">
                    <Input ref={inputRef} type="text" className="text-2xl sm:text-4xl border-4 focus-visible:ring-0 p-8" placeholder="Start Typing..." onKeyUpCapture={ (e) => handleInputChange(e) }/>
                    <div className="hints flex items-center justify-center mt-3 text-2xl">
                        <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(1) }><GiMagnifyingGlass /></button>
                        <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(2) }><GiMagnifyingGlass /></button>
                        <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(3) }><GiMagnifyingGlass /></button>
                    </div>
                </div>
                <div className="grid grid-cols-8 gap-3 sm:gap-5">
                    {
                        answers.map( (answer, index) => {
                            
                            let isCorrect = guesses.map( r => r.guess).includes(answer.toLowerCase()) ? true : false
                            return (
                                <button
                                    key={index}
                                    className={`${index === 2 ? 'col-start-3' : ''} ${isCorrect ? 'border-green-300' : ''} col-span-4 px-5 py-5 border-4 font-bold rounded-2xl text-2xl sm:text-4xl shadow-2xl`} 
                                >
                                    { isCorrect ?  answer : <span className="font-bold">{index + 1}</span>}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
})

export default Game