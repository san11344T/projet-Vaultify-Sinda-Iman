export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    category: 'student' | 'regular';
    balance: number;
    accountType: string;
    createdAt: string;
    offers: string[];
    verified: boolean;
}
