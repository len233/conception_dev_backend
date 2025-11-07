function calculateStockAfterMovement(currentStock: number, movementType: 'IN' | 'OUT', quantity: number): number {
  if (movementType === 'IN') {
    return currentStock + quantity;
  } else if (movementType === 'OUT') {
    const newStock = currentStock - quantity;
    return newStock < 0 ? 0 : newStock;
  }
  return currentStock;
}

function validateBinCode(binCode: string): boolean {
  const binCodeRegex = /^[A-Z]\d+-R\d+-L\d+-B\d{2,3}$/;
  return binCodeRegex.test(binCode);
}

function calculateAvailableCapacity(totalCapacity: number, usedCapacity: number): number {
  if (usedCapacity > totalCapacity) {
    return 0;
  }
  return totalCapacity - usedCapacity;
}

describe('Logique métier - Gestion des stocks', () => {
  describe('calculateStockAfterMovement', () => {
    test('devrait augmenter le stock pour un mouvement IN', () => {
      const result = calculateStockAfterMovement(10, 'IN', 5);
      expect(result).toBe(15);
    });

    test('devrait diminuer le stock pour un mouvement OUT', () => {
      const result = calculateStockAfterMovement(10, 'OUT', 3);
      expect(result).toBe(7);
    });

    test('ne devrait pas permettre un stock négatif', () => {
      const result = calculateStockAfterMovement(5, 'OUT', 10);
      expect(result).toBe(0);
    });
  });

  describe('validateBinCode', () => {
    test('devrait valider un code bin correct', () => {
      expect(validateBinCode('A1-R1-L1-B01')).toBe(true);
      expect(validateBinCode('Z99-R99-L99-B999')).toBe(true);
    });

    test('devrait rejeter un code bin incorrect', () => {
      expect(validateBinCode('A1-R1-L1')).toBe(false);
      expect(validateBinCode('a1-R1-L1-B01')).toBe(false);
      expect(validateBinCode('A1-r1-L1-B01')).toBe(false);
    });
  });

  describe('calculateAvailableCapacity', () => {
    test('devrait calculer la capacité disponible correctement', () => {
      const result = calculateAvailableCapacity(1000, 300);
      expect(result).toBe(700);
    });

    test('devrait retourner 0 si la capacité utilisée dépasse la totale', () => {
      const result = calculateAvailableCapacity(100, 150);
      expect(result).toBe(0);
    });
  });
});
