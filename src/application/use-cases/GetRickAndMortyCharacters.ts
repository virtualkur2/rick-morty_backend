import { IFavoriteCharacterRepository } from "../../domain/repositories/IFavoriteCharacterRepository";
import { IRickAndMortyService, PagedResponse } from "../../domain/services/IRickAndMortyService";
import { RickAndMortyCharacterDto } from "../dto/RickAndMortyCharacter.dto";

export class GetRickAndMortyCharactersUseCase {
    constructor(
        private readonly rickAndMortyService: IRickAndMortyService,
        private readonly favoriteCharacterRepository: IFavoriteCharacterRepository
    ) {}

    async execute(userId?: string, page?: number, name?: string): Promise<PagedResponse<RickAndMortyCharacterDto[]>> {
        // TODO: add cache logic here
        const data = await this.rickAndMortyService.getCharacters(page, name);
       
        const userFavorites: Map<number, boolean> = new Map();

        if(userId) {
            console.log({userId});
            const favorites = await this.favoriteCharacterRepository.findByUserId(userId);
            favorites.forEach(f => {
                console.log('adding favorite to map');
                userFavorites.set(f.characterId, true);
            });
        }

        const charactersDto: RickAndMortyCharacterDto[] = data.results.map(char => ({
            id: char.id,
            name: char.name,
            status: char.status,
            species: char.species,
            image: char.image,
            isFavorite: userId ? userFavorites.has(char.id) : false,
        }));
        
        return {
            info: data.info,
            results: charactersDto
        }
    }
}