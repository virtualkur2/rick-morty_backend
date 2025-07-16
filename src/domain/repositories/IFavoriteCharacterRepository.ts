import { FavoriteCharacter } from "../entities/FavoriteCharacter";

export interface IFavoriteCharacterRepository {
    save(favorite: FavoriteCharacter): Promise<FavoriteCharacter>;
    findByUserId(userId: string): Promise<FavoriteCharacter[]>;
    findByUserIdAndCharacterId(userId: string, characterId: number): Promise<FavoriteCharacter | null>;
    delete(id: string): void;
}