
import { StateCreator } from 'zustand'

export interface IPlaySlice {
    playState: 'SELECT' | 'PLAY'
    categories: string[],
    selectedCategory: string,
    setSelectedCategory: (category: string) => void,
    guesses: string[],
    setGuesses: (guess: string) => void,
}

const CATEGORIES = ['Tao', 'Bagay', 'Pagkain', 'Lugar', 'Pangyayari']

export const createPlaySlice: StateCreator<IPlaySlice> = (set) => ({
    categories: CATEGORIES,
    playState: 'SELECT',
    selectedCategory: '',
    setSelectedCategory: (category) => {
        set( () => ({ selectedCategory: category}))
        set(({ playState: 'PLAY'}))
    },
    guesses: [],
    setGuesses: (guess) => {
        set( (state) => ({ guesses: [...state.guesses, guess]}))
    },
})