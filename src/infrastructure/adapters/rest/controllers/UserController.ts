import { Request, Response } from "express";
import { GetAllUsersUseCase } from "../../../../application/use-cases/GetAllUsers";

export class UserController {
    constructor(
        private readonly getAllUsersUseCase: GetAllUsersUseCase
    ) {}

    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.getAllUsersUseCase.execute();
            return res.status(200).json(users);
        } catch (error: any) {
            console.error('Error retrieving all users:', error);
            return res.status(500).json({
                message: error.message ?? 'Failed to retrieve users'
            });
        }
    }
}