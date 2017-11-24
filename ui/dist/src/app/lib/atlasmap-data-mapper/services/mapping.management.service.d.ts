import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import { ConfigModel } from '../models/config.model';
import { Field } from '../models/field.model';
import { MappingModel, FieldMappingPair } from '../models/mapping.model';
import { FieldActionConfig } from '../models/transition.model';
import { MappingDefinition } from '../models/mapping.definition.model';
export declare class MappingManagementService {
    private http;
    cfg: ConfigModel;
    mappingUpdatedSource: Subject<void>;
    mappingUpdated$: Observable<void>;
    saveMappingSource: Subject<Function>;
    saveMappingOutput$: Observable<Function>;
    mappingSelectionRequiredSource: Subject<Field>;
    mappingSelectionRequired$: Observable<Field>;
    private headers;
    constructor(http: Http);
    initialize(): void;
    findMappingFiles(filter: string): Observable<string[]>;
    fetchMappings(mappingFileNames: string[], mappingDefinition: MappingDefinition): Observable<boolean>;
    saveCurrentMapping(): void;
    serializeMappingsToJSON(): any;
    saveMappingToService(): void;
    handleMappingSaveSuccess(saveHandler: Function): void;
    removeMapping(mappingModel: MappingModel): void;
    removeMappedPair(fieldPair: FieldMappingPair): void;
    addMappedPair(): FieldMappingPair;
    updateMappedField(fieldPair: FieldMappingPair): void;
    fieldSelected(field: Field): void;
    addNewMapping(selectedField: Field): void;
    selectMapping(mappingModel: MappingModel): void;
    deselectMapping(): void;
    validateMappings(): void;
    fetchFieldActions(): Observable<FieldActionConfig[]>;
    sortFieldActionConfigs(configs: FieldActionConfig[]): FieldActionConfig[];
    notifyMappingUpdated(): void;
    private handleError(message, error);
}