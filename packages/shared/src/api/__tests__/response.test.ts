import { describe, it, expect } from 'vitest';
import { unwrapEnvelope, enhanceError } from '../response';
import type { AxiosResponse, AxiosError } from 'axios';

function mockResponse(data: unknown): AxiosResponse {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosResponse['config'],
  };
}

describe('unwrapEnvelope', () => {
  it('merges myData into response.data when envelope format is present', () => {
    const res = mockResponse({
      variant: 'success',
      message: 'ok',
      myData: { users: [1, 2], total: 2 },
    });

    const result = unwrapEnvelope(res);

    expect(result.data.variant).toBe('success');
    expect(result.data.users).toEqual([1, 2]);
    expect(result.data.total).toBe(2);
  });

  it('passes through non-envelope responses unchanged', () => {
    const res = mockResponse({ foo: 'bar' });

    const result = unwrapEnvelope(res);

    expect(result.data).toEqual({ foo: 'bar' });
  });

  it('handles null data gracefully', () => {
    const res = mockResponse(null);

    const result = unwrapEnvelope(res);

    expect(result.data).toBeNull();
  });
});

describe('enhanceError', () => {
  it('extracts status code from response', async () => {
    const error = {
      response: { status: 404, data: { message: 'Not found' } },
      message: 'Request failed',
    } as AxiosError;

    await expect(enhanceError(error)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Not found',
    });
  });

  it('falls back to error.message when no response message', async () => {
    const error = {
      response: { status: 500, data: {} },
      message: 'Server error',
    } as AxiosError;

    await expect(enhanceError(error)).rejects.toMatchObject({
      statusCode: 500,
      message: 'Server error',
    });
  });
});
