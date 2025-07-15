import { RickAndMortyCharacterDto } from "../../application/dto/RickAndMortyCharacter.dto";
import { RickAndMortyCharacter } from "../entities/RickAndMortyCharacter";

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
    getCharacters(page?: number, name?:string): Promise<PagedResponse<RickAndMortyCharacterDto[]>>;
    getCharacterById(id: number): Promise<RickAndMortyCharacter | null>;
}