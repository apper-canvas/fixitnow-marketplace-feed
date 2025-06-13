export { default as taskService } from './api/taskService';
export { default as userService } from './api/userService';
export { default as quoteService } from './api/quoteService';
export { default as jobService } from './api/jobService';

// Utility function for simulating API delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));