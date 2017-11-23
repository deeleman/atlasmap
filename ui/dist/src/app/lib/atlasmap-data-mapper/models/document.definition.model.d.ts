import { Field } from './field.model';
import { ConfigModel } from '../models/config.model';
import { MappingDefinition } from '../models/mapping.definition.model';
export declare class NamespaceModel {
    alias: string;
    uri: string;
    locationUri: string;
    createdByUser: boolean;
    isTarget: boolean;
    private static unqualifiedNamespace;
    static getUnqualifiedNamespace(): NamespaceModel;
    getPrettyLabel(): string;
    copy(): NamespaceModel;
    copyFrom(that: NamespaceModel): void;
}
export declare enum DocumentTypes {
    JAVA = 0,
    XML = 1,
    JSON = 2,
    CSV = 3,
    CONSTANT = 4,
    PROPERTY = 5,
}
export declare class DocumentType {
    type: DocumentTypes;
    isJava(): boolean;
    isXML(): boolean;
    isJSON(): boolean;
    isCSV(): boolean;
    isConstant(): boolean;
    isProperty(): boolean;
    isPropertyOrConstant(): boolean;
}
export declare class DocumentInitializationConfig {
    documentIdentifier: string;
    shortIdentifier: string;
    type: DocumentType;
    classPath: string;
    initialized: boolean;
    errorOccurred: boolean;
    pathSeparator: string;
    documentContents: string;
    inspectionResultContents: string;
    inspectionType: string;
}
export declare class DocumentDefinition {
    initCfg: DocumentInitializationConfig;
    name: string;
    fullyQualifiedName: string;
    fields: Field[];
    allFields: Field[];
    terminalFields: Field[];
    isSource: boolean;
    complexFieldsByClassIdentifier: {
        [key: string]: Field;
    };
    enumFieldsByClassIdentifier: {
        [key: string]: Field;
    };
    fieldsByPath: {
        [key: string]: Field;
    };
    uri: string;
    fieldPaths: string[];
    showFields: boolean;
    visibleInCurrentDocumentSearch: boolean;
    namespaces: NamespaceModel[];
    characterEncoding: string;
    locale: string;
    private static noneField;
    getComplexField(classIdentifier: string): Field;
    getEnumField(classIdentifier: string): Field;
    getAllFields(): Field[];
    static getNoneField(): Field;
    isFieldsExist(fields: Field[]): boolean;
    getFields(fieldPaths: string[]): Field[];
    getName(includeType: boolean): string;
    getNamespaceForAlias(alias: string): NamespaceModel;
    getField(fieldPath: string): Field;
    getTerminalFields(): Field[];
    clearSelectedFields(): void;
    getSelectedFields(): Field[];
    static selectFields(fields: Field[]): void;
    initializeFromFields(): void;
    updateField(field: Field, oldPath: string): void;
    addField(field: Field): void;
    populateChildren(field: Field): void;
    removeField(field: Field): void;
    updateFromMappings(mappingDefinition: MappingDefinition, cfg: ConfigModel): void;
    static getDocumentByIdentifier(documentIdentifier: string, docs: DocumentDefinition[]): DocumentDefinition;
    private populateFieldParentPaths(field, parentPath, depth);
    private populateFieldData(field);
    private prepareComplexFields();
    private discoverComplexFields(fields);
    private printDocumentFields(fields, indent);
}
