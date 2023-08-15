import { useEffect, useRef } from "react";
import { useBoundStore } from '@/store/index'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import CategorySelect from "@/components/game/CategorySelect";
import Game from "@/components/game/Game";
import Results from "@/components/game/Results";
import { convertMSTimeToString } from "@/lib/utils";
import { getQuestion } from "@/lib/api";
import { useSearchParams } from "react-router-dom";
import { PlayStatusEnum } from "@/types/play";

export default function Play() {
    const inputRef = useRef<HTMLInputElement>(null)

    const [searchParams] = useSearchParams();

    const playState = useBoundStore((state) => state.playState)
    const setPlayState = useBoundStore((state) => state.setPlayState)
    const playCategories= useBoundStore((state) => state.categories)

    const selectedCategory = useBoundStore((state) => state.selectedCategory)
    const setSelectedCategory = useBoundStore((state) => state.setSelectedCategory)

    const selectedQuestion = useBoundStore((state) => state.question)
    const setSelectedQuestion = useBoundStore((state) => state.setSelectedQuestion)
    const setSelectedAnswers = useBoundStore((state) => state.setSelectedAnswers)
    const gameLoading = useBoundStore((state) => state.gameLoading)
    const setGameLoading = useBoundStore((state) => state.setGameLoading)
    
    const answers = useBoundStore((state) => state.answers)

    const guesses = useBoundStore((state) => state.guesses)
    const setGuesses = useBoundStore((state) => state.setGuesses)
    const setNoOfCorrectAnswer = useBoundStore((state) => state.setNoOfCorrectAnswer)

    const hintText = useBoundStore((state) => state.hintText)
    const setHintText = useBoundStore((state) => state.setHintText)

    const hintOpen = useBoundStore((state) => state.hintOpen)
    const setHintOpen = useBoundStore((state) => state.setHintOpen)

    const timerMS = useBoundStore((state) => state.timerMS)
    const initialTime = useBoundStore((state) => state.initialTime)
    const timesUp = useBoundStore((state) => state.timesUp)
    const startTimer = useBoundStore((state) => state.startTimer)
    const setTimerSetting = useBoundStore((state) => state.setTimerSetting)
    
    const resetGameState = useBoundStore((state) => state.resetPlay)
    const gimme5hints = ['HINT# 1','HINT # 2', 'HINT # 3']

    const handleHintOpen = (hintNumber: number) => {
        setHintText(gimme5hints[hintNumber-1])
        setHintOpen(true)
    }

    const handleSetCategory = async (category: string, questionId?: string) => {
        let question
        setGameLoading(true)
        setPlayState(PlayStatusEnum.PLAY)
        // get question based on selected category and question id
        if (category || questionId) {
            question = await getQuestion(category, questionId)
        } else if (category) {
            question = await getQuestion(category)
        }

        if (question?.data) {
            setSelectedQuestion({id: question.data._id, text: question.data.question})
            setSelectedAnswers(question.data.answers)
            setSelectedCategory(question.data.category)
            setTimerSetting(60, false)
            startTimer()
            setTimeout( ()=> {
                inputRef.current?.focus()
            }, 500)
        }

        setGameLoading(false)
    }

    const handleInputChange = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(e.code === 'Enter') {
            if (inputRef.current !== null) {
                let guessedAnswer = (inputRef.current?.value).toLowerCase()
                if (!guesses.map(r => r.guess).includes(guessedAnswer)) {

                    let {timerString} = convertMSTimeToString(initialTime - timerMS)
                    
                    if (answers.map(answer => answer.toLowerCase()).includes(guessedAnswer)) {
                        inputRef.current?.classList.add('border-green-300')
                        setTimeout(() => {
                            inputRef.current?.classList.remove('border-green-300')
                        }, 2000);
                        setGuesses(guessedAnswer,timerString, true)
                        setNoOfCorrectAnswer()
                    } else {
                        inputRef.current?.classList.add('border-red-300')
                        setTimeout(() => {
                            inputRef.current?.classList.remove('border-red-300')
                        }, 2000);
                        setGuesses(guessedAnswer,timerString, false)
                    }
                }
                inputRef.current.value = ''
            }   
        }
    }

    useEffect(() => {
        resetGameState()
        console.log(searchParams)

        if (searchParams.has('questionId') || searchParams.has('category')) {
            let qQuestionId = searchParams.get('questionId') as string
            let qCategory = searchParams.get('category') as string
            
            if (qQuestionId || qCategory) {
                console.log('setting category')
                handleSetCategory(qCategory, qQuestionId)
            }
        }
        
        return () => {
            resetGameState()
        }
    }, [])
    
    return (
        <>
            <Dialog open={hintOpen} onOpenChange={setHintOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle className="text-2xl sm:text-4xl">HINT # </DialogTitle>
                    <DialogDescription className="text-2xl sm:text-4xl">
                        {hintText}
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <div className="w-full mb-10">
                {
                    playState === 'SELECT' 
                    &&
                    <CategorySelect categories={playCategories} handleCategorySelect={handleSetCategory} />
                }                
                {
                    ((playState === 'PLAY' && timesUp) || (playState === 'PLAY'))
                    &&
                    <Game
                        ref={inputRef}
                        selectedCategory={selectedCategory}
                        gameLoading={gameLoading}
                        question={selectedQuestion.text}
                        answers={answers}
                        guesses={guesses}
                        handleHintOpen={handleHintOpen}
                        handleInputChange={handleInputChange}
                    />
                }
                {
                    playState === 'FINISHED' && <Results />
                }
            </div>
        </>
    )
}