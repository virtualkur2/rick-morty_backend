import { NextFunction, Request, Response } from "express";
import { ITokenPayload, ITokenService } from "../../../../domain/services/ITokenService";

declare global {
    namespace Express {
        interface Request {
            user?: ITokenPayload;
        }
    }
}

export const authMiddleware = (tokenService: ITokenService) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'No token provided or invalid auth format'
            });
        }

        const token = authHeader.split(' ')[1];

        const payload = tokenService.verifyToken(token);

        if (!payload) {
            return res.status(403).json({
                message: 'Invalid or expired token.',
            });
        }

        req.user = payload;
        return next();
    }
}
