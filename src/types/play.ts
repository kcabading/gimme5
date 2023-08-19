export enum PlayStatusEnum {
    SELECT = "SELECT",
    PLAY = "PLAY",
    FINISHED = "FINISHED"
}

export type TQuestion = {
    id: string,
    text: string
}

export type Thint = {
    text: string,
    used: boolean
}

export type TGuessDetail = {
    guess: string,
    time: string,
    isCorrect: boolean
}

export type TGameResult = {
    userId: string,
    questionId: string,
    points: number,
    firstAnswerTime: string, 
    dateTaken: Date
}

export interface IPlaySlice {
    playState: PlayStatusEnum, // SELECT | PLAY | FINISHED
    question: TQuestion,
    guesses: TGuessDetail[],
    answers: string[],
    revealAnswers: boolean,
    gameLoading: boolean,
    noOfCorrectAnswer: number,
    hints: Thint[],
    hintText: string,
    hintOpen: boolean,
    errorMessage: string,
    // setPlayState: (state: string) => void,
    setPlayState: (playState:PlayStatusEnum) => void,
    setSelectedQuestion: (question: TQuestion) => void,
    setSelectedAnswers: (answers: string[]) => void,
    setRevealAnswers: () => void,
    setGameLoading: (loading: boolean) => void,
    saveGameResult: (gameResult: any) => void,
    setGuesses: (guess: string, isCorrect: boolean) => void,
    setNoOfCorrectAnswer: () => void,
    setHintText: (hint: string) => void,
    setHintOpen: (hint: boolean) => void,
    setTimesUp: (isTimeUp: boolean) => void,
    // CATEGORY STATES AND ACTIONS
    categories: string[],
    selectedCategory: string,
    setSelectedCategory: (category: string) => void,
    // TIMER STATES AND ACTIONS
    timer: string,
    initialTime: number,
    timerMS: number,
    timesUp: boolean,
    timerAscending: boolean,
    timerIntervalRef: number,
    setTimerSetting: (initial: number, ascending: boolean) => void,
    startTimer: () => void,
    stopTimer: () => void,
    resetTimer: () => void,
    //
    resetPlay: () => void,
    setErrorMessage: (error: string) => void
}