import { CharacterStatus, RickAndMortyCharacter } from "../entities/RickAndMortyCharacter";

export type PagedResponse<T> = {
    info: {
        count: number;
        pages: number;
        next: string | null;
        prev: string | null;
    },
    results: T;
}

export interface IRickAndMortyService {
    getCharacters(
        page?: number,
        name?: string,
        species?: string,
        status?: CharacterStatus,
    ): Promise<PagedResponse<RickAndMortyCharacter[]>>;
    getCharacterById(id: number): Promise<RickAndMortyCharacter | null>;
}