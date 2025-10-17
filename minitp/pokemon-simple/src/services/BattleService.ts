import { Trainer } from '../models/Trainer';

export class BattleService {
    
    static arena1(trainer1: Trainer, trainer2: Trainer): {
        winner: Trainer | null;
        stats: { trainer1Wins: number; trainer2Wins: number; draws: number };
        finalStats: { trainer1Level: number; trainer2Level: number };
        log: string[];
    } {
        const log: string[] = [];
        let trainer1Wins = 0;
        let trainer2Wins = 0;
        let draws = 0;

        log.push(`=== ARÈNE 1: 100 combats aléatoires ===`);
        log.push(`${trainer1.name} vs ${trainer2.name}`);

        for (let i = 1; i <= 100; i++) {
            const result = trainer1.randomChallenge(trainer2);
            
            if (result.winner === trainer1) {
                trainer1Wins++;
                const levelUp = trainer1.gainExperience(1);
                if (levelUp) log.push(`Combat ${i}: ${trainer1.name} gagne et passe niveau ${trainer1.level}!`);
            } else if (result.winner === trainer2) {
                trainer2Wins++;
                const levelUp = trainer2.gainExperience(1);
                if (levelUp) log.push(`Combat ${i}: ${trainer2.name} gagne et passe niveau ${trainer2.level}!`);
            } else {
                draws++;
            }
            
            if (i <= 5 || i > 95) {
                log.push(`Combat ${i}: Gagnant = ${result.winner?.name || 'Nul'}`);
            }
        }

        let winner: Trainer | null = null;
        if (trainer1.level > trainer2.level) {
            winner = trainer1;
        } else if (trainer2.level > trainer1.level) {
            winner = trainer2;
        } else if (trainer1.experience > trainer2.experience) {
            winner = trainer1;
        } else if (trainer2.experience > trainer1.experience) {
            winner = trainer2;
        }

        log.push(`\n=== RÉSULTATS ARÈNE 1 ===`);
        log.push(`${trainer1.name}: ${trainer1Wins} victoires, Niveau ${trainer1.level} (${trainer1.experience} exp)`);
        log.push(`${trainer2.name}: ${trainer2Wins} victoires, Niveau ${trainer2.level} (${trainer2.experience} exp)`);
        log.push(`Matchs nuls: ${draws}`);
        log.push(`GAGNANT ARÈNE 1: ${winner?.name || 'ÉGALITÉ'}`);

        return {
            winner,
            stats: { trainer1Wins, trainer2Wins, draws },
            finalStats: { trainer1Level: trainer1.level, trainer2Level: trainer2.level },
            log
        };
    }

    static arena2(trainer1: Trainer, trainer2: Trainer): {
        winner: Trainer | null;
        combatsCount: number;
        log: string[];
    } {
        const log: string[] = [];
        let combatsCount = 0;

        log.push(`=== ARÈNE 2: Combats déterministes jusqu'à épuisement ===`);

        for (let i = 1; i <= 100; i++) {
            combatsCount++;
            
            if (trainer1.alivePokemons.length === 0) {
                log.push(`${trainer1.name} n'a plus de Pokémon vivants! Arrêt après ${i-1} combats.`);
                return { winner: trainer2, combatsCount: i-1, log };
            }
            
            if (trainer2.alivePokemons.length === 0) {
                log.push(`${trainer2.name} n'a plus de Pokémon vivants! Arrêt après ${i-1} combats.`);
                return { winner: trainer1, combatsCount: i-1, log };
            }

            const result = trainer1.deterministicChallenge(trainer2);
            
            if (i <= 5 || i > 95) {
                log.push(`Combat ${i}: ${result.winner?.name || 'Nul'}`);
            }
        }

        const trainer1Alive = trainer1.alivePokemons.length;
        const trainer2Alive = trainer2.alivePokemons.length;
        
        let winner: Trainer | null = null;
        if (trainer1Alive > trainer2Alive) {
            winner = trainer1;
        } else if (trainer2Alive > trainer1Alive) {
            winner = trainer2;
        }

        log.push(`\n=== RÉSULTATS ARÈNE 2 ===`);
        log.push(`${trainer1.name}: ${trainer1Alive} Pokémon vivants`);
        log.push(`${trainer2.name}: ${trainer2Alive} Pokémon vivants`);
        log.push(`GAGNANT ARÈNE 2: ${winner?.name || 'ÉGALITÉ'}`);

        return { winner, combatsCount: 100, log };
    }
}
