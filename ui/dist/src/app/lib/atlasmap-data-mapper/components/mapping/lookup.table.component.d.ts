import { ElementRef, QueryList } from '@angular/core';
import { LookupTable } from '../../models/lookup.table.model';
import { ConfigModel } from '../../models/config.model';
import { FieldMappingPair } from '../../models/mapping.model';
export declare class LookupTableData {
    sourceEnumValue: string;
    targetEnumValues: string[];
    selectedTargetEnumValue: string;
}
export declare class LookupTableComponent {
    fieldPair: FieldMappingPair;
    table: LookupTable;
    data: LookupTableData[];
    outputSelects: QueryList<ElementRef>;
    initialize(cfg: ConfigModel, fieldPair: FieldMappingPair): void;
    saveTable(): void;
}
