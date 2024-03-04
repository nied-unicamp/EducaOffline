export interface UserLogin {
    password: string;
    userEmail: string;
}

export interface UserPassword {
    oldPassword: string;
    newPassword: string;
}

export interface LoginToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

export interface UserForgotPasswordResponse extends UserPassword {
    key: string;
}

export interface UserForgotPasswordRequest {
    email: string;
}
