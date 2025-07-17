import { describe, it, expect } from 'vitest';

describe('Testing Infrastructure', () => {
  it('should be properly configured', () => {
    expect(true).toBe(true);
  });

  it('should have access to DOM matchers', () => {
    const element = document.createElement('div');
    element.textContent = 'Hello World';
    expect(element).toBeInTheDocument;
  });

  it('should be able to import fixtures', async () => {
    const { mockUser } = await import('./fixtures');
    expect(mockUser).toBeDefined();
    expect(mockUser.email).toBe('test@bloomteq.com');
  });
});
