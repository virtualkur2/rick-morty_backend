import { StringValue } from 'ms';
import * as jwt from 'jsonwebtoken';
import { ITokenPayload, ITokenService } from "../../../domain/services/ITokenService";
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config/env';

export class JwtTokenService implements ITokenService {
    private readonly secretKey: string;
    private readonly expiresIn: StringValue;

    constructor() {
        this.secretKey = JWT_SECRET;
        this.expiresIn = JWT_EXPIRES_IN as StringValue;
        if (!this.secretKey || this.secretKey === 'your_jwt_secret_key_please_change_this_in_production') {
            console.warn('WARNING: JWT_SECRET is not set or is using a default. Please set a strong secret in your .env file!');
        }
    }

    generateToken(payload: ITokenPayload): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
    }

    verifyToken(token: string): ITokenPayload | null {
        try {
            return jwt.verify(token, this.secretKey) as ITokenPayload;
        } catch (error) {
            console.error('Token Service: JWT verification failed:', error);
            return null;
        }
    }
}