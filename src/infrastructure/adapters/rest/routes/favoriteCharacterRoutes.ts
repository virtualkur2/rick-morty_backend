import { Router } from "express";
import { FavoriteCharacterController } from "../controllers/FavoriteCharacterController";

const favoriteCharacterRoutes = (favoriteCharacterController: FavoriteCharacterController): Router => {
    const router = Router();

    router.get('/', favoriteCharacterController.getFavorites.bind(favoriteCharacterController));
    router.post('/', favoriteCharacterController.addFavorite.bind(favoriteCharacterController));
    router.delete('/:id', favoriteCharacterController.removeFavorite.bind(favoriteCharacterController));

    return router;
}

export default favoriteCharacterRoutes;
