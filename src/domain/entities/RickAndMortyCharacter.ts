export enum CharacterStatus {
    ALIVE = 'Alive',
    DEAD = 'Dead',
    UNKNOWN = 'unknown',
}

export enum CharacterGender {
    FEMALE = 'Female',
    MALE = 'Male',
    GENDERLESS = 'Genderless',
    UNKNOWN = 'unknown',
}

export type CharacterOrigin = {
    name: string;
    url: string;
}

export class RickAndMortyCharacter {
    constructor(
        public id: number,
        public name: string,
        public status: CharacterStatus,
        public species: string,
        public image: string,
        // extended information only for admin's
        public type?: string,
        public gender?: CharacterGender,
        public origin?: CharacterOrigin,
        public created?: string
    ) {}

    static isValidStatus(value: any): value is CharacterStatus {
        return Object.values(CharacterStatus).includes(value);
    }

    static isFavoriteFilter(value: any): value is boolean {
        return typeof value === 'string' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false');
    }
}