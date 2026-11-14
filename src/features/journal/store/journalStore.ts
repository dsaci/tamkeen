import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface JournalState {
    selectedDate: string;
    selectedLevel: string | null;
    selectedGrade: string | null;
    selectedClass: string | null;

    setSelectedDate: (date: string) => void;
    setSelectedLevel: (level: string | null) => void;
    setSelectedGrade: (grade: string | null) => void;
    setSelectedClass: (cls: string | null) => void;

    // Computed helpers could be here or in hooks, but let's keep state simple
    resetSelection: () => void;
}

const MIN_SCHOOL_DATE = '2026-09-21';

export const useJournalStore = create<JournalState>()(
    persist(
        (set) => ({
            selectedDate: (() => {
                const today = new Date().toISOString().split('T')[0];
                return today < MIN_SCHOOL_DATE ? MIN_SCHOOL_DATE : today;
            })(),
            selectedLevel: null,
            selectedGrade: null,
            selectedClass: null,

            setSelectedDate: (date) => set({ selectedDate: date < MIN_SCHOOL_DATE ? MIN_SCHOOL_DATE : date }),
            setSelectedLevel: (level) => set({ selectedLevel: level, selectedGrade: null, selectedClass: null }),
            setSelectedGrade: (grade) => set({ selectedGrade: grade, selectedClass: null }),
            setSelectedClass: (cls) => set({ selectedClass: cls }),

            resetSelection: () => set({ selectedLevel: null, selectedGrade: null, selectedClass: null }),
        }),
        {
            name: 'journal-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
