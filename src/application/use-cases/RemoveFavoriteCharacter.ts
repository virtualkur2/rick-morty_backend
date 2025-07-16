import { IFavoriteCharacterRepository } from "../../domain/repositories/IFavoriteCharacterRepository";

export class RemoveFavoriteCharacterUseCase {
    constructor(
        private readonly favoriteCharacterRepository: IFavoriteCharacterRepository
    ) {}

    async execute(userId: string, favoriteId: string): Promise<void> {
        const userFavorites = await this.favoriteCharacterRepository.findByUserId(userId);
        if (!userFavorites.map(f => f.id).includes(favoriteId)) {
            throw new Error('Favorite not found or not authorized to delete!');
        }
        return this.favoriteCharacterRepository.delete(favoriteId);
    }
}