import { CharacterStatus } from "../../domain/entities/RickAndMortyCharacter";
import { IFavoriteCharacterRepository } from "../../domain/repositories/IFavoriteCharacterRepository";
import { IRickAndMortyService, PagedResponse, Pagination } from "../../domain/services/IRickAndMortyService";
import { RICK_AND_MORTY_DEFAULT_PAGE_SIZE } from "../../infrastructure/config/env";
import { RickAndMortyCharacterDto } from "../dto/RickAndMortyCharacter.dto";

export class GetRickAndMortyCharactersUseCase {
    constructor(
        private readonly rickAndMortyService: IRickAndMortyService,
        private readonly favoriteCharacterRepository: IFavoriteCharacterRepository
    ) {}

    async execute(
        userId?: string,
        page?: number,
        name?: string,
        species?: string,
        status?: CharacterStatus,
        isFavoriteFilter?: boolean,
    ): Promise<PagedResponse<RickAndMortyCharacterDto[]>> {
        // TODO: add cache logic here
        const data = await this.rickAndMortyService.getCharacters(page, name, species, status);
       
        const userFavorites: Map<number, boolean> = new Map();

        if(userId) {
            const favorites = await this.favoriteCharacterRepository.findByUserId(userId);
            favorites.forEach(f => {
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

        const results = isFavoriteFilter !== undefined ? charactersDto.filter(c => c.isFavorite === isFavoriteFilter) : charactersDto;
        const info: Pagination = isFavoriteFilter !== undefined
            ? {count: results.length, pages: Math.ceil(results.length / RICK_AND_MORTY_DEFAULT_PAGE_SIZE), page: page ?? 1}
            : data.info; 
        return {
            info,
            results,
        }
    }
}