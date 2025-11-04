const { average } = require('./lib');

test('average calcule la moyenne', () => {
    // Créer une liste input1 avec les valeurs 11, -11, 10, 20
    const input1 = [11, -11, 10, 20];
    
    // Calculer la sortie attendue : (11 + (-11) + 10 + 20) / 4 = 30 / 4 = 7.5
    const expectedResult = 7.5;
    
    // Appeler la fonction average et stocker le résultat
    const actualResult = average(input1);
    
    // Vérifier que expectedResult est égal à actualResult
    expect(actualResult).toBe(expectedResult);
});
