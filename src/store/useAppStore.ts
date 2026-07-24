import { create } from 'zustand'

export interface UserState {
  name: string
  avatar: string
  level: string
  xp: number
  coins: number
  streak: number
  rank: string
  role: string
  achievements: string[]
  completedLessons: string[]
}

interface AppStore {
  user: UserState
  addXp: (amount: number, reason?: string) => void
  addCoins: (amount: number) => void
  completeLesson: (lessonId: string, xpReward: number) => void
  unlockAchievement: (achievementId: string) => void
  setUser: (user: Partial<UserState>) => void
  resetState: () => void
}

const initialState: UserState = {
  name: "John Doe",
  avatar: "/avatars/default.png",
  level: "B2 Intermediate",
  xp: 1450,
  coins: 350,
  streak: 12,
  rank: "Gold Learner",
  role: "student",
  achievements: ["first_lesson", "7_day_streak"],
  completedLessons: []
}

export const useAppStore = create<AppStore>((set) => ({
  user: initialState,

  addXp: (amount) => 
    set((state) => ({
      user: { ...state.user, xp: state.user.xp + amount }
    })),

  addCoins: (amount) =>
    set((state) => ({
      user: { ...state.user, coins: state.user.coins + amount }
    })),

  completeLesson: (lessonId, xpReward) =>
    set((state) => {
      if (state.user.completedLessons.includes(lessonId)) return state
      return {
        user: {
          ...state.user,
          xp: state.user.xp + xpReward,
          completedLessons: [...state.user.completedLessons, lessonId]
        }
      }
    }),

  unlockAchievement: (achievementId) =>
    set((state) => {
      if (state.user.achievements.includes(achievementId)) return state
      return {
        user: {
          ...state.user,
          achievements: [...state.user.achievements, achievementId]
        }
      }
    }),

  setUser: (userData) => 
    set((state) => ({
      user: { ...state.user, ...userData }
    })),

  resetState: () => set({ user: initialState })
}))
