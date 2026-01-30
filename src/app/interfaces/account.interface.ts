export interface Account {
    id: number;
    userId: number;
    balance: number;
    type: 'CHECKING' | 'SAVINGS';
    rib: string;
}
