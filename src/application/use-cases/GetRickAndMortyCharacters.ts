import { IRickAndMortyService, PagedResponse } from "../../domain/services/IRickAndMortyService";
import { RickAndMortyCharacterDto } from "../dto/RickAndMortyCharacter.dto";

export class GetRickAndMortyCharactersUseCase {
    constructor(
        private readonly rickAndMortyService: IRickAndMortyService,
    ) {}

    async execute(page?: number, name?: string): Promise<PagedResponse<RickAndMortyCharacterDto[]>> {
        // TODO: add cache logic here
        const data = await this.rickAndMortyService.getCharacters(page, name);

        const charactersDto: RickAndMortyCharacterDto[] = data.results.map(char => ({
            id: char.id,
            name: char.name,
            status: char.status,
            species: char.species,
            image: char.image,
        }));

        return {
            info: data.info,
            results: charactersDto
        }
    }
}