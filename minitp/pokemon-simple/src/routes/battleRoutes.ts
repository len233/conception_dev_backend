import { Router } from 'express';
import { BattleController } from '../controllers/BattleController';

const router = Router();

router.post('/random-challenge', BattleController.randomChallenge);
router.post('/deterministic-challenge', BattleController.deterministicChallenge);
router.post('/arena1', BattleController.arena1);
router.post('/arena2', BattleController.arena2);
router.get('/info', BattleController.createCustomBattle);

export default router;
