import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../../domain/entities/User";

export const authorizedRoles = (requiredRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user?.role) {
            return res.status(403).json({
                message: 'Authentication required for the requested resource.'
            });
        }

        const userRole = req.user.role;
        if (!requiredRoles.includes(userRole)) {
            return res.status(403).json({
                message: 'Acces dienied. You don\'t have enough privileges to access the requested resource'
            });
        }

        return next();
    }
}