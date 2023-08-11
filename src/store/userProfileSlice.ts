
import { StateCreator } from 'zustand'

export interface UserProfile {
    userName: string,
    isLoggedIn?: boolean,
    isOnline?: boolean,
    rank?: number,
    noOfGamesPlayed?: number,
    friends?: string[]
}

export interface IUserProfileSlice extends UserProfile{
    updateProfile: (user:UserProfile) => void
}

const initState = {
    userName: '',
    isLoggedIn: false,
    isOnline: false,
    rank: 0,
    noOfGamesPlayed: 0,
    friends: []
}

export const createUserProfileSlice:StateCreator<IUserProfileSlice> = (set, get) => ({
    ...initState,
    updateProfile: (user) => {
        set(user)
    }
})