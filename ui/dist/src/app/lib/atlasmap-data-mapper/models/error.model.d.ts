export declare enum ErrorLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    VALIDATION_ERROR = 4,
}
export declare class ErrorInfo {
    readonly identifier: string;
    readonly message: string;
    readonly level: ErrorLevel;
    readonly error: any;
    private static errorIdentifierCounter;
    constructor(message: string, level: ErrorLevel, error?: any);
}
