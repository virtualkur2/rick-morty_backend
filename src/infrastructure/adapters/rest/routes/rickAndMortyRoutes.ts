import { Router } from "express";
import { RickAndMortyController } from "../controllers/RickAndMortyController";

const rickAndMortyRoutes = (rickAndMortyController: RickAndMortyController): Router => {
    const router = Router();

    router.get('/characters', rickAndMortyController.getCharacters.bind(rickAndMortyController));
    router.get('/characters/:id', rickAndMortyController.getCharacterById.bind(rickAndMortyController));

    return router;
}

export default rickAndMortyRoutes;
