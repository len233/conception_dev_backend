const { average, getMinimum } = require('./lib');

test('average calcule la moyenne', () => {
    const input1 = [11, -11, 10, 20];
    const expectedResult = 7.5;
    const actualResult = average(input1);
    
    expect(actualResult).toBe(expectedResult);
});

test('getMinimum retourne le minimum', () => {
    const input1 = [11, -11, 10, 20, 3, -5];
    const expectedResult = -11;
    const actualResult = getMinimum(input1);
    
    expect(actualResult).toBe(expectedResult);
});
