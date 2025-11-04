// Fonction average qui calcule la moyenne d'une liste de valeurs
// Version corrigée
function average(values) {
    // Calcule correctement la moyenne
    return values.reduce((sum, val) => sum + val, 0) / values.length;
}

module.exports = { average };
