import { FavoriteCharacter } from "../../domain/entities/FavoriteCharacter";

export type FavoriteCharacterDto = Omit<FavoriteCharacter, 'userId' | 'id'> & { favoriteId: string }