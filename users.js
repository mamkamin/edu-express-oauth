const path = require("node:path");
const fs = require("node:fs");

const usersFile = path.join(__dirname, "data", "users.json");

function loadUsers() {
    if (!fs.existsSync(usersFile)) {
        return [];
    }

    return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

function saveUsers(users) {
    fs.mkdirSync(path.dirname(usersFile), { recursive: true });
    fs.writeFileSync(usersFile, JSON.stringify(users, null , 2));
}

function findOrCreate(profile) {
    const users = loadUsers();
    let user = users.find((candidate) => candidate.googleId === profile.googleId);

    if (!user) {
        user = {
            id: crypto.randomUUID(),
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || null,
            photo: profile.photos?.[0]?.value || null,
            createdAt: new Date().toISOString()
        };
        users.push(user);
        saveUsers(users);
    }

    return user;
}

function findUserById(id) {
    return loadUsers().find((candidate) => candidate.id === id);
}

module.exports = {
    findOrCreate,
    findUserById
}