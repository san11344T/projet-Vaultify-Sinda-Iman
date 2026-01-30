export interface Transfer {
    id?: number;
    fromUserId: number;
    toUserId: number;
    amount: number;
    date: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    label: string;
}
