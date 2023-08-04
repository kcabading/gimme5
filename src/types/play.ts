export enum PlayStatusEnum {
    SELECT = "SELECT",
    PLAY = "PLAY",
    FINISHED = "FINISHED"
}

export type Thint = {
    text: string,
    used: boolean
}

export type TGuessDetail = {
    guess: string,
    time: string
}

export interface IPlaySlice {
    playState: PlayStatusEnum, // SELECT | PLAY | FINISHED
    question: string,
    guesses: TGuessDetail[],
    answers: string[],
    noOfCorrectAnswer: number,
    hints: Thint[],
    hintText: string,
    hintOpen: boolean,
    // setPlayState: (state: string) => void,
    setSelectedQuestion: (question: string) => void,
    setGuesses: (guess: string, time: string) => void,
    setNoOfCorrectAnswer: () => void,
    setHintText: (hint: string) => void,
    setHintOpen: (hint: boolean) => void,
    // CATEGORY STATES AND ACTIONS
    categories: string[],
    selectedCategory: string,
    setSelectedCategory: (category: string) => void,
    // TIMER STATES AND ACTIONS
    timer: string,
    initialTime: number,
    timerMS: number,
    timerAscending: boolean,
    timerIntervalRef: number,
    setTimerSetting: (initial: number, ascending: boolean) => void,
    startTimer: () => void,
    stopTimer: () => void,
    resetTimer: () => void,
    //
    resetPlay: () => void,
}