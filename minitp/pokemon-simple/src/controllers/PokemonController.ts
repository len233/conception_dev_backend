import { Request, Response } from 'express';
import { Pokemon } from '../models/Pokemon';
import { Attack } from '../models/Attack';

export class PokemonController {
    static createPokemon(req: Request, res: Response) {
        try {
            const { name, lifePoint } = req.body;
            
            if (!name || !lifePoint) {
                return res.status(400).json({ error: 'Nom et points de vie requis' });
            }

            const pokemon = new Pokemon(name, lifePoint);
            
            const attacks = [
                new Attack('Charge', 15, 10),
                new Attack('Griffe', 12, 15),
                new Attack('Morsure', 20, 8)
            ];

            attacks.forEach(attack => pokemon.learnAttack(attack));

            res.json({
                success: true,
                pokemon: {
                    name: pokemon.name,
                    lifePoint: pokemon.lifePoint,
                    attacks: pokemon.attacks.map(a => ({ 
                        name: a.name, 
                        damage: a.damage, 
                        usageLimit: a.usageLimit 
                    }))
                },
                message: `${name} créé avec succès !`
            });

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static healPokemon(req: Request, res: Response) {
        res.json({
            success: true,
            message: 'Fonction de soin disponible via les dresseurs'
        });
    }
}
