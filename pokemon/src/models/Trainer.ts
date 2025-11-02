import { Pokemon } from './Pokemon';

export class Trainer {
    private _level: number = 1;
    private _experience: number = 0;
    private _pokemons: Pokemon[] = [];

    constructor(public readonly name: string) {}

    get level(): number {
        return this._level;
    }

    get experience(): number {
        return this._experience;
    }

    get pokemons(): Pokemon[] {
        return [...this._pokemons];
    }

    get alivePokemons(): Pokemon[] {
        return this._pokemons.filter(p => p.isAlive);
    }

    addPokemon(pokemon: Pokemon): void {
        this._pokemons.push(pokemon);
    }

    healAllPokemons(): void {
        this._pokemons.forEach(pokemon => pokemon.heal());
    }

    gainExperience(amount: number): boolean {
        this._experience += amount;
        if (this._experience >= 10) {
            this._level++;
            this._experience = 0;
            return true; 
        }
        return false;
    }

    getRandomAlivePokemon(): Pokemon | null {
        const alive = this.alivePokemons;
        return alive.length > 0 ? alive[Math.floor(Math.random() * alive.length)] : null;
    }

    getPokemonWithMostHP(): Pokemon | null {
        const alive = this.alivePokemons;
        return alive.length > 0 ? alive.reduce((best, current) => 
            current.lifePoint > best.lifePoint ? current : best
        ) : null;
    }

    // DÉFI ALÉATOIRE
    randomChallenge(opponent: Trainer): { winner: Trainer | null; log: string[] } {
        const log: string[] = [];
        
        this.healAllPokemons();
        opponent.healAllPokemons();
        log.push(`${this.name} et ${opponent.name} soignent leurs Pokémon à la taverne.`);

        const myPokemon = this.getRandomAlivePokemon();
        const opponentPokemon = opponent.getRandomAlivePokemon();

        if (!myPokemon || !opponentPokemon) {
            log.push("Un dresseur n'a pas de Pokémon !");
            return { winner: null, log };
        }

        log.push(`${this.name} choisit ${myPokemon.name}, ${opponent.name} choisit ${opponentPokemon.name}`);

        let turn = 1;
        while (myPokemon.isAlive && opponentPokemon.isAlive && turn <= 50) {
            
            if (myPokemon.isAlive) {
                const attackLog = myPokemon.attackRandomly(opponentPokemon);
                log.push(`Tour ${turn}A: ${attackLog}`);
            }

            if (opponentPokemon.isAlive) {
                const attackLog = opponentPokemon.attackRandomly(myPokemon);
                log.push(`Tour ${turn}B: ${attackLog}`);
            }
            turn++;
        }

        const winner = myPokemon.isAlive ? this : (opponentPokemon.isAlive ? opponent : null);
        log.push(winner ? `${winner.name} remporte le combat !` : "Match nul !");
        
        return { winner, log };
    }

    // DÉFI DÉTERMINISTE
    deterministicChallenge(opponent: Trainer): { winner: Trainer | null; log: string[] } {
        const log: string[] = [];
        
        const myPokemon = this.getPokemonWithMostHP();
        const opponentPokemon = opponent.getPokemonWithMostHP();

        if (!myPokemon || !opponentPokemon) {
            log.push("Un dresseur n'a pas de Pokémon vivant !");
            return { winner: null, log };
        }

        log.push(`Combat déterministe: ${this.name}(${myPokemon.name}-${myPokemon.lifePoint}PV) vs ${opponent.name}(${opponentPokemon.name}-${opponentPokemon.lifePoint}PV)`);

        let turn = 1;
        while (myPokemon.isAlive && opponentPokemon.isAlive && turn <= 50) {
            if (myPokemon.isAlive) {
                const attackLog = myPokemon.attackRandomly(opponentPokemon);
                log.push(`Tour ${turn}A: ${attackLog}`);
            }

            if (opponentPokemon.isAlive) {
                const attackLog = opponentPokemon.attackRandomly(myPokemon);
                log.push(`Tour ${turn}B: ${attackLog}`);
            }
            turn++;
        }

        const winner = myPokemon.isAlive ? this : (opponentPokemon.isAlive ? opponent : null);
        log.push(winner ? `${winner.name} remporte le défi déterministe !` : "Match nul déterministe !");
        
        return { winner, log };
    }

    getInfo(): string {
        const pokemonList = this._pokemons.map(p => p.getInfo()).join('\n  ');
        return `Dresseur ${this.name} - Niveau: ${this._level} - Exp: ${this._experience}\nPokémon:\n  ${pokemonList}`;
    }
}
