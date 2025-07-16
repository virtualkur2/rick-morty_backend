import { Request, Response } from "express";
import { AddFavoriteCharacterUseCase } from "../../../../application/use-cases/AddFavoriteCharacter";
import { GetUserFavoriteCharactersUseCase } from "../../../../application/use-cases/GetUserFavoriteCharacters";
import { RemoveFavoriteCharacterUseCase } from "../../../../application/use-cases/RemoveFavoriteCharacter";
import { AddFavoriteCharacterDto } from "../../../../application/dto/AddFavoriteCharacter.dto";

export class FavoriteCharacterController {
    constructor(
        private readonly addFavoriteCharacterUseCase: AddFavoriteCharacterUseCase,
        private readonly removeFavoriteCharacterUseCase: RemoveFavoriteCharacterUseCase,
        private readonly getUserFavoriteCharactersUseCase: GetUserFavoriteCharactersUseCase
    ) {}

    async addFavorite(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;

        if(!userId) {
            return res.status(401).json({
                message: 'User not authenticated!'
            });
        }

        const addFavoriteDto: AddFavoriteCharacterDto = req.body;

        try {
            const favorite = await this.addFavoriteCharacterUseCase.execute(userId, addFavoriteDto);
            return res.status(201).json(favorite);
        } catch (error: any) {
            console.error('Error adding favorite:', error);
            return res.status(400).json({
                message: error.message ?? 'Failed to add favorite character'
            });
        }
    }

    async removeFavorite(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;

        if(!userId) {
            return res.status(401).json({
                message: 'User not authenticated!'
            });
        }

        const { id } = req.params;

        try {
            await this.removeFavoriteCharacterUseCase.execute(userId, id);
            return res.status(204).send();
        } catch (error: any) {
            console.error('Error removing favorite:', error);
            return res.status(400).json({
                message: error.message ?? 'Failed to remove favorite character'
            });
        }

    }

    async getFavorites(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;

        if(!userId) {
            return res.status(401).json({
                message: 'User not authenticated!'
            });
        }        

        try {
            const favorites = await this.getUserFavoriteCharactersUseCase.execute(userId);
            return res.status(200).json(favorites);
        } catch (error: any) {
            console.error('Failed to retrieve user favorites:', error);
            return res.status(400).json({
                message: error.message ?? 'Failed to rerieve favorite characters'
            });
        }

    }

}