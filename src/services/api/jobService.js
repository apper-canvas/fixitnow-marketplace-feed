import { delay } from '../index';

let jobs = null;

const loadJobs = async () => {
  if (!jobs) {
    const { default: mockJobs } = await import('../mockData/jobs.json');
    jobs = [...mockJobs];
  }
  return jobs;
};

const jobService = {
  async getAll() {
    await delay(300);
    const allJobs = await loadJobs();
    return [...allJobs];
  },

  async getById(id) {
    await delay(200);
    const allJobs = await loadJobs();
    const job = allJobs.find(j => j.id === id);
    return job ? { ...job } : null;
  },

  async create(jobData) {
    await delay(400);
    const allJobs = await loadJobs();
    const newJob = {
      id: `job_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'accepted',
      paymentStatus: 'depositPaid',
      ...jobData
    };
    allJobs.push(newJob);
    return { ...newJob };
  },

  async update(id, updates) {
    await delay(300);
    const allJobs = await loadJobs();
    const index = allJobs.findIndex(j => j.id === id);
    if (index === -1) throw new Error('Job not found');
    
    allJobs[index] = { ...allJobs[index], ...updates };
    return { ...allJobs[index] };
  },

  async delete(id) {
    await delay(300);
    const allJobs = await loadJobs();
    const index = allJobs.findIndex(j => j.id === id);
    if (index === -1) throw new Error('Job not found');
    
    const deleted = allJobs.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default jobService;