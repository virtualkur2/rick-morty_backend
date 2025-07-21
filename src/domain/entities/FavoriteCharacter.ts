import {v4 as uuidv4} from 'uuid';
import { RickAndMortyCharacter } from "./RickAndMortyCharacter";

export class FavoriteCharacter {
    constructor(
        public id: string,
        public userId: string,
        public characterId: number,
        public characterData: Omit<RickAndMortyCharacter, 'id'>,
        public addedAt: Date = new Date()
    ) {}

    public static fromRickAndMortyCharacter(userId: string, character: RickAndMortyCharacter): FavoriteCharacter {
        return new FavoriteCharacter(
            uuidv4(),
            userId,
            character.id,
            {
                name: character.name,
                image: character.image,
                species: character.species,
                status: character.status
            },
            new Date()
        );
    }
}