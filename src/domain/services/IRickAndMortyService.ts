import { CharacterStatus, RickAndMortyCharacter } from "../entities/RickAndMortyCharacter";

export type Pagination = {
        count: number;
        pages: number;
        page: number;
}

export type PagedResponse<T> = {
    info: Pagination,
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