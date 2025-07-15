import { User, UserRole } from "../../domain/entities/User";

export interface AuthUserResponseDto {
    user: Omit<User, 'password'> & {role: UserRole};
    token: string;
}