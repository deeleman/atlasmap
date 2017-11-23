import { Observable } from 'rxjs/Observable';
import { ConfigModel } from '../../models/config.model';
import { FieldMappingPair, MappedField } from '../../models/mapping.model';
export declare class MappingFieldDetailComponent {
    cfg: ConfigModel;
    fieldPair: FieldMappingPair;
    isSource: boolean;
    mappedField: MappedField;
    dataSource: Observable<any>;
    constructor();
    getFieldPath(): string;
    getSourceIconCSSClass(): string;
    displayParentObject(): boolean;
    getParentObjectName(): string;
    selectionChanged(event: any): void;
    executeSearch(filter: string): any[];
}
