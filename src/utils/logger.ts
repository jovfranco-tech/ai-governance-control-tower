/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StructuredLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  category: 'AUTH' | 'DATABASE' | 'AI' | 'BILLING' | 'RATE_LIMIT' | 'SYSTEM';
  message: string;
  tenantId?: string;
  userEmail?: string;
  metadata?: Record<string, any>;
}

type LogListener = (log: StructuredLog) => void;
const listeners = new Set<LogListener>();

class StructuredLogger {
  /**
   * Subscribe to log events for real-time visualization (e.g. in the Admin Console)
   */
  public subscribe(listener: LogListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  private emit(log: StructuredLog) {
    listeners.forEach(listener => {
      try {
        listener(log);
      } catch (err) {
        console.error('Error in log listener:', err);
      }
    });
  }

  private createLog(
    level: StructuredLog['level'],
    category: StructuredLog['category'],
    message: string,
    tenantId?: string,
    userEmail?: string,
    metadata?: Record<string, any>
  ): StructuredLog {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      tenantId: tenantId || 'anonymous-tenant',
      userEmail: userEmail || 'anonymous-user',
      metadata,
    };
  }

  private log(log: StructuredLog) {
    const formattedLog = `[${log.timestamp}] [${log.level}] [${log.category}] ${log.message} | Tenant: ${log.tenantId} | User: ${log.userEmail} ${log.metadata ? '| Meta: ' + JSON.stringify(log.metadata) : ''}`;
    
    // In development/test, we output cleanly
    if (log.level === 'CRITICAL' || log.level === 'ERROR') {
      console.error(formattedLog);
    } else if (log.level === 'WARN') {
      console.warn(formattedLog);
    } else {
      console.log(formattedLog);
    }

    this.emit(log);
  }

  public info(
    category: StructuredLog['category'],
    message: string,
    tenantId?: string,
    userEmail?: string,
    metadata?: Record<string, any>
  ) {
    this.log(this.createLog('INFO', category, message, tenantId, userEmail, metadata));
  }

  public warn(
    category: StructuredLog['category'],
    message: string,
    tenantId?: string,
    userEmail?: string,
    metadata?: Record<string, any>
  ) {
    this.log(this.createLog('WARN', category, message, tenantId, userEmail, metadata));
  }

  public error(
    category: StructuredLog['category'],
    message: string,
    tenantId?: string,
    userEmail?: string,
    metadata?: Record<string, any>
  ) {
    this.log(this.createLog('ERROR', category, message, tenantId, userEmail, metadata));
  }

  public critical(
    category: StructuredLog['category'],
    message: string,
    tenantId?: string,
    userEmail?: string,
    metadata?: Record<string, any>
  ) {
    this.log(this.createLog('CRITICAL', category, message, tenantId, userEmail, metadata));
  }
}

export const logger = new StructuredLogger();
