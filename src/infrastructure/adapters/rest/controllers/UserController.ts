import { Request, Response } from "express";
import { GetAllUsersUseCase } from "../../../../application/use-cases/GetAllUsers";
import { GetUserFavoriteCharactersUseCase } from "../../../../application/use-cases/GetUserFavoriteCharacters";

export class UserController {
    constructor(
        private readonly getAllUsersUseCase: GetAllUsersUseCase,
        private readonly getUserFavoriteCharactersUseCase: GetUserFavoriteCharactersUseCase,
    ) {}

    async getAllUsers(_req: Request, res: Response): Promise<Response> {
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

    async getUserFavorites(req: Request, res: Response): Promise<Response> {
        const userIdToQuery = req.params.userId;
        if (!userIdToQuery) {
            return res.status(400).json({
                message: 'User ID is required'
            });
        }
        try {
            const favorites = await this.getUserFavoriteCharactersUseCase.execute(userIdToQuery);
            return res.status(200).json(favorites);
        } catch (error: any) {
            console.error(`Failed fetching user favorites for userId: ${userIdToQuery}. Error:`, error);
            return res.status(500).json({
                message: error.message ?? 'Failed to retrieve user favorites'
            });
        }
    }
}