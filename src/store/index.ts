import { create } from 'zustand'

import { createPlaySlice } from '@/store/playSlice'
import { IPlaySlice } from '@/types/play'
import { createLeaderboardSlice, ILeaderboardSlice } from '@/store/leaderboardSlice'
import { createUserProfileSlice, IUserProfileSlice } from './userProfileSlice'

export const useBoundStore = create<IPlaySlice & ILeaderboardSlice & IUserProfileSlice>()((...a) => ({
    ...createPlaySlice(...a),
    ...createLeaderboardSlice(...a),
    ...createUserProfileSlice(...a),
}))