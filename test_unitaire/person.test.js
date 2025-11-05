const { Person, Wizard } = require('./person');

describe('Person', () => {
  test('constructor initialise le nom et les points de vie à 100', () => {
    const person = new Person('Len');
    
    expect(person.name).toBe('Len');
    expect(person.lifePoints).toBe(100);
  });

  test('hit réduit les points de vie de la cible de 10', () => {
    const attacker = new Person('Anna');
    const target = new Person('Annie');
    
    attacker.hit(target);
    
    expect(target.lifePoints).toBe(90);
    expect(attacker.lifePoints).toBe(100); 
  });

  test('hit peut être appelé plusieurs fois', () => {
    const attacker = new Person('Anna');
    const target = new Person('Annie');
    
    attacker.hit(target);
    attacker.hit(target);
    attacker.hit(target);
    
    expect(target.lifePoints).toBe(70);
  });

  test('isDead retourne false quand lifePoints > 0', () => {
    const person = new Person('Len');
    
    expect(person.isDead()).toBe(false);
    
    person.lifePoints = 1;
    expect(person.isDead()).toBe(false);
    
    person.lifePoints = 50;
    expect(person.isDead()).toBe(false);
  });

  test('isDead retourne true quand lifePoints <= 0', () => {
    const person = new Person('Len');
    
    person.lifePoints = 0;
    expect(person.isDead()).toBe(true);
    
    person.lifePoints = -10;
    expect(person.isDead()).toBe(true);
  });

  test('une personne peut mourir après plusieurs coups', () => {
    const attacker = new Person('Anna');
    const target = new Person('Annie');
    
    for (let i = 0; i < 10; i++) {
      attacker.hit(target);
    }
    
    expect(target.lifePoints).toBe(0);
    expect(target.isDead()).toBe(true);
  });
});

describe('Wizard', () => {
  test('constructor initialise le nom et les points de vie à 80', () => {
    const wizard = new Wizard('Gandalf');
    
    expect(wizard.name).toBe('Gandalf');
    expect(wizard.lifePoints).toBe(80);
  });

  test('Wizard hérite de Person', () => {
    const wizard = new Wizard('Merlin');
    
    expect(wizard instanceof Person).toBe(true);
    expect(wizard instanceof Wizard).toBe(true);
  });

  test('hit réduit les points de vie de la cible de 15', () => {
    const wizard = new Wizard('Gandalf');
    const target = new Person('Orc');
    
    const result = wizard.hit(target);
    
    expect(target.lifePoints).toBe(85);
    expect(result).toBe(target); 
  });

  test('hit de Wizard est plus puissant que hit de Person', () => {
    const person = new Person('Fighter');
    const wizard = new Wizard('Mage');
    const target1 = new Person('Enemy1');
    const target2 = new Person('Enemy2');
    
    person.hit(target1);
    wizard.hit(target2);

    expect(target1.lifePoints).toBe(90);
    expect(target2.lifePoints).toBe(85);
  });

  test('Wizard peut tuer plus rapidement qu\'une Person', () => {
    const wizard = new Wizard('DeathMage');
    const target = new Wizard('EnemyWizard'); 
    
    for (let i = 0; i < 5; i++) {
      wizard.hit(target);
    }

    expect(target.lifePoints).toBe(5);
    expect(target.isDead()).toBe(false);
    
    wizard.hit(target);

    expect(target.lifePoints).toBe(-10);
    expect(target.isDead()).toBe(true);
  });

  test('isDead fonctionne correctement pour Wizard', () => {
    const wizard = new Wizard('TestWizard');
    
    expect(wizard.isDead()).toBe(false);
    
    wizard.lifePoints = 0;
    expect(wizard.isDead()).toBe(true);
  });
});
