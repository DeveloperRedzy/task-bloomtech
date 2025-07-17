import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Define request handlers
const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      token: 'mock-token',
    });
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      token: 'mock-token',
    });
  }),

  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({ token: 'new-mock-token' });
  }),

  http.get('/api/auth/profile', () => {
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
    });
  }),

  // Work entries endpoints
  http.get('/api/work-entries', () => {
    return HttpResponse.json([]);
  }),

  http.post('/api/work-entries', () => {
    return HttpResponse.json({
      id: 1,
      title: 'Test Entry',
      date: '2024-01-01',
      startTime: '09:00',
      endTime: '17:00',
    });
  }),
];

// Create server instance
export const server = setupServer(...handlers);
