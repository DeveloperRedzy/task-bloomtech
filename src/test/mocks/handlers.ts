import { http, HttpResponse } from 'msw';
import { mockUser, mockWorkEntries, mockWorkStats } from '../fixtures';

const API_BASE_URL = 'http://localhost:3001/api';

export const handlers = [
  // Authentication handlers
  http.post(`${API_BASE_URL}/auth/login`, () => {
    return HttpResponse.json({
      user: mockUser,
      token: 'mock-jwt-token',
    });
  }),

  http.post(`${API_BASE_URL}/auth/register`, () => {
    return HttpResponse.json({
      user: mockUser,
      token: 'mock-jwt-token',
    });
  }),

  http.post(`${API_BASE_URL}/auth/refresh`, () => {
    return HttpResponse.json({
      token: 'mock-refreshed-jwt-token',
    });
  }),

  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  http.get(`${API_BASE_URL}/auth/profile`, () => {
    return HttpResponse.json({ user: mockUser });
  }),

  // Work entries handlers
  http.get(`${API_BASE_URL}/work-entries`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedEntries = mockWorkEntries.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedEntries,
      meta: {
        total: mockWorkEntries.length,
        page,
        limit,
        totalPages: Math.ceil(mockWorkEntries.length / limit),
      },
    });
  }),

  http.get(`${API_BASE_URL}/work-entries/:id`, ({ params }) => {
    const { id } = params;
    const entry = mockWorkEntries.find((entry) => entry.id === id);

    if (!entry) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(entry);
  }),

  http.post(`${API_BASE_URL}/work-entries`, async ({ request }) => {
    const newEntry = await request.json();
    const createdEntry = {
      id: `mock-${Date.now()}`,
      ...newEntry,
      userId: mockUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(createdEntry, { status: 201 });
  }),

  http.put(`${API_BASE_URL}/work-entries/:id`, async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    const entry = mockWorkEntries.find((entry) => entry.id === id);

    if (!entry) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedEntry = {
      ...entry,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(updatedEntry);
  }),

  http.delete(`${API_BASE_URL}/work-entries/:id`, ({ params }) => {
    const { id } = params;
    const entry = mockWorkEntries.find((entry) => entry.id === id);

    if (!entry) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ message: 'Work entry deleted successfully' });
  }),

  // Work stats handlers
  http.get(`${API_BASE_URL}/work-entries/stats`, () => {
    return HttpResponse.json(mockWorkStats);
  }),

  // Error simulation handlers for testing error states
  http.get(`${API_BASE_URL}/work-entries/error`, () => {
    return new HttpResponse(null, { status: 500 });
  }),

  http.post(`${API_BASE_URL}/auth/login/error`, () => {
    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),
];
