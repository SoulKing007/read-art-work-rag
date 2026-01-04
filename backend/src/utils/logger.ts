type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: unknown;
    error?: Error;
}

class Logger {
    private formatLog(entry: LogEntry): string {
        const { timestamp, level, message, data, error } = entry;

        if (process.env.NODE_ENV === 'production') {
            // JSON format for production
            return JSON.stringify({
                timestamp,
                level,
                message,
                ...(data && { data }),
                ...(error && { error: { message: error.message, stack: error.stack } }),
            });
        }

        // Human-readable format for development
        let log = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        if (data) {
            log += `\n  Data: ${JSON.stringify(data, null, 2)}`;
        }
        if (error) {
            log += `\n  Error: ${error.message}\n  Stack: ${error.stack}`;
        }
        return log;
    }

    private log(level: LogLevel, message: string, data?: unknown, error?: Error): void {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
            error,
        };

        const formatted = this.formatLog(entry);

        switch (level) {
            case 'debug':
                console.debug(formatted);
                break;
            case 'info':
                console.info(formatted);
                break;
            case 'warn':
                console.warn(formatted);
                break;
            case 'error':
                console.error(formatted);
                break;
        }
    }

    debug(message: string, data?: unknown): void {
        this.log('debug', message, data);
    }

    info(message: string, data?: unknown): void {
        this.log('info', message, data);
    }

    warn(message: string, data?: unknown): void {
        this.log('warn', message, data);
    }

    error(message: string, error?: Error, data?: unknown): void {
        this.log('error', message, data, error);
    }
}

export const logger = new Logger();
