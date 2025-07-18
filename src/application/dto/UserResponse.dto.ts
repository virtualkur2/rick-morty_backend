import { User } from "../../domain/entities/User";

export type UserResponseDto = Omit<User, 'password'>;
