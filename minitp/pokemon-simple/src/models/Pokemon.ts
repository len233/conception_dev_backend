import { Attack } from './Attack';

export class Pokemon {
    private _lifePoint: number;
    private _maxLifePoint: number;
    private _attacks: Attack[] = [];

    constructor(
        public readonly name: string,
        lifePoint: number
    ) {
        this._lifePoint = lifePoint;
        this._maxLifePoint = lifePoint;
    }

    get lifePoint(): number {
        return this._lifePoint;
    }

    get isAlive(): boolean {
        return this._lifePoint > 0;
    }

    get attacks(): Attack[] {
        return [...this._attacks];
    }

    learnAttack(attack: Attack): void {
        if (this._attacks.length >= 4) {
            throw new Error(`${this.name} ne peut apprendre que 4 attaques maximum`);
        }
        
        if (this._attacks.some(a => a.name === attack.name)) {
            throw new Error(`${this.name} connaît déjà ${attack.name}`);
        }
        
        this._attacks.push(attack);
    }

    heal(): void {
        this._lifePoint = this._maxLifePoint;
        this._attacks.forEach(attack => attack.reset());
    }

    takeDamage(damage: number): void {
        this._lifePoint = Math.max(0, this._lifePoint - damage);
    }

    attackRandomly(target: Pokemon): string {
        const usableAttacks = this._attacks.filter(attack => attack.canUse);
        
        if (usableAttacks.length === 0) {
            return `${this.name} n'a plus d'attaques disponibles!`;
        }

        const randomAttack = usableAttacks[Math.floor(Math.random() * usableAttacks.length)];
        const damage = randomAttack.use();
        target.takeDamage(damage);

        return `${this.name} utilise ${randomAttack.name} et inflige ${damage} dégâts à ${target.name}! ${target.name} a maintenant ${target.lifePoint} PV.`;
    }

    getInfo(): string {
        const attacksInfo = this._attacks.map(a => a.getInfo()).join(', ');
        return `${this.name} - PV: ${this._lifePoint}/${this._maxLifePoint} - Attaques: [${attacksInfo}]`;
    }
}
