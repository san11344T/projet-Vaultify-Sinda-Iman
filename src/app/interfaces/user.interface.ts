export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    category: 'student' | 'regular' | 'premium';
    balance: number;
    accountType: string;
    createdAt: string;
    offers: string[];
    verified: boolean;
    password: string;
}
