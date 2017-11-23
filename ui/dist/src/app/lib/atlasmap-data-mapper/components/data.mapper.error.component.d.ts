import { ErrorInfo } from '../models/error.model';
import { ErrorHandlerService } from '../services/error.handler.service';
export declare class DataMapperErrorComponent {
    errorService: ErrorHandlerService;
    isValidation: boolean;
    getErrors(): ErrorInfo[];
    getWarnings(): ErrorInfo[];
    handleClick(event: any): void;
}
