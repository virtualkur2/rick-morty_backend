import { RickAndMortyCharacter } from "../../domain/entities/RickAndMortyCharacter";
interface CharacterOriginDto {
    name: string;
}
export type RickAndMortyCharacterDto = Omit<RickAndMortyCharacter, 'origin'> & { favoriteId?: string, origin?: CharacterOriginDto };
