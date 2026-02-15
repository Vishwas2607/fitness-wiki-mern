export type ApiProps<T> = {
    link: string,
    method: string | undefined,
    data: null | T
};

export interface LoginResponse {
    message: string;
}

export interface LoginFormData {
    email: string,
    password: string
}

export interface RegisterResponse {
    message: string;
}