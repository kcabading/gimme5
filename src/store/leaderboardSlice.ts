
import { StateCreator } from 'zustand'

export interface ILeaderboardSlice {
    leaders: string[],
}

export const createLeaderboardSlice:StateCreator<ILeaderboardSlice> = () => ({
    leaders: []
})