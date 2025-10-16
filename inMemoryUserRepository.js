const bcrypt = require('bcrypt');

const registeredUsers = [
    { email: 'user1@example.com', password: 'password123', role: 'user' },
    { email: 'user2@example.com', password: 'motdepasse456', role: 'user' },
    { email: 'admin@company.com', password: 'admin2023', role: 'admin' }
];

const authenticatedUsers = {};

function getRegisteredUsers() {
    return registeredUsers;
}

function checkCredentials(email, password) {
    const user = registeredUsers.find(user => 
        user.email === email && user.password === password
    );
    return user ? true : false;
}

function addAuthenticatedUser(token, userEmail) {
    authenticatedUsers[token] = { email: userEmail };
}

function isTokenValid(token) {
    return authenticatedUsers.hasOwnProperty(token);
}

function getUserByToken(token) {
    return authenticatedUsers[token];
}

function userExists(email) {
    return registeredUsers.some(user => user.email === email);
}

async function newUserRegistered(email, password, role = 'user') {
    try {
        if (userExists(email)) {
            return { success: false, message: 'Un utilisateur avec cet email existe déjà' };
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            email: email,
            password: hashedPassword,
            role: role
        };

        registeredUsers.push(newUser);
        
        return { success: true, message: 'Utilisateur créé avec succès' };
    } catch (error) {
        return { success: false, message: 'Erreur lors de la création de l\'utilisateur' };
    }
}

async function checkCredentialsAsync(email, password) {
    const user = registeredUsers.find(user => user.email === email);
    
    if (!user) {
        return false;
    }

    if (user.password.startsWith('$2b$')) {
        return await bcrypt.compare(password, user.password);
    } else {
        return user.password === password;
    }
}

function getUserRole(email) {
    const user = registeredUsers.find(user => user.email === email);
    return user ? user.role : null;
}

module.exports = {
    getRegisteredUsers,
    checkCredentials,
    checkCredentialsAsync,
    addAuthenticatedUser,
    isTokenValid,
    getUserByToken,
    userExists,
    newUserRegistered,
    getUserRole,
    authenticatedUsers
};
