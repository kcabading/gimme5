import { create } from 'zustand'

import { createPlaySlice } from '@/store/playSlice'
import { IPlaySlice } from '@/types/play'
import { createLeaderboardSlice, ILeaderboardSlice } from '@/store/leaderboardSlice'

export const useBoundStore = create<IPlaySlice & ILeaderboardSlice>()((...a) => ({
    ...createPlaySlice(...a),
    ...createLeaderboardSlice(...a),
}))


// const useCounter = create<IGameStore>((set) => ({
//   counter: 0,
//   increaseCounter: () => set((state) => ({ counter: state.counter + 1 })),
// }))

// export default useCounter