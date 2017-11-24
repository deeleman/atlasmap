import { MappingDefinition } from './mapping.definition.model';
import { DocumentDefinition } from './document.definition.model';
import { Field } from '../models/field.model';
import { ErrorHandlerService } from '../services/error.handler.service';
import { DocumentManagementService } from '../services/document.management.service';
import { MappingManagementService } from '../services/mapping.management.service';
import { InitializationService } from '../services/initialization.service';
import { ErrorInfo } from '../models/error.model';
export declare class DataMapperInitializationModel {
    dataMapperVersion: string;
    initialized: boolean;
    loadingStatus: string;
    initializationErrorOccurred: boolean;
    baseJavaInspectionServiceUrl: string;
    baseXMLInspectionServiceUrl: string;
    baseJSONInspectionServiceUrl: string;
    baseMappingServiceUrl: string;
    classPathFetchTimeoutInMilliseconds: number;
    pomPayload: string;
    classPath: string;
    fieldNameBlacklist: string[];
    classNameBlacklist: string[];
    disablePrivateOnlyFields: boolean;
    disableProtectedOnlyFields: boolean;
    disablePublicOnlyFields: boolean;
    disablePublicGetterSetterFields: boolean;
    discardNonMockSources: boolean;
    addMockJSONMappings: boolean;
    addMockJavaSingleSource: boolean;
    addMockJavaSources: boolean;
    addMockJavaCachedSource: boolean;
    addMockXMLInstanceSources: boolean;
    addMockXMLSchemaSources: boolean;
    addMockJSONSources: boolean;
    addMockJSONInstanceSources: boolean;
    addMockJSONSchemaSources: boolean;
    addMockJavaTarget: boolean;
    addMockJavaCachedTarget: boolean;
    addMockXMLInstanceTarget: boolean;
    addMockXMLSchemaTarget: boolean;
    addMockJSONTarget: boolean;
    addMockJSONInstanceTarget: boolean;
    addMockJSONSchemaTarget: boolean;
    debugDocumentServiceCalls: boolean;
    debugDocumentParsing: boolean;
    debugMappingServiceCalls: boolean;
    debugClassPathServiceCalls: boolean;
    debugValidationServiceCalls: boolean;
    debugFieldActionServiceCalls: boolean;
    mappingInitialized: boolean;
    fieldActionsInitialized: boolean;
}
export declare class ConfigModel {
    static mappingServicesPackagePrefix: string;
    static javaServicesPackagePrefix: string;
    initCfg: DataMapperInitializationModel;
    showMappingDetailTray: boolean;
    showMappingTable: boolean;
    showNamespaceTable: boolean;
    showLinesAlways: boolean;
    showTypes: boolean;
    showMappedFields: boolean;
    showUnmappedFields: boolean;
    currentDraggedField: Field;
    documentService: DocumentManagementService;
    mappingService: MappingManagementService;
    errorService: ErrorHandlerService;
    initializationService: InitializationService;
    sourceDocs: DocumentDefinition[];
    targetDocs: DocumentDefinition[];
    propertyDoc: DocumentDefinition;
    constantDoc: DocumentDefinition;
    mappingFiles: string[];
    mappings: MappingDefinition;
    errors: ErrorInfo[];
    validationErrors: ErrorInfo[];
    private static cfg;
    constructor();
    static getConfig(): ConfigModel;
    static setConfig(cfg: ConfigModel): void;
    addJavaDocument(documentIdentifier: string, isSource: boolean): DocumentDefinition;
    addJSONDocument(documentIdentifier: string, documentContents: string, isSource: boolean): DocumentDefinition;
    addJSONInstanceDocument(documentIdentifier: string, documentContents: string, isSource: boolean): DocumentDefinition;
    addJSONSchemaDocument(documentIdentifier: string, documentContents: string, isSource: boolean): DocumentDefinition;
    addXMLInstanceDocument(documentIdentifier: string, documentContents: string, isSource: boolean): DocumentDefinition;
    addXMLSchemaDocument(documentIdentifier: string, documentContents: string, isSource: boolean): DocumentDefinition;
    getDocsWithoutPropertyDoc(isSource: boolean): DocumentDefinition[];
    getDocs(isSource: boolean): DocumentDefinition[];
    hasJavaDocuments(): boolean;
    isClassPathResolutionNeeded(): boolean;
    getDocForShortIdentifier(shortIdentifier: string, isSource: boolean): DocumentDefinition;
    getFirstXmlDoc(isSource: boolean): DocumentDefinition;
    getAllDocs(): DocumentDefinition[];
    documentsAreLoaded(): boolean;
    private createDocument(documentIdentifier, isSource, docType, documentContents);
}