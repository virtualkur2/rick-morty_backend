import { CharacterStatus } from "../../domain/entities/RickAndMortyCharacter";
import { UserRole } from "../../domain/entities/User";
import { IFavoriteCharacterRepository } from "../../domain/repositories/IFavoriteCharacterRepository";
import { IRickAndMortyService, PagedResponse } from "../../domain/services/IRickAndMortyService";
import { RickAndMortyCharacterDto } from "../dto/RickAndMortyCharacter.dto";

export class GetRickAndMortyCharactersUseCase {
    constructor(
        private readonly rickAndMortyService: IRickAndMortyService,
        private readonly favoriteCharacterRepository: IFavoriteCharacterRepository
    ) {}

    async execute(
        userId?: string,
        userRole?: string,
        page?: number,
        name?: string,
        species?: string,
        status?: CharacterStatus,
    ): Promise<PagedResponse<RickAndMortyCharacterDto[]>> {
        const data = await this.rickAndMortyService.getCharacters(page, name, species, status);
       
        const userFavorites: Set<number> = new Set();

        if(userId) {
            const favorites = await this.favoriteCharacterRepository.findByUserId(userId);
            favorites.forEach(f => {
                userFavorites.add(f.characterId);
            });
        }

        const charactersDto: RickAndMortyCharacterDto[] = data.results.map(char => {
            const baseDto: RickAndMortyCharacterDto = {
                id: char.id,
                name: char.name,
                status: char.status,
                species: char.species,
                image: char.image,
                isFavorite: userId ? userFavorites.has(char.id) : false,
            };
            if(userRole === UserRole.ADMIN) {
                return {
                    ...baseDto,
                    type: char.type,
                    gender: char.gender,
                    origin: char.origin?.name ? {name: char.origin.name} : undefined,
                    created: char.created
                }
            }
            return baseDto;
        });

        return {
            info: data.info,
            results: charactersDto,
        }
    }
}