
import { StateCreator } from 'zustand'

type Thint = {
    text: string,
    used: boolean
}

export interface IPlaySlice {
    playState: string, // SELECT | PLAY | FINISHED
    categories: string[],
    selectedCategory: string,
    question: string,
    guesses: string[],
    hints: Thint[],
    hintText: string,
    hintOpen: boolean,
    setPlayState: (state: string) => void,
    setSelectedQuestion: (question: string) => void,
    setSelectedCategory: (category: string) => void,
    setGuesses: (guess: string) => void,
    setHintText: (hint: string) => void,
    setHintOpen: (hint: boolean) => void,
    resetPlay: () => void,   
}

const CATEGORIES = ['Tao', 'Bagay', 'Hayop', 'Pagkain', 'Lugar']

const initState = {
    categories: CATEGORIES,
    playState: 'SELECT',
    selectedCategory: '',
    question: '',
    guesses: [],
    hints: [],
    hintText: '',
    hintOpen: false
}

export const createPlaySlice: StateCreator<IPlaySlice> = (set) => ({
    ...initState,
    setPlayState: (state) => {
        set({playState: state})
    },
    setSelectedQuestion: (question) => {
        set({question: question})
    },
    setSelectedCategory: (category) => {
        set({ selectedCategory: category})
        set({ playState: 'PLAY'})
    },
    setGuesses: (guess) => {
        set( (state) => ({ guesses: [...state.guesses, guess]}))
    },
    resetPlay: () => {
        set(initState)
    },
    setHintText: (hint) => {
        set({hintText: hint})
    },
    setHintOpen: (toggle) => {
        set({hintOpen: toggle})
    }
})