import { Field } from './field.model';
import { TransitionModel, FieldAction } from './transition.model';
import { ErrorInfo } from '../models/error.model';
export declare class MappedFieldParsingData {
    parsedName: string;
    parsedPath: string;
    parsedValue: string;
    parsedDocID: string;
    parsedDocURI: string;
    parsedIndex: string;
    fieldIsProperty: boolean;
    fieldIsConstant: boolean;
    parsedValueType: string;
    parsedActions: FieldAction[];
    userCreated: boolean;
}
export declare class MappedField {
    parsedData: MappedFieldParsingData;
    field: Field;
    actions: FieldAction[];
    updateSeparateOrCombineIndex(separateMode: boolean, combineMode: boolean, suggestedValue: string, isSource: boolean): void;
    removeSeparateOrCombineAction(): void;
    getSeparateOrCombineIndex(): string;
    removeAction(action: FieldAction): void;
    static sortMappedFieldsByPath(mappedFields: MappedField[], allowNone: boolean): MappedField[];
    isMapped(): boolean;
}
export declare class FieldMappingPair {
    sourceFields: MappedField[];
    targetFields: MappedField[];
    transition: TransitionModel;
    constructor();
    addField(field: Field, isSource: boolean): void;
    hasMappedField(isSource: boolean): boolean;
    isFullyMapped(): boolean;
    addMappedField(mappedField: MappedField, isSource: boolean): void;
    removeMappedField(mappedField: MappedField, isSource: boolean): void;
    getMappedFieldForField(field: Field, isSource: boolean): MappedField;
    getMappedFields(isSource: boolean): MappedField[];
    getLastMappedField(isSource: boolean): MappedField;
    getFields(isSource: boolean): Field[];
    getFieldNames(isSource: boolean): string[];
    getFieldPaths(isSource: boolean): string[];
    hasFieldActions(): boolean;
    getAllFields(): Field[];
    getAllMappedFields(): MappedField[];
    isFieldMapped(field: Field): boolean;
    hasTransition(): boolean;
    updateTransition(): void;
}
export declare class MappingModel {
    uuid: string;
    fieldMappings: FieldMappingPair[];
    currentFieldMapping: FieldMappingPair;
    validationErrors: ErrorInfo[];
    brandNewMapping: boolean;
    constructor();
    getFirstFieldMapping(): FieldMappingPair;
    getLastFieldMapping(): FieldMappingPair;
    getCurrentFieldMapping(): FieldMappingPair;
    addValidationError(message: string): void;
    clearValidationErrors(): void;
    getValidationErrors(): ErrorInfo[];
    getValidationWarnings(): ErrorInfo[];
    removeError(identifier: string): void;
    getFirstCollectionField(isSource: boolean): Field;
    isCollectionMode(): boolean;
    isLookupMode(): boolean;
    removeMappedPair(fieldPair: FieldMappingPair): void;
    getMappedFields(isSource: boolean): MappedField[];
    isFieldSelectable(field: Field): boolean;
    getFieldSelectionExclusionReason(field: Field): string;
    isFieldMapped(field: Field, isSource: boolean): boolean;
    getAllMappedFields(): MappedField[];
    getAllFields(): Field[];
    getFields(isSource: boolean): Field[];
    hasMappedFields(isSource: boolean): boolean;
    hasFullyMappedPair(): boolean;
}
