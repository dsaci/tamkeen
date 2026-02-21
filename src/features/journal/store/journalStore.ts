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

export const useJournalStore = create<JournalState>()(
    persist(
        (set) => ({
            selectedDate: new Date().toISOString().split('T')[0],
            selectedLevel: null,
            selectedGrade: null,
            selectedClass: null,

            setSelectedDate: (date) => set({ selectedDate: date }),
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
