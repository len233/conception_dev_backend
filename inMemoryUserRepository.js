// 1. Variable globale contenant les utilisateurs inscrits
const registeredUsers = [
    { email: 'user1@example.com', password: 'password123' },
    { email: 'user2@example.com', password: 'motdepasse456' },
    { email: 'admin@company.com', password: 'admin2023' }
];

// 4. Objet global vide pour stocker les utilisateurs authentifiés
// Clé: token, Valeur: objet contenant l'email
const authenticatedUsers = {};

// Fonction pour récupérer le tableau d'utilisateurs
function getRegisteredUsers() {
    return registeredUsers;
}

// 2. Fonction pour vérifier les identifiants (checkCredentials)
function checkCredentials(email, password) {
    const user = registeredUsers.find(user => 
        user.email === email && user.password === password
    );
    return user ? true : false;
}

// Fonction pour ajouter un utilisateur authentifié
function addAuthenticatedUser(token, userEmail) {
    authenticatedUsers[token] = { email: userEmail };
}

// Fonction pour vérifier si un token est valide
function isTokenValid(token) {
    return authenticatedUsers.hasOwnProperty(token);
}

// Fonction pour obtenir l'utilisateur par token
function getUserByToken(token) {
    return authenticatedUsers[token];
}

// Exporter les fonctions
module.exports = {
    getRegisteredUsers,
    checkCredentials,
    addAuthenticatedUser,
    isTokenValid,
    getUserByToken,
    authenticatedUsers
};
