import axios from 'axios';
import { IRickAndMortyService, PagedResponse, Pagination } from "../../../domain/services/IRickAndMortyService";
import { CharacterGender, CharacterStatus, RickAndMortyCharacter } from '../../../domain/entities/RickAndMortyCharacter';
import { MAX_CACHE_ENTRY_SIZE, RICK_AND_MORTY_API_BASE_URL } from '../../config/env';
import { LruCache } from '../../utils/LruCache';
import { normalizeUrl } from '../../utils/UrlUtils';


interface RickAndMortyApiInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

interface RickAndMortyApiCharacter {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender:	string;
    origin: {
        name: string;
        url: string;
    };
    location: {
        name: string;
        url: string;
    };
    image: string;
    episode: string[];
    url: string;
    created: string;
}
interface RickAndMortyApiResponse {
    info: RickAndMortyApiInfo;
    results: RickAndMortyApiCharacter[];
}
export class RickAndMortyApiAdapter implements IRickAndMortyService {

    // TODO: handle API not available case

    private readonly CHARACTER_PATH = 'character';
    private readonly baseUrl = `${RICK_AND_MORTY_API_BASE_URL}/${this.CHARACTER_PATH}`;
    private readonly paginatedCharacterCache: LruCache<string, RickAndMortyApiResponse>;
    private readonly singleCharacterCache: LruCache<string, RickAndMortyApiCharacter>;

    constructor() {
        this.paginatedCharacterCache = new LruCache<string, RickAndMortyApiResponse>(MAX_CACHE_ENTRY_SIZE);
        this.singleCharacterCache = new LruCache<string, RickAndMortyApiCharacter>(MAX_CACHE_ENTRY_SIZE);
        console.log(`Paginated character cache initialized with LRU Cache (max ${MAX_CACHE_ENTRY_SIZE} entries).`);
        console.log(`Single character cache initialized with LRU Cache (max ${MAX_CACHE_ENTRY_SIZE} entries).`);
    }

    async getCharacters(page?: number, name?: string, species?:string, status?: CharacterStatus): Promise<PagedResponse<RickAndMortyCharacter[]>> {
        try {
            const params: {page?: number, name?: string, species?: string, status?: string} = {};
            if(page) params.page = page;
            if(name) params.name = name.toLowerCase();
            if(species) params.species = species.toLowerCase();
            if(status) params.status = status;

            const cacheKey = normalizeUrl(this.baseUrl, params);

            const cachedData = this.paginatedCharacterCache.get(cacheKey);
            
            if(cachedData) {
                console.log('Cache entry FOUND for key:', cacheKey);
                return {
                    info: this.getPagination(cachedData.info, page),
                    results: cachedData.results.map(this.apiResponseToCharacter),
                };
            };
            console.log('Cache entry NOT found, getting data from external API...');
            const response = await axios.get<RickAndMortyApiResponse>(this.baseUrl, {params});
            const {data} = response;
            
            this.paginatedCharacterCache.set(cacheKey, data);
            console.log('Cache entry ADDED for key:', cacheKey);

            const info = this.getPagination(data.info, page);
            const results: RickAndMortyCharacter[] = data.results.map(this.apiResponseToCharacter);

            return { info, results };

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
            const characterByIdUrl = `${this.baseUrl}/${id}`;
            const cacheKey = normalizeUrl(characterByIdUrl);

            const cachedData = this.singleCharacterCache.get(cacheKey);
            
            if(cachedData) {
                return this.apiResponseToCharacter(cachedData);
            };

            const response = await axios.get<RickAndMortyApiCharacter>(characterByIdUrl);
            const { data } = response;

            this.singleCharacterCache.set(cacheKey, data);
            
            return this.apiResponseToCharacter(data);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null; // Character not found
            }
            console.error(`Error fetching Rick & Morty character by ID ${id}:`, error);
            
            throw new Error(`Failed to fetch Rick & Morty character by ID ${id}.`);
        }
    }

    private apiResponseToCharacter(apiResponse: RickAndMortyApiCharacter): RickAndMortyCharacter {
        return new RickAndMortyCharacter(
            apiResponse.id,
            apiResponse.name,
            apiResponse.status as CharacterStatus,
            apiResponse.species,
            apiResponse.image,
            // Extended fields
            apiResponse.type,
            apiResponse.gender as CharacterGender,
            apiResponse.origin,
            apiResponse.created
        );
    }

    private getPagination(info: RickAndMortyApiInfo, page?: number): Pagination {
        return {
            count: info.count,
            pages: info.pages,
            page: page ?? 1,
        }
    }
}