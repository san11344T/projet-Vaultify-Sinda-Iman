export interface Advisor {
    id?: number;
    userId: number;
    type: 'LIVRET_A' | 'CLOSURE' | 'INSURANCE';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    date: string;
}
