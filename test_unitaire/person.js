class Person {
  constructor(name) {
    this.name = name;
    this.lifePoints = 100;
  }
  
  hit(person) {
    person.lifePoints -= 10;
  }
  
  isDead() {
    if (this.lifePoints > 0) {
      return false;
    }
    return true;
  }
}

class Wizard extends Person {
  constructor(name) {
    super(name);
    this.lifePoints = 80;
  }
  
  hit(person) {
    person.lifePoints -= 15;
    return person;
  }
}

module.exports = { Person, Wizard };
