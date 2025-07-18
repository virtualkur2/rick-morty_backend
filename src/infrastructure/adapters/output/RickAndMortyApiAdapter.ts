import axios from 'axios';
import { IRickAndMortyService, PagedResponse, Pagination } from "../../../domain/services/IRickAndMortyService";
import { CharacterStatus, RickAndMortyCharacter } from '../../../domain/entities/RickAndMortyCharacter';
import { RICK_AND_MORTY_API_BASE_URL } from '../../config/env';
export class RickAndMortyApiAdapter implements IRickAndMortyService {

    // TODO: handle API not available case

    private readonly apiUrl = RICK_AND_MORTY_API_BASE_URL;
    private readonly CHARACTER_PATH = 'character';

    async getCharacters(page?: number, name?: string, species?:string, status?: CharacterStatus): Promise<PagedResponse<RickAndMortyCharacter[]>> {
        try {
            const params: {page?: number, name?: string, species?: string, status?: string} = {};
            if(page) params.page = page;
            if(name) params.name = name;
            if(species) params.species = species;
            if(status) params.status = status;
            const response = await axios.get(`${this.apiUrl}/${this.CHARACTER_PATH}`, {params});
            
            const {info: _info, results} = response.data;

            const characters: RickAndMortyCharacter[] = results.map((char: any) => new RickAndMortyCharacter(
                char.id,
                char.name,
                char.status,
                char.species,
                char.image
            ));

            const info: Pagination = {
                count: _info.count,
                pages: _info.pages,
                page: page ?? 1,
            }

            return { info, results: characters };

        } catch (error) {
            if(axios.isAxiosError(error) && error.response?.status === 404) {
                return { info: { count: 0, pages: 0, page: page ?? 1 }, results: [] };
            }
            console.error('Error fetching Rick & Morty characters:', error);
            
            throw new Error('Failed to fetch Rick & Morty characters from external API.');
        }
    }

    async getCharacterById(id: number): Promise<RickAndMortyCharacter | null> {
        try {
            const response = await axios.get(`${this.apiUrl}/${this.CHARACTER_PATH}/${id}`);
            const character = response.data;
            return new RickAndMortyCharacter(
                character.id,
                character.name,
                character.status,
                character.species,
                character.image
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null; // Character not found
            }
            console.error(`Error fetching Rick & Morty character by ID ${id}:`, error);
            
            throw new Error(`Failed to fetch Rick & Morty character by ID ${id}.`);
        }
    }
}