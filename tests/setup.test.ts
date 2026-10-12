import { describe, it, expect } from 'vitest';

describe('Environment Setup', () => {
  it('should have a working vitest environment with jest-dom matchers', () => {
    expect(true).toBe(true);
    const div = document.createElement('div');
    div.textContent = 'Hello';
    document.body.appendChild(div);
    expect(div).toBeInTheDocument();
  });
});
