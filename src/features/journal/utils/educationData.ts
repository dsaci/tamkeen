export const EDUCATION_LEVELS = [
    { id: 'PRIMARY', label: 'الطور الابتدائي' },
    { id: 'MIDDLE', label: 'الطور المتوسط' },
    { id: 'SECONDARY', label: 'الطور الثانوي' },
];

export const GRADES = {
    PRIMARY: [
        { id: '1AP', label: 'السنة الأولى ابتدائي' },
        { id: '2AP', label: 'السنة الثانية ابتدائي' },
        { id: '3AP', label: 'السنة الثالثة ابتدائي' },
        { id: '4AP', label: 'السنة الرابعة ابتدائي' },
        { id: '5AP', label: 'السنة الخامسة ابتدائي' },
    ],
    MIDDLE: [
        { id: '1AM', label: 'السنة الأولى متوسط' },
        { id: '2AM', label: 'السنة الثانية متوسط' },
        { id: '3AM', label: 'السنة الثالثة متوسط' },
        { id: '4AM', label: 'السنة الرابعة متوسط' },
    ],
    SECONDARY: [
        { id: '1AS', label: 'السنة الأولى ثانوي' },
        { id: '2AS', label: 'السنة الثانية ثانوي' },
        { id: '3AS', label: 'السنة الثالثة ثانوي' },
    ],
};

export const GROUPS = [
    { id: 'G1', label: 'الفوج 1' },
    { id: 'G2', label: 'الفوج 2' },
    { id: 'G3', label: 'الفوج 3' },
    { id: 'G4', label: 'الفوج 4' }, // Just in case
];

// Helper to generate classes like 1AM1, 1AM2...
export const generateClasses = (gradeId: string) => {
    return Array.from({ length: 12 }, (_, i) => ({
        id: `${gradeId}${i + 1}`,
        label: `${gradeId}${i + 1}`
    }));
};
