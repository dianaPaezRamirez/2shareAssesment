import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { isSessionExpired, type Session } from '@/domain/auth/user'

interface SessionState {
  session: Session | null
  setSession: (session: Session) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: 'grocery-list-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => {
        if (state?.session && isSessionExpired(state.session)) {
          state.clearSession()
        }
      },
    },
  ),
)
