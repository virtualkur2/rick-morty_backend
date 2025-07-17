export enum CharacterStatus {
    ALIVE = 'Alive',
    DEAD = 'Dead',
    UNKNOWN = 'unknown',
}

export class RickAndMortyCharacter {
    constructor(
        public id: number,
        public name: string,
        public status: CharacterStatus,
        public species: string,
        public image: string,
    ) {}

    static isValidStatus(value: any): value is CharacterStatus {
        return Object.values(CharacterStatus).includes(value);
    }

    static isFavoriteFilter(value: any): value is boolean {
        return typeof value === 'string' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false');
    }
}