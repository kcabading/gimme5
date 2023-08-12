
import { StateCreator } from 'zustand'

export interface UserProfile {
    userName: string,
    email: string,
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
    email: '',
    isLoggedIn: false,
    isOnline: false,
    rank: 0,
    noOfGamesPlayed: 0,
    friends: []
}

export const createUserProfileSlice:StateCreator<IUserProfileSlice> = (set) => ({
    ...initState,
    updateProfile: (user) => {
        set(user)
    }
})