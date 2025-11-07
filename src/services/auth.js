import usersSeed from '../data/users.json';

// Simple React-only auth service that uses a JSON seed and localStorage for persistence.
// NOTE: This is for demo/dev only — storing passwords in plaintext is insecure.

const USERS_KEY = 'users';
const TOKEN_KEY = 'token';
const CURRENT_USER_KEY = 'currentUser';

function loadUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse users from localStorage', e);
    }
  }
  // Clone seed so we don't accidentally mutate the imported object
  const seed = Array.isArray(usersSeed) ? JSON.parse(JSON.stringify(usersSeed)) : [];
  localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  return seed;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function makeToken(userId) {
  // Fake token for demo purposes
  return `fake-jwt-token-${userId}-${Date.now()}`;
}

export const auth = {
  fetchUsers: () => {
    const users = loadUsers();
    return Promise.resolve({ data: users });
  },

  register: ({ username, email, password, name }) => {
    return new Promise((resolve, reject) => {
      const users = loadUsers();
      const exists = users.find(u => u.username.toLowerCase() === (username || '').toLowerCase() || (u.email && u.email.toLowerCase() === (email || '').toLowerCase()));
      if (exists) {
        // mimic axios error shape
        return reject({ response: { data: { message: 'Username or email already taken.' } } });
      }

      const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const newUser = {
        id,
        username,
        email,
        name,
        password, // WARNING: plaintext for demo only
        role: 'USER',
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      saveUsers(users);

      const token = makeToken(id);
      // also persist token/currentUser to localStorage for convenience
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      resolve({ data: { token, user: newUser } });
    });
  },

  login: ({ username, password }) => {
    return new Promise((resolve, reject) => {
      const users = loadUsers();
      const user = users.find(u => (u.username.toLowerCase() === (username || '').toLowerCase() || u.email?.toLowerCase() === (username || '').toLowerCase()) && u.password === password);
      if (!user) {
        return reject({ response: { data: { message: 'Invalid username or password.' } } });
      }

      const token = makeToken(user.id);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      resolve({ data: { token, user } });
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    // keep the users list in localStorage
    return Promise.resolve();
  },

  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }
};

export default auth;
