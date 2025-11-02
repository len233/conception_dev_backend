export class Attack {
    private _usageCount: number = 0;

    constructor(
        public readonly name: string,
        public readonly damage: number,
        public readonly usageLimit: number
    ) {}

    get usageCount(): number {
        return this._usageCount;
    }

    get canUse(): boolean {
        return this._usageCount < this.usageLimit;
    }

    use(): number {
        if (!this.canUse) {
            throw new Error(`L'attaque ${this.name} ne peut plus être utilisée`);
        }
        this._usageCount++;
        return this.damage;
    }

    reset(): void {
        this._usageCount = 0;
    }

    getInfo(): string {
        return `${this.name} - Dégâts: ${this.damage} - Utilisations: ${this._usageCount}/${this.usageLimit}`;
    }
}
