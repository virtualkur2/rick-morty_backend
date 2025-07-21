import { FavoriteCharacter } from "../../domain/entities/FavoriteCharacter";
import { IFavoriteCharacterRepository } from "../../domain/repositories/IFavoriteCharacterRepository";
import { IRickAndMortyService } from "../../domain/services/IRickAndMortyService";
import { RickAndMortyCharacterDto } from "../dto/RickAndMortyCharacter.dto";

export class GetRickAndMortyCharacterByIdUseCase {

    constructor(
        private readonly rickAndMortyService: IRickAndMortyService,
        private readonly favoriteCharacterRepository: IFavoriteCharacterRepository,
    ) {}

    async execute(id: number, userId?: string): Promise<RickAndMortyCharacterDto | null> {
        const data = await this.rickAndMortyService.getCharacterById(id);
        if (!data) return null;
        let favorite: FavoriteCharacter | null = null;
        if (userId) {
            favorite = await this.favoriteCharacterRepository.findByUserIdAndCharacterId(userId, id);
        }
        const characterDto: RickAndMortyCharacterDto = {
            id: data.id,
            name: data.name,
            species: data.species,
            status: data.status,
            image: data.image,
            favoriteId: favorite ? favorite.id : undefined,
        };
        return characterDto;
    }
}