import { IFavoriteCharacterRepository } from "../../domain/repositories/IFavoriteCharacterRepository";
import { FavoriteCharacterDto } from "../dto/FavoriteCharacter.dto";

export class GetUserFavoriteCharacters {
    constructor(
        private readonly favoriteCharacterRepository: IFavoriteCharacterRepository
    ) {}

    async execute(userId: string): Promise<FavoriteCharacterDto[]> {
        const favorites = await this.favoriteCharacterRepository.findByUserId(userId);

        return favorites.map(f => {
            const { userId: _, id, ...rest } = f;
            return {favoriteId: id, ...rest};
        });
    }
}