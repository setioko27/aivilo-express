export interface CreateUserDTO {
    email: string;
    password: string;
    name: string;
    roleId: number;
}

export interface UpdateUserDTO {
    email?: string;
    name?: string;
    roleId?: number;
}

export interface UserResponse {
    id: number;
    email: string;
    name: string;
    role: string;
}