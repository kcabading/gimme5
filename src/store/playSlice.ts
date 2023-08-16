
import { StateCreator } from 'zustand'
import { PlayStatusEnum, IPlaySlice, TGuessDetail } from '@/types/play'

import { saveGameResult } from '@/lib/api'

import { convertMSTimeToString, getCurrentUser, getGuestUsername } from '@/lib/utils'

const CATEGORIES = ['Tao', 'Bagay', 'Hayop', 'Pagkain', 'Lugar']

const initState = {
    categories: CATEGORIES,
    playState: PlayStatusEnum.SELECT,
    selectedCategory: '',
    question: { id: '', text: ''},
    answers: [],
    revealAnswers: false,
    gameLoading: false,
    noOfCorrectAnswer: 0,
    guesses: [],
    hints: [],
    hintText: '',
    hintOpen: false,
    timer: '',
    initialTime: 0,
    timerMS: 0,
    timesUp: false,
    timerAscending: false,
    timerIntervalRef: 0
}

export const createPlaySlice: StateCreator<IPlaySlice> = (set, get) => ({
    ...initState,
    setPlayState: (playState) => {
        switch (playState) {
            case PlayStatusEnum.FINISHED:
                console.log('FINISHED', get().guesses)
                // save game result
                get().saveGameResult(get().guesses)
                break;
            default:
                break;
        }

        set({playState: playState})
    },
    setSelectedQuestion: (question) => {
        set({question: { id: question.id, text: question.text }})
    },
    setGameLoading: (loading) => {
        set({gameLoading: loading})
    },
    saveGameResult: async (gameResult) => {
        console.log('saving game result', gameResult)
        gameResult.find((item: TGuessDetail) => item.isCorrect).time

        let completedTime = get().initialTime - get().timerMS
        let { timerString } = convertMSTimeToString(completedTime)
        // do we have username?
        let currentUser = await getCurrentUser()
        console.log('CURRENT USER: ', currentUser)
        let submittedBy = currentUser ? currentUser.username : getGuestUsername()

        let resultDetails = {
            userName: submittedBy,
            questionId : get().question.id,
            points: gameResult.filter( (item: TGuessDetail) => item.isCorrect).length,
            firstAnswerTime: gameResult.find((item: TGuessDetail) => item.isCorrect).time,
            completionTime: timerString,
            completionTimeInt: completedTime
        }

        saveGameResult(resultDetails)
    },
    setSelectedAnswers: (answers) => {
        set({answers: answers})
    },
    setRevealAnswers: () => {
        set( state => ( {revealAnswers: !state.revealAnswers} ))
    },
    setSelectedCategory: (category) => {
        set({ selectedCategory: category})
    },
    setGuesses: (guess, time, isCorrect) => {
        set( (state) => ({ guesses: [...state.guesses, { guess, time, isCorrect}]}))
    },
    setNoOfCorrectAnswer: () => {
        let noOfAnswers = get().answers.length
        let noOfCorrectAnswer = get().noOfCorrectAnswer + 1

        if (noOfAnswers === noOfCorrectAnswer) { 
            get().stopTimer()
            get().setPlayState(PlayStatusEnum.FINISHED)
        }

        set({ noOfCorrectAnswer })
    },
    resetPlay: () => {
        get().resetTimer()
        set(initState)
    },
    setHintText: (hint) => {
        set({hintText: hint})
    },
    setHintOpen: (toggle) => {
        set({hintOpen: toggle})
    },
    setTimerSetting: (initial, ascending) => {
        set({ 
            initialTime: initial * 100,
            timerMS: initial * 100,
            timerAscending: ascending
        })
    },
    startTimer: () => {
        let intervalId = window.setInterval(() => {
            if( get().playState === PlayStatusEnum.PLAY && get().timerMS === 0 ) {
                get().stopTimer()
                set({ timesUp: true })
                return
            } else {
                set( (state) => ({ timerMS: state.timerAscending ? state.timerMS + 1 : state.timerMS - 1 }))
            }
        }, 10)
        set({timerIntervalRef: intervalId})
    },
    stopTimer: () => {
        window.clearInterval(get().timerIntervalRef)
    },
    resetTimer: () => {
        window.clearInterval(get().timerIntervalRef)
        set({ 
            timerMS: get().timerMS,
            timerAscending: get().timerAscending
        })
    }
})