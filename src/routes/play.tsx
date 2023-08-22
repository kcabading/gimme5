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

import { getQuestion } from "@/lib/api";
import { useSearchParams } from "react-router-dom";
import { PlayStatusEnum } from "@/types/play";

import useAudio from '@/hooks/useAudio';
import correctSound from '@/assets/sounds/correct.mp3'
import incorrectSound from '@/assets/sounds/incorrect.mp3'
import timesupSound from '@/assets/sounds/timeout.mp3'

export default function Play() {

    const inputRef = useRef<HTMLInputElement>(null)

    const [searchParams] = useSearchParams();

    const playState = useBoundStore((state) => state.playState)
    const setPlayState = useBoundStore((state) => state.setPlayState)
    const playCategories= useBoundStore((state) => state.categories)

    const setSelectedCategory = useBoundStore((state) => state.setSelectedCategory)

    const selectedQuestion = useBoundStore((state) => state.question)
    const setSelectedQuestion = useBoundStore((state) => state.setSelectedQuestion)
    const gameLoading = useBoundStore((state) => state.gameLoading)
    const setGameLoading = useBoundStore((state) => state.setGameLoading)

    const guesses = useBoundStore((state) => state.guesses)
    const setGuesses = useBoundStore((state) => state.setGuesses)
    const setNoOfCorrectAnswer = useBoundStore((state) => state.setNoOfCorrectAnswer)

    const hintText = useBoundStore((state) => state.hintText)
    const setHintText = useBoundStore((state) => state.setHintText)

    const hintOpen = useBoundStore((state) => state.hintOpen)
    const setHintOpen = useBoundStore((state) => state.setHintOpen)

    const timesUp = useBoundStore((state) => state.timesUp)

    const startTimer = useBoundStore((state) => state.startTimer)
    const setTimerSetting = useBoundStore((state) => state.setTimerSetting)

    const setErrorMessage = useBoundStore((state) => state.setErrorMessage)
    
    const resetGameState = useBoundStore((state) => state.resetPlay)
    const gimme5hints = ['HINT# 1','HINT # 2', 'HINT # 3']

    const correctAudio = useAudio(correctSound, { volume: 0.4, playbackRate: 1.2 });
    const incorrectAudio = useAudio(incorrectSound, { volume: 0.6, playbackRate: 1.2 });
    const timesUpAudio = useAudio(timesupSound, { volume: 0.4, playbackRate: 1.2 });

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
            question = await getQuestion({play: true,category, questionId})
        } else if (category) {
            question = await getQuestion({play: true,category})
        }

        if (question?.error) {
            setErrorMessage(question.error)
        }

        if (question?.data) {
            setSelectedQuestion(question.data)
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
                    if (selectedQuestion.answers.map(answer => answer.toLowerCase()).includes(guessedAnswer)) {
                        console.log('Correct answer')
                        correctAudio.play()
                        inputRef.current?.classList.add('border-green-300')
                        setTimeout(() => {
                            inputRef.current?.classList.remove('border-green-300')
                        }, 1000);
                        setGuesses(guessedAnswer, true)
                        setNoOfCorrectAnswer()
                    } else {
                        console.log('incorrect answer')
                        incorrectAudio.play()
                        inputRef.current?.classList.add('border-red-300')
                        setTimeout(() => {
                            inputRef.current?.classList.remove('border-red-300')
                        }, 1000);
                        setGuesses(guessedAnswer, false)
                    }
                } else {
                    console.log('incorrect answer!')
                    // same answer
                    incorrectAudio.play()
                    inputRef.current?.classList.add('border-red-300')
                    setTimeout(() => {
                        inputRef.current?.classList.remove('border-red-300')
                    }, 1000);
                }
                inputRef.current.value = ''
            }   
        }
    }

    useEffect(() => {
        resetGameState()
        if (searchParams.has('questionId') || searchParams.has('category')) {
            let qQuestionId = searchParams.get('questionId') as string
            let qCategory = searchParams.get('category') as string
            
            if (qQuestionId || qCategory) {
                handleSetCategory(qCategory, qQuestionId)
            }
        }
        
        return () => {
            resetGameState()
        }
    }, [])

    if (playState === 'FINISHED' && timesUp) {
        timesUpAudio.play()
    }
    
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
                    (timesUp || playState === 'PLAY')
                    &&
                    <Game
                        ref={inputRef}
                        gameLoading={gameLoading}
                        question={selectedQuestion}
                        guesses={guesses}
                        handleHintOpen={handleHintOpen}
                        handleInputChange={handleInputChange}
                    />
                }
                {
                    (!timesUp && playState === 'FINISHED') && <Results />
                }
            </div>
        </>
    )
}