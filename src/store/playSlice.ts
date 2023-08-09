
import { StateCreator } from 'zustand'
import { PlayStatusEnum, IPlaySlice } from '@/types/play'

const CATEGORIES = ['Tao', 'Bagay', 'Hayop', 'Pagkain', 'Lugar']

const initState = {
    categories: CATEGORIES,
    playState: PlayStatusEnum.SELECT,
    selectedCategory: '',
    question: '',
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
        set({playState: playState})
    },
    setSelectedQuestion: (question) => {
        set({question: question})
    },
    setGameLoading: (loading) => {
        set({gameLoading: loading})
    },
    setSelectedAnswers: (answers) => {
        set({answers: answers})
    },
    setRevealAnswers: () => {
        set( state => ( {revealAnswers: !state.revealAnswers} ))
    },
    setSelectedCategory: (category) => {
        set({ selectedCategory: category})
        set({ playState: PlayStatusEnum.PLAY})
    },
    setGuesses: (guess, time) => {
        set( (state) => ({ guesses: [...state.guesses, { guess, time}]}))
    },
    setNoOfCorrectAnswer: () => {
        let noOfAnswers = get().answers.length
        let noOfCorrectAnswer = get().noOfCorrectAnswer + 1

        if (noOfAnswers === noOfCorrectAnswer) { 
            get().stopTimer()
        }

        set({ 
            noOfCorrectAnswer,
            // playState: noOfAnswers === noOfCorrectAnswer ? PlayStatusEnum.FINISHED : get().playState
        })
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
                // set({ playState: PlayStatusEnum.FINISHED })
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