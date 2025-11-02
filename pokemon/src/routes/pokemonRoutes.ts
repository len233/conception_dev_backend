import { Router } from 'express';
import { PokemonController } from '../controllers/PokemonController';

const router = Router();

router.post('/create', PokemonController.createPokemon);
router.post('/heal', PokemonController.healPokemon);

export default router;
