import { RickAndMortyCharacter } from "../../domain/entities/RickAndMortyCharacter";

export type RickAndMortyCharacterDto = RickAndMortyCharacter & { isFavorite: boolean };
