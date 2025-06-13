import { delay } from '../index';

let quotes = null;

const loadQuotes = async () => {
  if (!quotes) {
    const { default: mockQuotes } = await import('../mockData/quotes.json');
    quotes = [...mockQuotes];
  }
  return quotes;
};

const quoteService = {
  async getAll() {
    await delay(300);
    const allQuotes = await loadQuotes();
    return [...allQuotes];
  },

  async getById(id) {
    await delay(200);
    const allQuotes = await loadQuotes();
    const quote = allQuotes.find(q => q.id === id);
    return quote ? { ...quote } : null;
  },

  async getByTaskId(taskId) {
    await delay(250);
    const allQuotes = await loadQuotes();
    return allQuotes.filter(q => q.taskId === taskId).map(q => ({ ...q }));
  },

  async create(quoteData) {
    await delay(400);
    const allQuotes = await loadQuotes();
    const newQuote = {
      id: `quote_${Date.now()}`,
      createdAt: new Date().toISOString(),
      accepted: false,
      ...quoteData
    };
    allQuotes.push(newQuote);
    return { ...newQuote };
  },

  async update(id, updates) {
    await delay(300);
    const allQuotes = await loadQuotes();
    const index = allQuotes.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quote not found');
    
    allQuotes[index] = { ...allQuotes[index], ...updates };
    return { ...allQuotes[index] };
  },

  async delete(id) {
    await delay(300);
    const allQuotes = await loadQuotes();
    const index = allQuotes.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quote not found');
    
    const deleted = allQuotes.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default quoteService;