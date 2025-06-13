import { delay } from '../index';

let users = null;

const loadUsers = async () => {
  if (!users) {
    const { default: mockUsers } = await import('../mockData/users.json');
    users = [...mockUsers];
  }
  return users;
};

const userService = {
  async getAll() {
    await delay(300);
    const allUsers = await loadUsers();
    return [...allUsers];
  },

  async getById(id) {
    await delay(200);
    const allUsers = await loadUsers();
    const user = allUsers.find(u => u.id === id);
    return user ? { ...user } : null;
  },

  async create(userData) {
    await delay(400);
    const allUsers = await loadUsers();
    const newUser = {
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: 0,
      completedJobs: 0,
      verificationStatus: {
        verified: false,
        backgroundCheck: false,
        licenseVerified: false
      },
      ...userData
    };
    allUsers.push(newUser);
    return { ...newUser };
  },

  async update(id, updates) {
    await delay(300);
    const allUsers = await loadUsers();
    const index = allUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    allUsers[index] = { ...allUsers[index], ...updates };
    return { ...allUsers[index] };
  },

  async delete(id) {
    await delay(300);
    const allUsers = await loadUsers();
    const index = allUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    const deleted = allUsers.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default userService;