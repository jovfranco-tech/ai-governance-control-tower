import { describe, it, expect } from 'vitest';
import { logger, StructuredLog } from '../utils/logger';

describe('Structured Logger Unit Tests', () => {
  it('should format log objects correctly', () => {
    const logs: StructuredLog[] = [];
    const unsubscribe = logger.subscribe(log => {
      logs.push(log);
    });

    logger.info('AUTH', 'User JF logged in', 'tenant-enterprise', 'jf@enterprise.com', { test: true });

    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('INFO');
    expect(logs[0].category).toBe('AUTH');
    expect(logs[0].message).toBe('User JF logged in');
    expect(logs[0].tenantId).toBe('tenant-enterprise');
    expect(logs[0].userEmail).toBe('jf@enterprise.com');
    expect(logs[0].metadata).toEqual({ test: true });

    unsubscribe();
  });

  it('should support multiple distinct log levels', () => {
    const logs: StructuredLog[] = [];
    const unsubscribe = logger.subscribe(log => {
      logs.push(log);
    });

    logger.warn('RATE_LIMIT', 'Quota approaching', 'tenant-test', 'user@test.com');
    logger.error('DATABASE', 'RLS Violation blocked', 'tenant-test', 'user@test.com');
    logger.critical('SYSTEM', 'Core server crash simulated', 'tenant-test', 'user@test.com');

    expect(logs.length).toBe(3);
    expect(logs[0].level).toBe('WARN');
    expect(logs[1].level).toBe('ERROR');
    expect(logs[2].level).toBe('CRITICAL');

    unsubscribe();
  });

  it('should unsubscribe successfully', () => {
    const logs: StructuredLog[] = [];
    const unsubscribe = logger.subscribe(log => {
      logs.push(log);
    });

    logger.info('SYSTEM', 'Log entry 1');
    unsubscribe();
    logger.info('SYSTEM', 'Log entry 2');

    expect(logs.length).toBe(1);
    expect(logs[0].message).toBe('Log entry 1');
  });
});
