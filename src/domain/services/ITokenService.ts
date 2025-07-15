import { UserRole } from "../entities/User";

export interface ITokenPayload {
    userId: string;
    role: UserRole;
}

export interface ITokenService {
    generateToken(payload: ITokenPayload): string;
    verifyToken(token: string): ITokenPayload | null;
}