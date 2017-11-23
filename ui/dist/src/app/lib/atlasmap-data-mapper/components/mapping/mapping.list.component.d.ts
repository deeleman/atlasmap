import { ConfigModel } from '../../models/config.model';
import { MappingModel, FieldMappingPair, MappedField } from '../../models/mapping.model';
export declare class MappingListFieldComponent {
    mappedField: MappedField;
    isSource: boolean;
    cfg: ConfigModel;
    getSourceIconCSSClass(): string;
    getFieldPath(): string;
    displayParentObject(): boolean;
    getParentObjectName(): string;
}
export declare class MappingListComponent {
    cfg: ConfigModel;
    searchMode: boolean;
    private searchFilter;
    private searchResults;
    getItemsCSSClass(): string;
    searchResultsVisible(): boolean;
    getMappingCSSClass(mapping: MappingModel, index: number): string;
    selectMapping(mapping: MappingModel): void;
    getRowTitleCSSClass(): string;
    getMappingRowsCSSClass(): string;
    getMappings(): MappingModel[];
    getMappedFields(fieldPair: FieldMappingPair, isSource: boolean): MappedField[];
    toggleSearch(): void;
    getSearchIconCSSClass(): string;
    fieldPairMatchesSearch(fieldPair: FieldMappingPair): boolean;
    private search(searchFilter);
}
