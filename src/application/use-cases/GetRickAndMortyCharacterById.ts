import { IRickAndMortyService } from "../../domain/services/IRickAndMortyService";
import { RickAndMortyCharacterDto } from "../dto/RickAndMortyCharacter.dto";

export class GetRickAndMortyCharacterByIdUseCase {

    constructor(
        private readonly rickAndMortyService: IRickAndMortyService,
    ) {}

    async execute(id: number): Promise<RickAndMortyCharacterDto | null> {
        // TODO: add cache logic here
        const data = await this.rickAndMortyService.getCharacterById(id);
        if (!data) return null;
        const characterDto: RickAndMortyCharacterDto = {
            id: data.id,
            name: data.name,
            species: data.species,
            status: data.status,
            image: data.image
        };
        return characterDto;
    }
}