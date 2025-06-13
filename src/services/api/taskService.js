import { delay } from '../index';

let tasks = null;

const loadTasks = async () => {
  if (!tasks) {
    const { default: mockTasks } = await import('../mockData/tasks.json');
    tasks = [...mockTasks];
  }
  return tasks;
};

const taskService = {
  async getAll() {
    await delay(300);
    const allTasks = await loadTasks();
    return [...allTasks];
  },

  async getById(id) {
    await delay(200);
    const allTasks = await loadTasks();
    const task = allTasks.find(t => t.id === id);
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(400);
    const allTasks = await loadTasks();
    const newTask = {
      id: `task_${Date.now()}`,
      customerId: 'user_1', // Simulated current user
      createdAt: new Date().toISOString(),
      status: 'posted',
      ...taskData
    };
    allTasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(300);
    const allTasks = await loadTasks();
    const index = allTasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    allTasks[index] = { ...allTasks[index], ...updates };
    return { ...allTasks[index] };
  },

  async delete(id) {
    await delay(300);
    const allTasks = await loadTasks();
    const index = allTasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const deleted = allTasks.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default taskService;