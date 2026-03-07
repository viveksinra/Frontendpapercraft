import { describe, it, expect } from 'vitest';
import { v2, auth, testTaking, messages, catalog } from '../endpoints';

describe('shared endpoint constants', () => {
  it('exports a unified v2 object', () => {
    expect(v2).toBeDefined();
    expect(v2.auth).toBe(auth);
    expect(v2.testTaking).toBe(testTaking);
    expect(v2.messages).toBe(messages);
    expect(v2.catalog).toBe(catalog);
  });

  it('auth endpoints are correct string constants', () => {
    expect(auth.me).toBe('/api/v2/auth/me');
    expect(auth.login).toBe('/api/v2/auth/login');
    expect(auth.signup).toBe('/api/v2/auth/signup');
  });

  it('testTaking endpoints generate correct paths', () => {
    expect(testTaking.start('test-123')).toBe('/api/v2/tests/test-123/start');
    expect(testTaking.answer('test-123')).toBe('/api/v2/tests/test-123/answer');
    expect(testTaking.submit('test-123')).toBe('/api/v2/tests/test-123/submit');
    expect(testTaking.result('test-123')).toBe('/api/v2/tests/test-123/result');
    expect(testTaking.startSection('test-123', 0)).toBe('/api/v2/tests/test-123/section/0/start');
    expect(testTaking.sectionStatus('test-123', 2)).toBe('/api/v2/tests/test-123/section/2/status');
  });

  it('company-scoped endpoints include companyId', () => {
    expect(catalog.list('c1')).toBe('/api/v2/companies/c1/catalog');
    expect(catalog.detail('c1', 'prod-1')).toBe('/api/v2/companies/c1/catalog/prod-1');
    expect(messages.send('c1')).toBe('/api/v2/companies/c1/messages');
    expect(messages.conversations('c1')).toBe('/api/v2/companies/c1/messages/conversations');
  });
});
