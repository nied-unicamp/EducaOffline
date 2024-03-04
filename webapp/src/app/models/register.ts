export interface RegisterStart {
    email: string;
    name: string;
    password: string;
    language: string;
}

export interface RegisterFinish {
    email: string;
    hash: string;
    language: string;
}