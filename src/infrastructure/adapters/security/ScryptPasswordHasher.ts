import crypto from 'crypto';
import { IPasswordHashService } from "../../../domain/services/IPasswordHashService";

export class CryptoPasswordHasher implements IPasswordHashService {
    private readonly SCRYPT_CONFIG = {
        N: 65536,
        r: 8,
        p: 1,
        keylen: 64,
        saltBytes: 16
    }
    async hash(password: string): Promise<string> {
        const saltBuffer = crypto.randomBytes(this.SCRYPT_CONFIG.saltBytes);
        const salt = saltBuffer.toString('base64url');

        const hashedPaswwordBuffer = crypto.scryptSync(password, saltBuffer, this.SCRYPT_CONFIG.keylen, {
            N: this.SCRYPT_CONFIG.N,
            r: this.SCRYPT_CONFIG.r,
            p: this.SCRYPT_CONFIG.p
        });

        const hash = hashedPaswwordBuffer.toString('base64url');

        const logN = Math.log2(this.SCRYPT_CONFIG.N);
            if (logN % 1 !== 0) {
            throw new Error('Password hasher: Scrypt N parameter must be a power of 2.');
        }

        return `$scrypt$ln=${logN},r=${this.SCRYPT_CONFIG.r},p=${this.SCRYPT_CONFIG.p}$${salt}$${hash}`;
    }

    async compare(password: string, hash: string): Promise<boolean> {
        const hashParts = hash.split('$');
        
        // hashParts[0] is undefined since hash starts with $

        if (hashParts.length !== 4 || hashParts[1] !== 'scrypt') {
            console.error('Password hasher: Invalid hash format or not scrypt hash from our system');
            return false;
        }

        const paramsPart = hashParts[2];
        const storedSalt = hashParts[3];
        const storedHash = hashParts[4];
        
        const paramsRegex = /ln=(\d+),r=(\d+),p=(\d+)/;

        const match = paramsRegex.exec(paramsPart);

        if(!match) {
            console.error('Password hasher: Invalid parameters format');
            return false;
        }

        const N = Math.pow(2, parseInt(match[1], 10));
        const r = parseInt(match[2], 10);
        const p = parseInt(match[3], 10);

        const newHashedPasswordBuffer = crypto.scryptSync(
            password,
            Buffer.from(storedSalt, 'base64url'),
            Buffer.from(storedHash, 'base64url').length,
            {N, r, p}
        );

        const newHashedPassword = newHashedPasswordBuffer.toString('base64url');

        const newBuffer = Buffer.from(newHashedPassword, 'base64url');
        const storedBuffer = Buffer.from(storedHash, 'base64url');

        if(newBuffer.length !== storedBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(newBuffer, storedBuffer);
    }
}