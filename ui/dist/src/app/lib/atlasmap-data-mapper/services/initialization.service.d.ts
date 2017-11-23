import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ConfigModel } from '../models/config.model';
import { ErrorHandlerService } from './error.handler.service';
import { DocumentManagementService } from '../services/document.management.service';
import { MappingManagementService } from '../services/mapping.management.service';
export declare class InitializationService {
    private documentService;
    private mappingService;
    private errorService;
    cfg: ConfigModel;
    systemInitializedSource: Subject<void>;
    systemInitialized$: Observable<void>;
    initializationStatusChangedSource: Subject<void>;
    initializationStatusChanged$: Observable<void>;
    constructor(documentService: DocumentManagementService, mappingService: MappingManagementService, errorService: ErrorHandlerService);
    resetConfig(): void;
    initialize(): void;
    private fetchDocuments();
    private fetchMappings(mappingFiles);
    private fetchFieldActions();
    private updateStatus();
    private handleError(message, error);
    private updateLoadingStatus(status);
    static createExamplePom(): string;
    static createExampleMappingsJSON(): any;
}
