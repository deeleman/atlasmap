import { MappingModel, FieldMappingPair } from '../models/mapping.model';
import { Field } from '../models/field.model';
import { MappingDefinition } from '../models/mapping.definition.model';
import { DocumentDefinition } from '../models/document.definition.model';
import { LookupTable } from '../models/lookup.table.model';
import { ConfigModel } from '../models/config.model';
export declare class MappingSerializer {
    static serializeMappings(cfg: ConfigModel): any;
    private static serializeDocuments(docs, mappingDefinition);
    private static serializeProperties(docDef);
    private static serializeLookupTables(mappingDefinition);
    private static serializeFields(fieldPair, isSource, cfg);
    static deserializeMappingServiceJSON(json: any, mappingDefinition: MappingDefinition, cfg: ConfigModel): void;
    static deserializeDocs(json: any, mappingDefinition: MappingDefinition): DocumentDefinition[];
    static deserializeMappings(json: any, cfg: ConfigModel): MappingModel[];
    static deserializeFieldMapping(fieldMapping: any, docRefs: any, cfg: ConfigModel): FieldMappingPair;
    static deserializeProperties(jsonMapping: any): Field[];
    static deserializeLookupTables(jsonMapping: any): LookupTable[];
    private static addFieldIfDoesntExist(fieldPair, field, isSource, docRefs, cfg);
}
