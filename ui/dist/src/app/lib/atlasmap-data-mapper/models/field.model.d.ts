import { DocumentDefinition } from './document.definition.model';
export declare class EnumValue {
    name: string;
    ordinal: number;
}
export declare class Field {
    name: string;
    classIdentifier: string;
    displayName: string;
    path: string;
    type: string;
    value: string;
    serviceObject: any;
    parentField: Field;
    partOfMapping: boolean;
    partOfTransformation: boolean;
    visibleInCurrentDocumentSearch: boolean;
    selected: boolean;
    enumeration: boolean;
    enumValues: EnumValue[];
    children: Field[];
    fieldDepth: number;
    uuid: string;
    collapsed: boolean;
    hasUnmappedChildren: boolean;
    isCollection: boolean;
    isArray: boolean;
    isAttribute: boolean;
    isPrimitive: boolean;
    userCreated: boolean;
    docDef: DocumentDefinition;
    namespaceAlias: string;
    private static uuidCounter;
    constructor();
    getNameWithNamespace(): string;
    isParentField(): boolean;
    isStringField(): boolean;
    isTerminal(): boolean;
    copy(): Field;
    copyFrom(that: Field): void;
    getCollectionParentField(): Field;
    isInCollection(): boolean;
    isSource(): boolean;
    getCollectionType(): string;
    getFieldLabel(includePath: boolean): string;
    isPropertyOrConstant(): boolean;
    isProperty(): boolean;
    isConstant(): boolean;
    static fieldHasUnmappedChild(field: Field): boolean;
    static getFieldPaths(fields: Field[]): string[];
    static getFieldNames(fields: Field[]): string[];
    static getField(fieldPath: string, fields: Field[]): Field;
    static alphabetizeFields(fields: Field[]): void;
}
