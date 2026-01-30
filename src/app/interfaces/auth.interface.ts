export interface Auth {
    id: number;
    email: string;
    password?: string;
    role: 'client' | 'advisor';
    userId: number; // Lien vers le profil user
}
