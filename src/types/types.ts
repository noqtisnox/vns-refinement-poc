export type SubmissionStatus = 'none' | 'submitted' | 'late' | 'graded';

export type FilterStatus = SubmissionStatus | 'all'; 

export type Student = {
    id: string;
    name: string;
    status: SubmissionStatus;
};

export type StudentDetails = {
    id: string;
    name: string;
    email: string;
    pfpUrl?: string; // Optional custom profile picture URL
    submissionStatus: SubmissionStatus;
    lastUpdated: string; // e.g., "2025-11-25 14:30"
    currentGrade: string; // e.g., "92/100" or "N/A"
}