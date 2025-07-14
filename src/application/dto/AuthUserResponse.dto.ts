import { User } from "../../domain/entities/User";

export interface AuthUserResponseDto {
    user: Omit<User, 'password'>;
    token: string;
}