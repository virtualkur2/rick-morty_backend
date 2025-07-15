import { Request, Response } from "express";
import { GetRickAndMortyCharactersUseCase } from "../../../../application/use-cases/GetRickAndMortyCharactersUseCase";
import { GetRickAndMortyCharacterByIdUseCase } from "../../../../application/use-cases/GetRickAndMortyCharacterByIdUseCase";

export class RickAndMortyController {
    constructor(
        private readonly getRickAndMortyCharactersUseCase: GetRickAndMortyCharactersUseCase,
        private readonly getRickAndMortyCharacterByIdUseCase: GetRickAndMortyCharacterByIdUseCase,
    ) {}

    async getCharacters(req: Request, res: Response): Promise<Response> {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : undefined;
            const name = req.query.name ? req.query.name as string : undefined;

            const data = await this.getRickAndMortyCharactersUseCase.execute(page, name);
            return res.status(200).json(data);
        } catch (error: any) {
            console.error('Error in RickAndMortyController.getCharacters:', error);
            return res.status(500).json({
                message: 'Failed to retrieve characters from Rick & Morty API',
                error: error.message
            });
        }
    }

    async getCharacterById(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if(isNaN(id)) {
                return res.status(400).json({
                    message: 'Invalid character ID'
                });
            }
            const character = await this.getRickAndMortyCharacterByIdUseCase.execute(id);
            if(!character) {
                return res.status(404).json({
                    message: 'Character not found!'
                });
            }
            return res.status(200).json(character);
        } catch (error: any) {
            console.error('Error in RickAndMortyController.getCharacterById:', error);
            return res.status(500).json({ message: 'Failed to retrieve character from Rick & Morty API', error: error.message });
        }
    }
}