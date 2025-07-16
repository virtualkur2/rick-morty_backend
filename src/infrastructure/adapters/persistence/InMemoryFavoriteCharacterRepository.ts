import { FavoriteCharacter } from "../../../domain/entities/FavoriteCharacter";
import { IFavoriteCharacterRepository } from "../../../domain/repositories/IFavoriteCharacterRepository";

export class InMemoryFavoriteCharacterRepository implements IFavoriteCharacterRepository {
    private favorites: FavoriteCharacter[] = [];

    async save(favorite: FavoriteCharacter): Promise<FavoriteCharacter> {
        const index = this.favorites.findIndex(f => f.id === favorite.id);
        if (index > -1) {
            this.favorites[index] = favorite;
        } else {
            this.favorites.push(favorite);
        }
        return favorite;
    }

    async findByUserId(userId: string): Promise<FavoriteCharacter[]> {
        return this.favorites.filter(f => f.userId === userId)
    }

    async findByUserIdAndCharacterId(userId: string, characterId: number): Promise<FavoriteCharacter | null> {
        return this.favorites.find(f => f.userId === userId && f.characterId === characterId) ?? null;
    }

    async delete(id: string): Promise<void> {
        const initialLength = this.favorites.length;
        this.favorites = this.favorites.filter(f => f.id !== id);
        if (this.favorites.length === initialLength) {
            console.warn('Deletion of non-existing favorite character');
        }
    }
}