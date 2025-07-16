import { FavoriteCharacter } from "../../domain/entities/FavoriteCharacter";
import { IFavoriteCharacterRepository } from "../../domain/repositories/IFavoriteCharacterRepository";
import { IRickAndMortyService } from "../../domain/services/IRickAndMortyService";
import { AddFavoriteCharacterDto } from "../dto/AddFavoriteCharacter.dto";
import { FavoriteCharacterDto } from "../dto/FavoriteCharacter.dto";

export class AddFavoriteCharacterUseCase {
    constructor(
        private readonly favoriteCharacterRepository: IFavoriteCharacterRepository,
        private readonly rickAndMortyService: IRickAndMortyService,
    ) {}

    async execute(userId: string, data: AddFavoriteCharacterDto): Promise<FavoriteCharacterDto> {
        if (!data.characterId) {
            throw new Error('Character ID is required!');
        }

        const existingFavorite = await this.favoriteCharacterRepository.findByUserIdAndCharacterId(userId, data.characterId);

        if(existingFavorite) {
            throw new Error('Character already favorited by this user!');
        }

        const characterDetails = await this.rickAndMortyService.getCharacterById(data.characterId);

        if (!characterDetails) {
            throw new Error('Rick & Morty character not found');
        }

        const favorite = FavoriteCharacter.fromRickAndMortyCharcater(userId, characterDetails);

        const savedFavorite = await this.favoriteCharacterRepository.save(favorite);

        const {userId: _, id, ...rest} = savedFavorite;

        return { favoriteId: id, ...rest};

    }
}