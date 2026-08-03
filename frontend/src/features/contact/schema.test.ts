import { describe, expect, it } from 'vitest';
import { buildContactFormSchema } from './schema';

const t = ((key: string) => key) as Parameters<typeof buildContactFormSchema>[0];

describe('buildContactFormSchema', () => {
  const schema = buildContactFormSchema(t);

  const validValues = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'Hello, I would like to get in touch about a project.',
  };

  it('accepts valid values', () => {
    const result = schema.safeParse(validValues);
    expect(result.success).toBe(true);
  });

  it('rejects a name shorter than 2 characters', () => {
    const result = schema.safeParse({ ...validValues, name: 'A' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email address', () => {
    const result = schema.safeParse({ ...validValues, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects a message shorter than 10 characters', () => {
    const result = schema.safeParse({ ...validValues, message: 'too short' });
    expect(result.success).toBe(false);
  });

  it('rejects a message longer than 2000 characters', () => {
    const result = schema.safeParse({ ...validValues, message: 'a'.repeat(2001) });
    expect(result.success).toBe(false);
  });

  it('rejects a name longer than 100 characters', () => {
    const result = schema.safeParse({ ...validValues, name: 'a'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('accepts values exactly at the boundary lengths', () => {
    const result = schema.safeParse({
      ...validValues,
      name: 'ab',
      message: 'a'.repeat(10),
    });
    expect(result.success).toBe(true);
  });
});
