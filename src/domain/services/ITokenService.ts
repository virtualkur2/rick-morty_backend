export interface ITokenPayload {
    userId: string;
}

export interface ITokenService {
    generateToken(payload: ITokenPayload): string;
    verifyToken(token: string): ITokenPayload | null;
}