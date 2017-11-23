import { ConfigModel } from '../models/config.model';
export declare class ErrorHandlerService {
    cfg: ConfigModel;
    debug(message: string, error: any): void;
    info(message: string, error: any): void;
    warn(message: string, error: any): void;
    error(message: string, error: any): void;
    validationError(message: string, error: any): void;
    removeError(identifier: string): void;
    clearValidationErrors(): void;
    private addError(message, level, error);
    private arrayDoesNotContainError(message);
    private addValidationError(message, error);
}
