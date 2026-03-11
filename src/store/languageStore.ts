import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LanguageCode = 'en';

interface LanguageState {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    { name: 'language-store' }
  )
);
