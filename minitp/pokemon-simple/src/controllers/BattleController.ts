import { Request, Response } from 'express';
import { Trainer } from '../models/Trainer';
import { Pokemon } from '../models/Pokemon';
import { Attack } from '../models/Attack';
import { BattleService } from '../services/BattleService';

export class BattleController {
    
    static randomChallenge(req: Request, res: Response) {
        try {
            const trainer1 = new Trainer('Sacha');
            const trainer2 = new Trainer('Ondine');

            const pikachu = new Pokemon('Pikachu', 100);
            pikachu.learnAttack(new Attack('Éclair', 25, 8));
            pikachu.learnAttack(new Attack('Charge', 15, 12));
            trainer1.addPokemon(pikachu);

            const starmie = new Pokemon('Starmie', 90);
            starmie.learnAttack(new Attack('Hydrocanon', 30, 6));
            starmie.learnAttack(new Attack('Tornade', 20, 10));
            trainer2.addPokemon(starmie);

            const result = trainer1.randomChallenge(trainer2);

            res.json({
                success: true,
                battleType: 'Défi Aléatoire',
                winner: result.winner?.name || 'Match nul',
                log: result.log
            });

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static deterministicChallenge(req: Request, res: Response) {
        try {
            const trainer1 = new Trainer('Pierre');
            const trainer2 = new Trainer('Flora');

            const onix = new Pokemon('Onix', 120);
            onix.learnAttack(new Attack('Charge de Roc', 35, 5));
            onix.learnAttack(new Attack('Queue de Fer', 20, 8));
            
            onix.takeDamage(30); 
            trainer1.addPokemon(onix);

            const torterra = new Pokemon('Torterra', 110);
            torterra.learnAttack(new Attack('Séisme', 40, 4));
            torterra.learnAttack(new Attack('Fouet Lianes', 18, 12));
            
            torterra.takeDamage(20); 
            trainer2.addPokemon(torterra);

            const result = trainer1.deterministicChallenge(trainer2);

            res.json({
                success: true,
                battleType: 'Défi Déterministe',
                winner: result.winner?.name || 'Match nul',
                log: result.log
            });

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }


    static arena1(req: Request, res: Response) {
        try {
            const trainer1 = new Trainer('Champion Rouge');
            const trainer2 = new Trainer('Champion Bleu');

            const charizard = new Pokemon('Charizard', 150);
            charizard.learnAttack(new Attack('Lance-Flammes', 35, 6));
            charizard.learnAttack(new Attack('Vol', 25, 8));
            trainer1.addPokemon(charizard);

            const blastoise = new Pokemon('Blastoise', 140);
            blastoise.learnAttack(new Attack('Hydrocanon', 40, 5));
            blastoise.learnAttack(new Attack('Bulles d\'O', 20, 10));
            trainer1.addPokemon(blastoise);

   
            const venusaur = new Pokemon('Venusaur', 145);
            venusaur.learnAttack(new Attack('Lance-Soleil', 45, 4));
            venusaur.learnAttack(new Attack('Fouet Lianes', 18, 12));
            trainer2.addPokemon(venusaur);

            const alakazam = new Pokemon('Alakazam', 100);
            alakazam.learnAttack(new Attack('Psyko', 38, 5));
            alakazam.learnAttack(new Attack('Télékinésie', 22, 9));
            trainer2.addPokemon(alakazam);

            const result = BattleService.arena1(trainer1, trainer2);

            res.json({
                success: true,
                battleType: 'Arène 1 - 100 Combats Aléatoires',
                winner: result.winner?.name || 'Égalité',
                stats: result.stats,
                finalStats: result.finalStats,
                log: result.log.slice(0, 50) 
            });

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Arène 2 (combats déterministes jusqu'à épuisement)
    static arena2(req: Request, res: Response) {
        try {
            const trainer1 = new Trainer('Elite Lorelei');
            const trainer2 = new Trainer('Elite Bruno');

            // Équipe 1 (plusieurs Pokémon)
            const lapras = new Pokemon('Lapras', 180);
            lapras.learnAttack(new Attack('Surf', 30, 8));
            trainer1.addPokemon(lapras);

            const dewgong = new Pokemon('Dewgong', 120);
            dewgong.learnAttack(new Attack('Laser Glace', 25, 10));
            trainer1.addPokemon(dewgong);

            const cloyster = new Pokemon('Cloyster', 100);
            cloyster.learnAttack(new Attack('Picpic', 20, 12));
            trainer1.addPokemon(cloyster);

            // Équipe 2
            const machamp = new Pokemon('Machamp', 160);
            machamp.learnAttack(new Attack('Dynamopoing', 45, 4));
            trainer2.addPokemon(machamp);

            const hitmonlee = new Pokemon('Hitmonlee', 110);
            hitmonlee.learnAttack(new Attack('Pied Sauté', 35, 6));
            trainer2.addPokemon(hitmonlee);

            const result = BattleService.arena2(trainer1, trainer2);

            res.json({
                success: true,
                battleType: 'Arène 2 - Combats Déterministes',
                winner: result.winner?.name || 'Égalité',
                combatsCount: result.combatsCount,
                log: result.log.slice(0, 30) // Limiter les logs
            });

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Créer un combat personnalisé
    static createCustomBattle(req: Request, res: Response) {
        res.json({
            success: true,
            message: 'Les combats sont automatiquement générés avec des Pokémon de test',
            availableEndpoints: {
                randomChallenge: '/api/battles/random-challenge',
                deterministicChallenge: '/api/battles/deterministic-challenge', 
                arena1: '/api/battles/arena1',
                arena2: '/api/battles/arena2'
            }
        });
    }
}
