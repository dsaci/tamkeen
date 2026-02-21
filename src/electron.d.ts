export interface SyncItem {
    id: number;
    table_name: string;
    record_id: string;
    operation: 'INSERT' | 'UPDATE' | 'DELETE';
    payload: string;
    created_at: string;
}

declare global {
    interface Window {
        electronAPI: {
            auth: {
                login: (email: string, password: string) => Promise<any>;
                register: (data: { email: string; password: string; fullName: string; metadata: any }) => Promise<any>;
                logout: () => Promise<void>;
                getSession: () => Promise<any>;
                updateProfile: (userId: string, metadata: any) => Promise<boolean>;
                getAllUsers: () => Promise<any[]>;
                isAdmin: (userId: string) => Promise<boolean>;
            };
            journal: {
                getDaily: (teacherId: string, date: string) => Promise<any>;
                addSession: (teacherId: string, date: string, session: any) => Promise<boolean>;
                updateSession: (sessionId: string, session: any) => Promise<boolean>;
                deleteSession: (sessionId: string) => Promise<boolean>;
                getTeacherJournals: (teacherId: string) => Promise<any[]>;
            };
            db: {
                query: (sql: string, params?: any[]) => Promise<any>;
            };
            admin: {
                importData: (data: any) => Promise<boolean>;
            };
            app: {
                getVersion: () => Promise<string>;
                getPath: (name: string) => Promise<string>;
            };
            sync: {
                getPending: () => Promise<SyncItem[]>;
                clearPending: (ids: number[]) => Promise<boolean>;
            };
            repository: {
                getWilayas: () => Promise<any[]>;
                getCurriculum: (yearId: string, streamId?: string) => Promise<any[]>;
            };
        };
    }
}
